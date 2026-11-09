import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'
import { blogPosts } from '../src/data/blog-posts'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const routes = [
  { path: '/', title: null },
  { path: '/blog', title: null },
  ...blogPosts.map((post) => ({ path: `/blog/${post.id}`, title: post.title })),
]

test('全部文章保持原始内容', () => {
  expect(blogPosts).toHaveLength(11)
  expect(new Set(blogPosts.map((post) => post.id)).size).toBe(11)
  const currentHash = createHash('sha256').update(readFileSync(resolve(projectRoot, 'src/data/blog-posts.ts'))).digest('hex')
  expect(currentHash).toBe('f98e50a74b318b7fc91cd44c18e57f3c9ae66148cac2b6d2b8ed0a238e7467a2')
})

for (const route of routes) {
  test(`页面可访问且布局正常 ${route.path}`, async ({ page }) => {
    const pageErrors: string[] = []
    const consoleErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    const response = await page.goto(route.path)
    expect(response?.ok()).toBe(true)
    await expect(page).toHaveURL(new RegExp(`${route.path.replaceAll('/', '\\/')}$`))
    await expect(page).toHaveTitle(/\S+/)
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
    if (route.title) await expect(page.locator('h1')).toHaveText(route.title)
    await page.evaluate(() => document.fonts.ready)
    expect(await page.locator('main').innerText()).not.toBe('')
    await expect(page.locator('vite-error-overlay')).toHaveCount(0)
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }))
    expect(dimensions.document, `${route.path} document`).toBeLessThanOrEqual(dimensions.viewport + 1)
    expect(dimensions.body, `${route.path} body`).toBeLessThanOrEqual(dimensions.viewport + 1)
    expect(pageErrors).toEqual([])
    expect(consoleErrors).toEqual([])
  })
}

test('文章入口与浏览器返回可以使用', async ({ page }) => {
  await page.goto('/blog')
  await page.getByRole('link', { name: blogPosts[0].title, exact: true }).click()
  await expect(page).toHaveURL(`/blog/${blogPosts[0].id}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(blogPosts[0].title)
  await page.goBack()
  await expect(page).toHaveURL('/blog')
  await expect(page.getByRole('link', { name: blogPosts[0].title, exact: true })).toBeVisible()
})
