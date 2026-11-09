import { expect, test } from '@playwright/test'

test('默认公开配置不显示个人联系方式或请求账号数据', async ({ page }) => {
  test.skip(Boolean(process.env.VITE_GITHUB_USERNAME || process.env.VITE_CONTACT_EMAIL || process.env.VITE_PROFILE_NAME), '此检查适用于空公开资料配置')
  const githubRequests: string[] = []
  page.on('request', request => {
    if (request.url().startsWith('https://api.github.com/')) githubRequests.push(request.url())
  })
  await page.goto('/')
  await expect(page).toHaveTitle('Digital Garden')
  await expect(page.getByTestId('github-activity')).toHaveCount(0)
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0)
  await expect(page.locator('a[href^="https://github.com/"]')).toHaveCount(0)
  await page.getByRole('link', { name: '浏览文章', exact: true }).click()
  await expect(page).toHaveURL('/blog')
  expect(githubRequests).toEqual([])
})
