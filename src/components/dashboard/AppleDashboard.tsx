import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PigEmoji } from './PigEmoji'
import { GooglePig } from './GooglePig'
import { profileData, GITHUB_USERNAME } from '../../data/profile'
import { blogPosts } from '../../data/blog-posts'
import { formatDate } from '../../lib/utils'
import {
  fetchGitHubProfile, fetchGitHubRepos, fetchGitHubEvents,
  formatGitHubEvent, timeAgo,
  type GitHubProfile, type GitHubRepo, type GitHubEvent,
} from '../../services/github'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.07 },
  }),
}

export function AppleDashboard() {
  const [gh, setGh] = useState<GitHubProfile | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchGitHubProfile(GITHUB_USERNAME),
      fetchGitHubRepos(GITHUB_USERNAME, 5),
      fetchGitHubEvents(GITHUB_USERNAME, 8),
    ]).then(([p, r, e]) => { setGh(p); setRepos(r); setEvents(e); setLoading(false) })
  }, [])

  const displayName = gh?.name || profileData.name
  const avatarUrl = gh?.avatar_url || `https://github.com/${GITHUB_USERNAME}.png`
  const imgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${displayName}&background=0071e3&color=fff&size=160`
  }

  return (
    <main className="relative min-h-screen bg-void pb-16">
      <PigEmoji />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 pt-6">
        <div className="flex flex-col lg:flex-row gap-5">

          {/* ====== 左侧栏 ====== */}
          <aside className="lg:w-[300px] shrink-0 flex flex-col gap-4">

            {/* 头像卡片 — bg-1.jpg */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="card-hero" style={{ minHeight: 300 }}>
              <div className="card-bg" style={{ backgroundImage: 'url(/bg-1.jpg)' }} />
              <div className="card-overlay" style={{ background: 'linear-gradient(135deg, rgba(0,113,227,0.78) 0%, rgba(172,57,255,0.62) 100%)' }} />
              <div className="card-content items-center text-center">
                <div className="relative mb-3">
                  <div className="absolute -inset-1 rounded-full bg-white/20 blur-sm" />
                  <img src={avatarUrl} alt={displayName} onError={imgError}
                    className="relative w-20 h-20 rounded-full border-3 border-white/40 object-cover" />
                </div>
                <h1 className="text-lg font-bold tracking-tight">{displayName}</h1>
                <p className="text-white/70 text-xs mt-0.5">{profileData.role}</p>
                <p className="text-white/50 text-[10px] mt-1">{profileData.location}</p>
                {gh && (
                  <div className="flex gap-4 mt-4">
                    {[['仓库', gh.public_repos], ['关注者', gh.followers], ['关注中', gh.following]].map(([label, val]) => (
                      <div key={label as string} className="text-center">
                        <div className="text-sm font-bold">{val as number}</div>
                        <div className="text-[9px] text-white/50">{label as string}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* 技能 */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="card-apple p-5" style={{ background: 'linear-gradient(180deg, #f5edff 0%, #ffffff 100%)' }}>
              <h3 className="text-[11px] font-bold text-frost-700 mb-3 tracking-tight">技术栈</h3>
              <div className="flex flex-wrap gap-1.5">
                {profileData.skills.map(s => (
                  <span key={s} className="text-[11px] text-frost-500 bg-white/60 border border-black/[0.04] px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </motion.div>

            {/* 联系 */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="card-apple p-5" style={{ background: 'linear-gradient(180deg, #e8f4fd 0%, #ffffff 100%)' }}>
              <h3 className="text-[11px] font-bold text-frost-700 mb-3 tracking-tight">联系</h3>
              <div className="space-y-1.5">
                {[...profileData.social, ...(gh ? [{ label: 'GitHub', url: gh.html_url, icon: 'GH' }] : [])].slice(0, 3).map(link => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 hover:bg-white border border-black/[0.03] transition-all text-xs text-frost-500 hover:text-stellar">
                    <span className="font-mono text-[10px]">[{link.icon}]</span> {link.label} <span className="ml-auto">→</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </aside>

          {/* ====== 主内容区 ====== */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* 博客 — bg-2.jpg */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="card-hero" style={{ minHeight: 420 }}>
              <div className="card-bg" style={{ backgroundImage: 'url(/bg-2.jpg)' }} />
              <div className="card-overlay" style={{ background: 'linear-gradient(135deg, rgba(172,57,255,0.72) 0%, rgba(255,55,95,0.48) 100%)' }} />
              <div className="card-content">
                <h2 className="text-xl font-bold tracking-tight mb-5 flex items-center gap-2">
                  <GooglePig size={22} /> 开发日志
                </h2>
                <div className="space-y-0 divide-y divide-white/[0.1]">
                  {blogPosts.map((post) => (
                    <article key={post.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-[10px] font-mono text-white/50">{formatDate(post.date)}</span>
                        <span className="text-[10px] font-mono text-white/50">阅读 {post.readTime} 分钟</span>
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] font-mono text-white/70 bg-white/[0.12] px-2 py-0.5 rounded-full">#{tag}</span>
                        ))}
                      </div>
                      <h3 className="text-base font-bold leading-snug mb-1.5">{post.title}</h3>
                      <p className="text-sm text-white/65 leading-relaxed mb-2">{post.excerpt}</p>
                      <a href={`/blog/${post.id}`} className="text-xs font-mono text-white/70 hover:text-white transition-colors tracking-wide">
                        阅读全文 →
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 底部三列 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* 代码仓库 — bg-3.jpg */}
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
                className="card-hero" style={{ minHeight: 280 }}>
                <div className="card-bg" style={{ backgroundImage: 'url(/bg-3.jpg)' }} />
                <div className="card-overlay" style={{ background: 'linear-gradient(180deg, rgba(255,159,10,0.8) 0%, rgba(255,55,95,0.5) 100%)' }} />
                <div className="card-content">
                  <h3 className="text-sm font-bold mb-3">📦 代码仓库</h3>
                  {loading ? (
                    <div className="space-y-2">{ [1,2,3].map(i => <div key={i} className="shimmer h-10 rounded-lg" />) }</div>
                  ) : (
                    <div className="space-y-2">
                      {repos.slice(0, 5).map(repo => (
                        <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                          className="block p-2.5 rounded-lg bg-white/[0.1] hover:bg-white/[0.18] backdrop-blur-sm transition-all group">
                          <p className="text-xs font-semibold truncate">{repo.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {repo.language && <span className="text-[9px] font-mono text-white/60">● {repo.language}</span>}
                            <span className="text-[9px] font-mono text-white/60">★ {repo.stargazers_count}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* 最近活动 */}
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
                className="card-apple p-5" style={{ background: 'linear-gradient(180deg, #e8f4fd 0%, #ffffff 100%)' }}>
                <h3 className="text-sm font-bold text-frost-700 mb-4">⚡ 最近活动</h3>
                {loading ? (
                  <div className="space-y-2">{ [1,2,3].map(i => <div key={i} className="shimmer h-8 rounded-lg" />) }</div>
                ) : (
                  <div className="space-y-2">
                    {events.slice(0, 6).map(event => (
                      <div key={event.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-stellar-light/30 transition-colors">
                        <span className="text-[8px] mt-1 shrink-0">●</span>
                        <div className="min-w-0">
                          <p className="text-[11px] text-frost-600 leading-relaxed">{formatGitHubEvent(event)}</p>
                          <span className="text-[9px] font-mono text-frost-400">{timeAgo(event.created_at)}前</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* 关于 Noosphere */}
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
                className="card-apple p-5" style={{ background: 'linear-gradient(180deg, #ffe8ed 0%, #ffffff 100%)' }}>
                <h3 className="text-sm font-bold text-frost-700 mb-4">✨ 关于 Noosphere</h3>
                <p className="text-xs text-frost-400 leading-relaxed mb-4">
                  CodeLens AI · Nebula Agent · DevOps Agent 组成的 AI 操作系统平台。
                </p>
                <div className="flex flex-wrap gap-1">
                  {['Go','Python','TypeScript','RAG','LSM-Tree','Docker'].map(s => (
                    <span key={s} className="text-[10px] font-mono text-rose bg-rose-light/50 px-2 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
