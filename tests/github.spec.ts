import { expect, test, type Page } from '@playwright/test'

const githubUsername = process.env.VITE_GITHUB_USERNAME?.trim() ?? ''
test.skip(!githubUsername, '设置 VITE_GITHUB_USERNAME 后执行真实 GitHub 集成检查')

interface NetworkRecord {
  url: string
  status?: number
  failure?: string
}

function recordGitHubNetwork(page: Page): NetworkRecord[] {
  const records: NetworkRecord[] = []
  page.on('response', response => {
    if (response.url().startsWith('https://api.github.com/')) records.push({ url: response.url(), status: response.status() })
  })
  page.on('requestfailed', request => {
    if (request.url().startsWith('https://api.github.com/')) records.push({ url: request.url(), failure: request.failure()?.errorText })
  })
  return records
}

test('GitHub 真实请求具有可阅读结果和访问入口', async ({ page }, testInfo) => {
  const records = recordGitHubNetwork(page)
  const runtimeErrors: string[] = []
  page.on('pageerror', error => runtimeErrors.push(error.message))
  await page.goto('/')
  const section = page.getByTestId('github-activity')
  await expect(section.getByRole('button', { name: '刷新 GitHub', exact: true })).toBeEnabled({ timeout: 12000 })
  await expect(section.getByRole('link', { name: '访问 GitHub 主页' })).toHaveAttribute('href', `https://github.com/${githubUsername}`)
  await expect(section.getByRole('heading', { name: '最近更新的仓库' })).toBeVisible()
  await expect(section.getByRole('heading', { name: '最近公开活动' })).toBeVisible()
  const completedRequests = records.filter(record => record.failure !== 'net::ERR_ABORTED')
  expect(completedRequests.length).toBeGreaterThanOrEqual(3)
  const successfulRequests = completedRequests.filter(record => record.status === 200)
  for (const record of completedRequests) {
    const panel = record.url.includes('/repos?') ? section.locator('.github-repositories')
      : record.url.includes('/events/') ? section.locator('.github-events')
        : section.locator('.github-profile')
    if (record.status !== 200) await expect(panel.getByRole('button', { name: /重新获取/ })).toBeVisible()
    else if (record.url.includes('/repos?')) expect((await panel.innerText()).trim().length).toBeGreaterThan(8)
    else if (record.url.includes('/events/')) expect((await panel.innerText()).trim().length).toBeGreaterThan(8)
    else await expect(panel.locator('.github-stats')).toBeVisible()
  }
  expect(runtimeErrors).toEqual([])
  testInfo.annotations.push({ type: 'GitHub API', description: `三个请求中 ${successfulRequests.length} 个返回 HTTP 200；完整网络记录见附件。` })
  await testInfo.attach('github-live-network', { body: JSON.stringify(records, null, 2), contentType: 'application/json' })
})

test('GitHub 离线提示与恢复连接后的重试可用', async ({ page, context }, testInfo) => {
  const records = recordGitHubNetwork(page)
  const runtimeErrors: string[] = []
  page.on('pageerror', error => runtimeErrors.push(error.message))
  await page.goto('/')
  const section = page.getByTestId('github-activity')
  const refresh = section.getByRole('button', { name: '刷新 GitHub', exact: true })
  await expect(refresh).toBeEnabled({ timeout: 12000 })

  await context.setOffline(true)
  await refresh.click()
  await expect(section.getByText('网络连接暂时不可用，请恢复连接后重试。', { exact: true })).toHaveCount(3)
  await expect(section.getByRole('button', { name: '重新获取个人资料' })).toBeVisible()
  await expect(section.getByRole('button', { name: '重新获取仓库', exact: true })).toBeVisible()
  await expect(section.getByRole('button', { name: '重新获取活动', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(records.some(record => record.failure === 'net::ERR_INTERNET_DISCONNECTED')).toBe(true)

  const countBeforeRetry = records.length
  await context.setOffline(false)
  await section.getByRole('button', { name: '重新获取个人资料' }).click()
  await expect(refresh).toBeEnabled({ timeout: 12000 })
  expect(records.length).toBeGreaterThanOrEqual(countBeforeRetry + 3)
  await expect(section.getByRole('link', { name: '访问 GitHub 主页' })).toBeVisible()
  await expect(section.getByText('正在获取个人资料…')).toHaveCount(0)
  expect(runtimeErrors).toEqual([])
  await testInfo.attach('github-offline-and-retry-network', { body: JSON.stringify(records, null, 2), contentType: 'application/json' })
})
