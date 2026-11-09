export interface GitHubProfile {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
}

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  html_url: string
}

export interface GitHubEvent {
  id: string
  type: string
  created_at: string
  repo: { name: string }
  payload: { action?: string }
}

interface RequestOptions {
  signal: AbortSignal
  bypassCache?: boolean
}

const GITHUB_API = 'https://api.github.com'
const cache = new Map<string, { data: unknown; expires: number }>()
const cacheDuration = 5 * 60 * 1000

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
}

function isGitHubUrl(value: unknown): value is string {
  return typeof value === 'string' && URL.canParse(value) && new URL(value).origin === 'https://github.com'
}

function isDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}

function isProfile(value: unknown): value is GitHubProfile {
  return isRecord(value)
    && typeof value.login === 'string'
    && isNullableString(value.name)
    && typeof value.avatar_url === 'string'
    && URL.canParse(value.avatar_url)
    && new URL(value.avatar_url).origin === 'https://avatars.githubusercontent.com'
    && isNullableString(value.bio)
    && isNullableString(value.location)
    && isCount(value.public_repos)
    && isCount(value.followers)
    && isCount(value.following)
    && isGitHubUrl(value.html_url)
}

function isRepo(value: unknown): value is GitHubRepo {
  return isRecord(value)
    && isCount(value.id)
    && typeof value.name === 'string'
    && isNullableString(value.description)
    && isNullableString(value.language)
    && isCount(value.stargazers_count)
    && isCount(value.forks_count)
    && isDate(value.updated_at)
    && isGitHubUrl(value.html_url)
}

function isEvent(value: unknown): value is GitHubEvent {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.type === 'string'
    && isDate(value.created_at)
    && isRecord(value.repo)
    && typeof value.repo.name === 'string'
    && isRecord(value.payload)
    && (value.payload.action === undefined || typeof value.payload.action === 'string')
}

async function request<T>(path: string, validate: (value: unknown) => value is T, options: RequestOptions): Promise<T> {
  options.signal.throwIfAborted()
  const entry = cache.get(path)
  if (!options.bypassCache && entry && entry.expires > Date.now() && validate(entry.data)) return entry.data

  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
    signal: AbortSignal.any([options.signal, AbortSignal.timeout(8000)]),
  })
  if (!response.ok) {
    if (response.status === 403 || response.status === 429) throw new Error('GitHub 请求暂时受限，请稍后重试。')
    throw new Error(`GitHub 暂时无法提供数据（HTTP ${response.status}）。`)
  }
  const data: unknown = await response.json()
  if (!validate(data)) throw new Error('GitHub 返回的数据格式无法读取。')
  cache.set(path, { data, expires: Date.now() + cacheDuration })
  return data
}

export function fetchGitHubProfile(username: string, options: RequestOptions): Promise<GitHubProfile> {
  return request(`/users/${encodeURIComponent(username)}`, isProfile, options)
}

export function fetchGitHubRepos(username: string, options: RequestOptions): Promise<GitHubRepo[]> {
  return request(`/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=5&type=owner`,
    (value): value is GitHubRepo[] => Array.isArray(value) && value.every(isRepo), options)
}

export function fetchGitHubEvents(username: string, options: RequestOptions): Promise<GitHubEvent[]> {
  return request(`/users/${encodeURIComponent(username)}/events/public?per_page=6`,
    (value): value is GitHubEvent[] => Array.isArray(value) && value.every(isEvent), options)
}

export function gitHubErrorMessage(reason: unknown): string {
  if (reason instanceof DOMException && reason.name === 'TimeoutError') return 'GitHub 响应超时，请稍后重试。'
  if (reason instanceof TypeError) return '网络连接暂时不可用，请恢复连接后重试。'
  return reason instanceof Error ? reason.message : 'GitHub 数据暂时无法读取，请稍后重试。'
}

export function formatGitHubEvent(event: GitHubEvent): string {
  switch (event.type) {
    case 'PushEvent': return '推送代码'
    case 'CreateEvent': return '创建内容'
    case 'WatchEvent': return '收藏仓库'
    case 'ForkEvent': return '创建 Fork'
    case 'IssuesEvent': return event.payload.action === 'closed' ? '关闭 Issue' : '更新 Issue'
    case 'PullRequestEvent': return event.payload.action === 'closed' ? '关闭 Pull Request' : '更新 Pull Request'
    case 'ReleaseEvent': return '发布版本'
    case 'DeleteEvent': return '删除分支或标签'
    default: return '更新项目'
  }
}

export function timeAgo(dateStr: string): string {
  const elapsed = Math.max(0, Date.now() - Date.parse(dateStr))
  const minutes = Math.floor(elapsed / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(new Date(dateStr))
}
