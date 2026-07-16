/**
 * GitHub API 服务层
 * 用于获取真实的 GitHub 个人资料、仓库和活动数据
 */

export interface GitHubProfile {
  login: string
  name: string
  avatar_url: string
  bio: string
  location: string
  company: string | null
  blog: string
  public_repos: number
  followers: number
  following: number
  created_at: string
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
  topics: string[]
  visibility: string
}

export interface GitHubEvent {
  id: string
  type: string
  created_at: string
  repo: { name: string; url: string }
  payload: {
    commits?: { message: string }[]
    action?: string
    ref?: string
  }
}

const GITHUB_API = 'https://api.github.com'

/**
 * 获取 GitHub 用户资料
 */
export async function fetchGitHubProfile(username: string): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${username}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * 获取 GitHub 用户仓库列表
 */
export async function fetchGitHubRepos(username: string, count: number = 6): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=${count}&type=owner`
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

/**
 * 获取 GitHub 用户最近活动
 */
export async function fetchGitHubEvents(username: string, count: number = 5): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${username}/events/public?per_page=${count}`
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

/**
 * 解析事件为可读的文本
 */
export function formatGitHubEvent(event: GitHubEvent): string {
  switch (event.type) {
    case 'PushEvent':
      return `Pushed ${event.payload.commits?.length || 0} commits to ${event.repo.name.split('/')[1]}`
    case 'CreateEvent':
      return `Created in ${event.repo.name.split('/')[1]}`
    case 'WatchEvent':
      return `Starred ${event.repo.name}`
    case 'ForkEvent':
      return `Forked ${event.repo.name}`
    case 'IssuesEvent':
      return `${event.payload.action || 'Updated'} issue in ${event.repo.name.split('/')[1]}`
    case 'PullRequestEvent':
      return `${event.payload.action || 'Updated'} PR in ${event.repo.name.split('/')[1]}`
    default:
      return `${event.type.replace('Event', '')} on ${event.repo.name.split('/')[1]}`
  }
}

/**
 * 格式化时间为相对时间
 */
export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}
