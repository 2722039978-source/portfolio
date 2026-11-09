import { expect, test, type Page } from '@playwright/test'
import { blogPosts } from '../src/data/blog-posts'

const widths = [320, 375, 390, 640, 641, 768, 960, 1280, 1440, 1920]
const routes = ['/', '/blog', '/blog/lsm-tree-from-scratch', '/blog/noosphere-platform']
const themes = ['light', 'dark'] as const

async function setTheme(page: Page, theme: 'light' | 'dark') {
  if (await page.locator('html').getAttribute('data-theme') !== theme) {
    await page.getByRole('button', {
      name: theme === 'dark' ? '切换到深色主题' : '切换到浅色主题',
      exact: true,
    }).click()
  }
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
}

async function measurePage(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  return page.evaluate(() => {
    const heading = document.querySelector('h1')!
    const main = document.querySelector('main')!
    const text = document.querySelector('article p, main p')
    return {
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      mainWidth: main.getBoundingClientRect().width,
      headingWidth: heading.getBoundingClientRect().width,
      headingFontSize: getComputedStyle(heading).fontSize,
      headingLineHeight: getComputedStyle(heading).lineHeight,
      bodyFontSize: text ? getComputedStyle(text).fontSize : null,
      bodyLineHeight: text ? getComputedStyle(text).lineHeight : null,
    }
  })
}

test('全部响应式尺寸与主题保持阅读布局及内部链接', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', '完整尺寸检查由 desktop 项目执行')
  test.setTimeout(180_000)
  const evidence: object[] = []
  const knownPaths = new Set(['/', '/blog', ...blogPosts.map(post => `/blog/${post.id}`)])
  const anchorsByPath = new Map<string, Set<string>>()
  const referencedAnchors = new Map<string, { path: string; id: string }>()

  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 })
    for (const path of routes) {
      await page.goto(path)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('main')).toBeVisible()
      for (const theme of themes) {
        await setTheme(page, theme)
        const dimensions = await measurePage(page)
        expect(dimensions.documentWidth, `${width} ${path} ${theme}`).toBeLessThanOrEqual(dimensions.viewportWidth + 1)
        expect(dimensions.bodyWidth, `${width} ${path} ${theme}`).toBeLessThanOrEqual(dimensions.viewportWidth + 1)

        const scrollAreas = await page.locator('article pre, article table').evaluateAll(elements => elements.map(element => {
          let container: HTMLElement | null = element as HTMLElement
          while (container && container.tagName !== 'ARTICLE' && !['auto', 'scroll'].includes(getComputedStyle(container).overflowX)) {
            container = container.parentElement
          }
          const isScrollArea = !!container && ['auto', 'scroll'].includes(getComputedStyle(container).overflowX)
          const maximum = container ? container.scrollWidth - container.clientWidth : 0
          const previous = container?.scrollLeft ?? 0
          if (container && maximum > 1) container.scrollLeft = Math.min(maximum, 8)
          const moved = maximum <= 1 || (container?.scrollLeft ?? 0) > 0
          if (container) container.scrollLeft = previous
          const bounds = container?.getBoundingClientRect()
          return { element: element.tagName, isScrollArea, maximum, moved, left: bounds?.left ?? -1, right: bounds?.right ?? -1 }
        }))
        for (const area of scrollAreas) {
          expect(area.isScrollArea, `${path} ${area.element} 局部滚动容器`).toBe(true)
          expect(area.moved, `${path} ${area.element} 水平滚动`).toBe(true)
          expect(area.left).toBeGreaterThanOrEqual(-1)
          expect(area.right).toBeLessThanOrEqual(dimensions.viewportWidth + 1)
        }
        evidence.push({ path, width, theme, ...dimensions, scrollAreas })
      }

      const ids = await page.locator('[id]').evaluateAll(elements => elements.map(element => element.id))
      anchorsByPath.set(path, new Set(ids))
      const links = await page.locator('a').evaluateAll(elements => elements.map(element => element.getAttribute('href')))
      const origin = new URL(page.url()).origin
      for (const href of links) {
        expect(href, `${path} 链接目标`).not.toBeNull()
        expect(href?.trim(), `${path} 链接目标`).not.toBe('')
        expect(href, `${path} 链接目标`).not.toBe('#')
        const target = new URL(href!, page.url())
        if (target.origin !== origin) continue
        expect(knownPaths.has(target.pathname), `${path} → ${target.pathname}`).toBe(true)
        if (target.hash) {
          const id = decodeURIComponent(target.hash.slice(1))
          referencedAnchors.set(`${target.pathname}#${id}`, { path: target.pathname, id })
        }
      }
    }
  }
  for (const [href, target] of referencedAnchors) {
    if (!anchorsByPath.has(target.path)) {
      await page.goto(target.path)
      const ids = await page.locator('[id]').evaluateAll(elements => elements.map(element => element.id))
      anchorsByPath.set(target.path, new Set(ids))
    }
    expect(anchorsByPath.get(target.path)?.has(target.id), href).toBe(true)
  }
  await testInfo.attach('responsive-dimensions', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' })
})

test('十八个字符与最大字距保持实验区域可读', async ({ page }, testInfo) => {
  test.setTimeout(60_000)
  const evidence: object[] = []
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/')
    await page.getByLabel('实验文字', { exact: true }).fill('WWWWWWWWWWWWWWWWWW')
    await page.getByLabel('字距', { exact: true }).fill('8')
    await expect(page.locator('.type-output')).toHaveText('WWWWWWWWWWWWWWWWWW')
    await expect(page.locator('.type-output')).toHaveCSS('letter-spacing', '8px')
    for (const theme of themes) {
      await setTheme(page, theme)
      const dimensions = await measurePage(page)
      expect(dimensions.documentWidth, `${width} ${theme}`).toBeLessThanOrEqual(dimensions.viewportWidth + 1)
      const output = await page.locator('.type-output').evaluate(element => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        fontSize: getComputedStyle(element).fontSize,
        letterSpacing: getComputedStyle(element).letterSpacing,
        textLength: element.textContent?.length,
      }))
      expect(output.textLength).toBe(18)
      expect(output.scrollWidth).toBeLessThanOrEqual(output.clientWidth + 1)
      evidence.push({ width, theme, ...dimensions, output })
    }
  }
  await testInfo.attach('typography-experiment-dimensions', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' })
})
