import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../../data/blog-posts'
import { formatDate } from '../../lib/utils'
import { staggerContainer, staggerItem } from '../../lib/motion'

export function BlogFeed() {
  return (
    <section className="flex flex-col gap-5">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-stellar/30" />
          <h2 className="text-sm font-mono tracking-[0.25em] text-stellar font-semibold">
            开发日志
          </h2>
        </div>
        <Link
          to="/blog"
          className="text-[11px] font-mono tracking-widest text-frost-400 hover:text-stellar transition-colors"
        >
          全部文章 →
        </Link>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-black/[0.06]" />

        <div className="space-y-0">
          {blogPosts.map((post) => (
            <motion.div key={post.id} variants={staggerItem}>
              <Link to={`/blog/${post.id}`} className="block group">
                <article className="relative pl-12 py-4 pr-5 hover:bg-stellar-light/30 transition-colors duration-200 rounded-lg border border-transparent hover:border-stellar/10">
                  <div className="absolute left-[15px] top-5 w-2.5 h-2.5 rounded-full border-2 border-stellar/25 bg-white group-hover:border-stellar group-hover:shadow-[0_0_10px_rgba(37,99,235,0.15)] transition-all duration-300" />

                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[10px] font-mono text-frost-400 tracking-wider">
                      {formatDate(post.date)}
                    </span>
                    <span className="text-frost-300">·</span>
                    <span className="text-[10px] font-mono text-frost-400">
                      {post.readTime} 分钟阅读
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-frost-700 group-hover:text-stellar transition-colors duration-200 leading-snug mb-1.5">
                    {post.title}
                  </h3>

                  <p className="text-xs text-frost-400 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] font-mono text-frost-400 bg-stellar-light/30 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-stellar text-lg">→</span>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
