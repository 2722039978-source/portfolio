import { expect, test } from '@playwright/test'

test('文章搜索、分类、标签和空结果可操作', async ({ page }) => {
  await page.goto('/blog')
  await expect(page.locator('.journal-row')).toHaveCount(11)
  await page.getByRole('button', { name: '设计与前端', exact: true }).click()
  await expect(page.locator('.journal-row')).toHaveCount(3)
  await page.getByRole('button', { name: '清除筛选' }).click()
  await page.getByRole('button', { name: 'LSM-Tree', exact: true }).click()
  await expect(page.locator('.journal-row')).toHaveCount(1)
  await page.reload()
  await expect(page.locator('.journal-row')).toHaveCount(1)
  await page.getByRole('button', { name: '清除筛选' }).click()
  await page.getByRole('searchbox', { name: '搜索文章' }).fill('LSM-Tree')
  await expect(page.locator('.journal-row').first()).toBeVisible()
  await page.getByRole('searchbox', { name: '搜索文章' }).fill('zzzz-unmatched-query')
  await expect(page.getByRole('heading', { name: '还没有相关记录' })).toBeVisible()
  await page.getByRole('button', { name: '查看全部文章', exact: true }).click()
  await expect(page.locator('.journal-row')).toHaveCount(11)
})

test('首页标签进入筛选列表', async ({ page }) => {
  await page.goto('/')
  await page.locator('#journal .tag').filter({ hasText: /^Noosphere$/ }).first().click()
  await expect(page).toHaveURL('/blog?tag=Noosphere')
  await expect(page.locator('.blog-sidebar .tag.selected')).toHaveText('Noosphere')
  for (const row of await page.locator('.journal-row').all()) await expect(row.locator('.tag').filter({ hasText: /^Noosphere$/ })).toHaveCount(1)
})
