import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../data/blog-posts'
import { formatDate } from '../lib/utils'

const cardColors = [
  'linear-gradient(180deg, #e8f4fd 0%, #ffffff 100%)',
  'linear-gradient(180deg, #f5edff 0%, #ffffff 100%)',
  'linear-gradient(180deg, #fff5e6 0%, #ffffff 100%)',
  'linear-gradient(180deg, #e6f9ed 0%, #ffffff 100%)',
  'linear-gradient(180deg, #ffe8ed 0%, #ffffff 100%)',
  'linear-gradient(180deg, #e6f6fd 0%, #ffffff 100%)',
]

export default function Blog() {
  return (
    <main className="min-h-screen pt-20 pb-32 px-6 bg-void">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-14">
          <h1 className="text-3xl font-bold text-frost-700 tracking-tight mb-3">📝 开发日志</h1>
          <p className="text-frost-400">关于代码、架构、设计和工程实践的深度思考。</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link to={`/blog/${post.id}`}>
                <article className="card-apple p-6 h-full flex flex-col min-h-[300px] group" style={{ background: cardColors[i % cardColors.length] }}>
                  <div className="w-10 h-1 rounded-full mb-4 opacity-50" style={{ backgroundColor: post.coverColor }} />
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-mono text-frost-400">{formatDate(post.date)}</span>
                    <span className="text-[10px] font-mono text-frost-400">{post.readTime} 分钟</span>
                  </div>
                  <h2 className="text-base font-bold text-frost-700 mb-2 leading-snug group-hover:text-stellar transition-colors line-clamp-2">{post.title}</h2>
                  <p className="text-xs text-frost-400 leading-relaxed mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0,3).map(tag => (
                      <span key={tag} className="text-[9px] font-mono text-frost-400 bg-white/40 px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
