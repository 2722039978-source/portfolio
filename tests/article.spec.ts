import { expect, test } from '@playwright/test'
import { profileData } from '../src/data/profile'
import { blogPosts } from '../src/data/blog-posts'

test('文章保留元数据并提供目录导航', async ({ page }) => {
  const post = blogPosts.find(item => item.id === 'noosphere-platform')!
  await page.goto(`/blog/${post.id}`)
  await expect(page).toHaveTitle(`${post.title} — ${profileData.name}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title)
  await expect(page.locator('.article-excerpt')).toHaveText(post.excerpt)
  await expect(page.locator('.article-byline time')).toHaveAttribute('datetime', post.date)
  for (const tag of post.tags) await expect(page.locator('.article-tags').getByRole('link', { name: tag, exact: true })).toHaveAttribute('href', `/blog?tag=${encodeURIComponent(tag)}`)
  const contents = page.getByRole('navigation', { name: '文章目录', exact: true })
  const target = contents.getByRole('link', { name: '四大工作区', exact: true })
  await target.click()
  await expect(page).toHaveURL(/#section-3$/)
  const heading = page.locator('.article-body #section-3')
  await expect(heading).toBeInViewport()
  await page.reload()
  await expect(heading).toBeInViewport()
  await expect(heading).toHaveText('四大工作区')
})

test('原文章代码和表格具有可阅读结构', async ({ page }) => {
  await page.goto('/blog/lsm-tree-from-scratch')
  const code = page.locator('.article-body pre code').first()
  await expect(code).toContainText('type MemTable struct {')
  await expect(code).toContainText('func (m *MemTable) Get(key string) ([]byte, bool) {')
  await expect(page.getByRole('region', { name: '文章表格，可横向滚动' })).toHaveCount(0)
  await expect(page.locator('.article-body pre').first()).toHaveAttribute('tabindex', '0')
  await expect(page.locator('.article-body pre').first()).toHaveCSS('overflow-x', 'auto')
  await page.goto('/blog/noosphere-platform')
  const table = page.locator('.article-body table')
  await expect(table.locator('th')).toHaveText(['类型', '用途', '生命周期'])
  await expect(table.locator('tbody tr')).toHaveCount(4)
  await expect(table.locator('tbody tr').first()).toHaveText('工作记忆当前任务上下文会话级')
  await expect(page.getByRole('region', { name: '文章表格，可横向滚动' })).toHaveCSS('overflow-x', 'auto')
  await expect(page.locator('.article-body blockquote')).toContainText('上次这个报错怎么修的？')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true)
})

test('相邻文章切换更新正文和目录', async ({ page }) => {
  await page.goto('/blog/noosphere-platform')
  await page.getByRole('navigation', { name: '相邻文章' }).getByRole('link', { name: /较早的文章/ }).click()
  await expect(page).toHaveURL('/blog/noosphere-vision')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(blogPosts[0].title)
  await expect(page.getByRole('navigation', { name: '文章目录', exact: true }).getByRole('link', { name: '命名起源', exact: true })).toBeVisible()
  await expect(page.locator('.article-body #section-1')).toHaveText('命名起源')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(2)
})

test('未知文章可以返回文章列表', async ({ page }) => {
  await page.goto('/blog/does-not-exist')
  await expect(page).toHaveTitle(`文章不存在 — ${profileData.name}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('这篇文章尚未收录。')
  await page.getByRole('link', { name: '返回文章列表' }).click()
  await expect(page).toHaveURL('/blog')
})
