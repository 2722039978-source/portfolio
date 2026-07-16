import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GITHUB_USERNAME } from '../../data/profile'
import {
  fetchGitHubRepos,
  fetchGitHubEvents,
  formatGitHubEvent,
  timeAgo,
  type GitHubRepo,
  type GitHubEvent,
} from '../../services/github'
import { staggerContainer, staggerItem } from '../../lib/motion'

export function ProjectPanel() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchGitHubRepos(GITHUB_USERNAME, 5),
      fetchGitHubEvents(GITHUB_USERNAME, 6),
    ]).then(([repoData, eventData]) => {
      setRepos(repoData)
      setEvents(eventData)
      setLoading(false)
    })
  }, [])

  const languages = repos
    .map((r) => r.language)
    .filter((l): l is string => !!l)
    .reduce<Record<string, number>>((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1
      return acc
    }, {})

  return (
    <aside className="flex flex-col gap-5">
      {/* 仓库列表 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="panel-glass p-4 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-4 bg-stellar/30" />
          <h2 className="text-[10px] font-mono tracking-[0.2em] text-stellar font-semibold">
            代码仓库
          </h2>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer h-14 rounded" />
            ))}
          </div>
        ) : repos.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs font-mono text-frost-400">暂无仓库数据</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-1.5">
            {repos.map((repo) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                variants={staggerItem}
                className="block p-3 bg-stellar-light/20 border border-stellar/10 rounded hover:border-stellar/30 hover:bg-stellar-light/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-frost-700 group-hover:text-stellar transition-colors truncate">
                      {repo.name}
                    </h4>
                    {repo.description && (
                      <p className="text-[10px] text-frost-400 line-clamp-1 mt-0.5">
                        {repo.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  {repo.language && (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-frost-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-stellar" />
                      {repo.language}
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-frost-400">
                    ★ {repo.stargazers_count}
                  </span>
                  <span className="text-[9px] font-mono text-frost-400">
                    {timeAgo(repo.updated_at)}前更新
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* 最近活动 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="panel-glass p-4 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-4 bg-aurora/30" />
          <h2 className="text-[10px] font-mono tracking-[0.2em] text-aurora font-semibold">
            最近活动
          </h2>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer h-6 rounded" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-xs text-frost-400 text-center py-3">暂无最近活动</p>
        ) : (
          <div className="relative">
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-black/[0.06]" />
            <div className="space-y-2">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="relative pl-5">
                  <div className="absolute left-[4px] top-1.5 w-1.5 h-1.5 rounded-full bg-aurora/40" />
                  <p className="text-[10px] text-frost-500 leading-relaxed">
                    {formatGitHubEvent(event)}
                  </p>
                  <span className="text-[8px] font-mono text-frost-400">
                    {timeAgo(event.created_at)}前
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* 语言分布 */}
      {Object.keys(languages).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="panel-glass p-4 rounded-lg"
        >
          <h3 className="text-[10px] font-mono tracking-[0.2em] text-stellar font-semibold mb-3">
            编程语言
          </h3>
          <div className="space-y-2">
            {Object.entries(languages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([lang, count]) => (
                <div key={lang} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-frost-500 w-16 truncate">{lang}</span>
                  <div className="flex-1 h-1.5 bg-stellar-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stellar/40 rounded-full"
                      style={{ width: `${(count / repos.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-frost-400">{count}</span>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </aside>
  )
}
