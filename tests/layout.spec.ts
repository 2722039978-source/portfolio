import { expect, test, type Page } from '@playwright/test'

async function openNavigation(page: Page) {
  const toggle = page.getByRole('button', { name: '打开导航', exact: true })
  if (await toggle.isVisible()) await toggle.click()
  return page.getByRole('navigation', { name: '主导航', exact: true })
}

test('主导航可以进入文章列表', async ({ page }) => {
  await page.goto('/')
  const navigation = await openNavigation(page)
  await expect(navigation).toBeVisible()
  await navigation.getByRole('link', { name: 'Journal / 文章', exact: true }).click()
  await expect(page).toHaveURL('/blog')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('主题切换在刷新与页面切换后保留', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: '切换到深色主题', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe('dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const navigation = await openNavigation(page)
  await navigation.getByRole('link', { name: 'Journal / 文章', exact: true }).click()
  await expect(page).toHaveURL('/blog')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: '切换到浅色主题', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  expect(await page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe('light')
})

test('移动导航支持链接关闭与 Escape 焦点恢复', async ({ page, viewport }) => {
  test.skip(!viewport || viewport.width >= 960, '移动端导航检查')
  await page.goto('/')
  const toggle = page.getByRole('button', { name: /^(打开导航|关闭导航)$/ })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-label', '关闭导航')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('navigation', { name: '主导航', exact: true })
    .getByRole('link', { name: 'Journal / 文章', exact: true }).click()
  await expect(page).toHaveURL('/blog')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toHaveAttribute('aria-label', '打开导航')
  await toggle.click()
  await page.getByRole('navigation', { name: '主导航', exact: true })
    .getByRole('link', { name: 'Journal / 文章', exact: true }).focus()
  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
})

test('跨页面项目链接定位首页项目区域', async ({ page }) => {
  await page.goto('/blog')
  const navigation = await openNavigation(page)
  await navigation.locator('a[href="/#works"]').click()
  await expect(page).toHaveURL('/#works')
  await expect(page.locator('#works')).toBeInViewport({ ratio: 0.1 })
  await expect.poll(async () => {
    const position = await page.locator('#works').boundingBox()
    return position?.y ?? -1
  }).toBeGreaterThanOrEqual(0)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  const repeatedNavigation = await openNavigation(page)
  await repeatedNavigation.locator('a[href="/#works"]').click()
  await expect(page.locator('#works')).toBeInViewport({ ratio: 0.1 })
})

test('页脚返回顶部在首页和博客页面有效', async ({ page }) => {
  for (const route of ['/', '/blog', '/blog/noosphere-vision']) {
    await page.goto(route)
    const backToTop = page.locator('footer').getByRole('button', { name: '返回顶部', exact: true })
    await backToTop.scrollIntoViewIfNeeded()
    await expect(backToTop).toBeVisible()
    await backToTop.click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(2)
  }
})

test('减少动态效果设置关闭页面动画', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.page-transition')).toHaveCSS('animation-name', 'none')
  const navigation = await openNavigation(page)
  await navigation.getByRole('link', { name: 'Journal / 文章', exact: true }).click()
  await expect(page).toHaveURL('/blog')
  await expect(page.locator('.page-transition')).toHaveCSS('animation-name', 'none')
})
