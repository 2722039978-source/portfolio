import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BlogPostView } from '../components/blog/BlogPostView'
import { blogPosts } from '../data/blog-posts'

export default function BlogPost() {
  const { id } = useParams<{ id: string }>()
  const post = blogPosts.find((p) => p.id === id)

  if (!post) {
    return (
      <main className="min-h-screen pt-24 pb-32 px-6 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <h1 className="text-6xl font-bold text-frost-300 mb-4">404</h1>
          <p className="text-frost-400 mb-8">这篇文章不存在或已被移除。</p>
          <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 border border-black/[0.08] rounded-lg hover:border-stellar/30 transition-all duration-300">
            <span className="text-sm font-mono tracking-widest text-frost-400">← 返回博客</span>
          </Link>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-32 px-6 bg-void">
      <BlogPostView post={post} />
    </main>
  )
}
