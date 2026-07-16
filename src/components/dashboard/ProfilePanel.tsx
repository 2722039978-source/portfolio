import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { profileData, GITHUB_USERNAME } from '../../data/profile'
import { fetchGitHubProfile, type GitHubProfile } from '../../services/github'
import { staggerContainer, staggerItem } from '../../lib/motion'

export function ProfilePanel() {
  const [gh, setGh] = useState<GitHubProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGitHubProfile(GITHUB_USERNAME).then((data) => {
      setGh(data)
      setLoading(false)
    })
  }, [])

  const avatarUrl = gh?.avatar_url || `https://github.com/${GITHUB_USERNAME}.png`
  const displayName = gh?.name || profileData.name
  const bio = gh?.bio || profileData.bio

  return (
    <aside className="flex flex-col gap-5">
      {/* 头像 + 身份 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="panel-glass p-5 rounded-lg"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="relative shrink-0">
            <div className="absolute -inset-[3px] rounded-full border-2 border-stellar/20" />
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-black/[0.06] bg-stellar-light">
              {loading ? (
                <div className="w-full h-full shimmer" />
              ) : (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${displayName}&background=eff3ff&color=2563eb&size=128`
                  }}
                />
              )}
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-frost truncate">{displayName}</h2>
            <p className="text-[11px] font-mono text-stellar font-medium tracking-wide">{profileData.role}</p>
            <p className="text-[11px] text-frost-400 mt-0.5">{profileData.location}</p>
          </div>
        </div>

        <p className="text-xs text-frost-400 italic border-l-2 border-stellar/20 pl-3 mb-4">
          {profileData.tagline}
        </p>

        {/* GitHub 统计 */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: '仓库', value: gh?.public_repos ?? '—' },
            { label: '关注者', value: gh?.followers ?? '—' },
            { label: '关注中', value: gh?.following ?? '—' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-2 bg-stellar-light/50 border border-stellar/10 rounded">
              <div className="text-sm font-mono font-bold text-stellar">
                {loading ? <span className="shimmer inline-block w-8 h-4 rounded" /> : stat.value}
              </div>
              <div className="text-[9px] font-mono text-frost-400 tracking-wider mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-frost-500 leading-relaxed whitespace-pre-line line-clamp-5">
          {bio}
        </p>
      </motion.div>

      {/* 技能 */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="panel-glass p-4 rounded-lg"
      >
        <h3 className="text-[10px] font-mono tracking-[0.2em] text-stellar font-semibold mb-3">
          技术栈
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {profileData.skills.map((skill) => (
            <motion.span
              key={skill}
              variants={staggerItem}
              className="text-[11px] text-frost-500 bg-stellar-light/50 border border-stellar/10 px-2.5 py-1 rounded hover:border-stellar/30 hover:text-frost-700 transition-colors duration-200 cursor-default"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* 社交 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="panel-glass p-4 rounded-lg"
      >
        <h3 className="text-[10px] font-mono tracking-[0.2em] text-stellar font-semibold mb-3">
          联系
        </h3>
        <div className="space-y-1.5">
          {[
            ...profileData.social,
            ...(gh ? [{ label: 'GitHub', url: gh.html_url, icon: 'GH' }] : []),
          ].slice(0, 3).map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 bg-stellar-light/30 border border-stellar/10 rounded hover:border-stellar/20 transition-all duration-200 group"
            >
              <span className="text-[10px] font-mono text-stellar/60 w-6 group-hover:text-stellar transition-colors">
                [{link.icon}]
              </span>
              <span className="text-xs text-frost-500 group-hover:text-frost-700 transition-colors">
                {link.label}
              </span>
              <span className="ml-auto text-stellar/30 group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          ))}
        </div>
      </motion.div>
    </aside>
  )
}
