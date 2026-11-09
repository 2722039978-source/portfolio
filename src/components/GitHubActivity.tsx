import { useEffect, useState } from 'react'
import { ArrowUpRight, GitFork, RefreshCw, Star } from 'lucide-react'
import { GITHUB_USERNAME, profileData } from '../data/profile'
import {
  fetchGitHubEvents, fetchGitHubProfile, fetchGitHubRepos, formatGitHubEvent,
  gitHubErrorMessage, timeAgo,
  type GitHubEvent, type GitHubProfile, type GitHubRepo,
} from '../services/github'
import '../styles/github.css'

type Resource<T> = { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; message: string }

function settledResource<T>(result: PromiseSettledResult<T>): Resource<T> {
  return result.status === 'fulfilled'
    ? { status: 'success', data: result.value }
    : { status: 'error', message: gitHubErrorMessage(result.reason) }
}

function RequestState({ resource, onRetry, label }: { resource: { status: 'loading' } | { status: 'error'; message: string }; onRetry: () => void; label: string }) {
  if (resource.status === 'loading') return <p className="github-status" role="status">正在获取{label}…</p>
  return <div className="github-status" role="status">
    <p>{resource.message}</p>
    <button type="button" className="github-retry" onClick={onRetry}>重新获取{label} <RefreshCw size={13} aria-hidden="true" /></button>
  </div>
}

export default function GitHubActivity() {
  const [attempt, setAttempt] = useState(0)
  const [profile, setProfile] = useState<Resource<GitHubProfile>>({ status: 'loading' })
  const [repos, setRepos] = useState<Resource<GitHubRepo[]>>({ status: 'loading' })
  const [events, setEvents] = useState<Resource<GitHubEvent[]>>({ status: 'loading' })
  const [avatarFailed, setAvatarFailed] = useState(false)
  const busy = [profile, repos, events].some(resource => resource.status === 'loading')
  const retry = () => setAttempt(current => current + 1)

  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal, bypassCache: attempt > 0 }
    setProfile({ status: 'loading' })
    setRepos({ status: 'loading' })
    setEvents({ status: 'loading' })
    setAvatarFailed(false)
    void Promise.allSettled([
      fetchGitHubProfile(GITHUB_USERNAME, options),
      fetchGitHubRepos(GITHUB_USERNAME, options),
      fetchGitHubEvents(GITHUB_USERNAME, options),
    ]).then(([profileResult, repoResult, eventResult]) => {
      if (controller.signal.aborted) return
      setProfile(settledResource(profileResult))
      setRepos(settledResource(repoResult))
      setEvents(settledResource(eventResult))
    })
    return () => controller.abort()
  }, [attempt])

  return <section className="github-section" aria-labelledby="github-heading" data-testid="github-activity">
    <div className="github-heading">
      <div><p className="github-eyebrow">BUILDING IN PUBLIC</p><h3 id="github-heading">在 GitHub 持续创造</h3></div>
      <button className="github-refresh" type="button" onClick={retry} disabled={busy}>
        <RefreshCw size={14} aria-hidden="true" /> {busy ? '正在同步…' : '刷新 GitHub'}
      </button>
    </div>

    <div className="github-grid">
      <div className="github-profile">
        {profile.status === 'success' ? <>
          <a className="github-identity" href={profile.data.html_url} target="_blank" rel="noreferrer">
            {!avatarFailed
              ? <img src={profile.data.avatar_url} alt={`${profile.data.login} 的 GitHub 头像`} width="52" height="52" loading="lazy" onError={() => setAvatarFailed(true)} />
              : <span className="github-initial" aria-hidden="true">K</span>}
            <span><strong>{profile.data.name || profileData.name}</strong><span className="github-handle">@{profile.data.login}</span></span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <dl className="github-stats">
            <div><dt>公开仓库</dt><dd>{profile.data.public_repos}</dd></div>
            <div><dt>关注者</dt><dd>{profile.data.followers}</dd></div>
            <div><dt>关注中</dt><dd>{profile.data.following}</dd></div>
          </dl>
        </> : <RequestState resource={profile} label="个人资料" onRetry={retry} />}
        <a className="text-link github-profile-link" href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">访问 GitHub 主页 <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>

      <div className="github-repositories">
        <h4>最近更新的仓库</h4>
        {repos.status === 'success'
          ? repos.data.length > 0 ? <ul className="github-repo-list">{repos.data.map(repo => <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noreferrer"><strong>{repo.name}</strong><ArrowUpRight size={15} aria-hidden="true" /></a>
            {repo.description && <p className="github-description">{repo.description}</p>}
            <div className="github-repo-meta">
              {repo.language && <span>{repo.language}</span>}
              <span><Star size={12} aria-hidden="true" /><span className="sr-only">Stars：</span>{repo.stargazers_count}</span>
              <span><GitFork size={12} aria-hidden="true" /><span className="sr-only">Forks：</span>{repo.forks_count}</span>
            </div>
          </li>)}</ul> : <p className="github-status">目前没有公开仓库。</p>
          : <RequestState resource={repos} label="仓库" onRetry={retry} />}
      </div>

      <div className="github-events">
        <h4>最近公开活动</h4>
        {events.status === 'success'
          ? events.data.length > 0 ? <ol className="github-event-list">{events.data.map(event => <li key={event.id}>
            <p>{formatGitHubEvent(event)}</p>
            <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer">{event.repo.name}</a>
            <time dateTime={event.created_at} title={new Date(event.created_at).toLocaleString('zh-CN')}>{timeAgo(event.created_at)}</time>
          </li>)}</ol> : <p className="github-status">最近没有公开活动。</p>
          : <RequestState resource={events} label="活动" onRetry={retry} />}
      </div>
    </div>
  </section>
}
