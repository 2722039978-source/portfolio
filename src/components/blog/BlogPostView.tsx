import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { BlogPost } from '../../data/blog-posts'
import { formatDate } from '../../lib/utils'

interface BlogPostViewProps { post: BlogPost }

export function BlogPostView({ post }: BlogPostViewProps) {
  useEffect(() => { window.scrollTo(0, 0) }, [post.id])

  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: JSX.Element[] = []
    let inCodeBlock = false
    let codeContent = ''

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${i}`} className="bg-stellar-light/30 border border-stellar/10 p-6 rounded-lg my-6 overflow-x-auto">
              <code className="text-sm text-frost-600 font-mono leading-relaxed whitespace-pre">{codeContent.trim()}</code>
            </pre>
          )
          codeContent = ''
          inCodeBlock = false
        } else { inCodeBlock = true }
        return
      }
      if (inCodeBlock) { codeContent += line + '\n'; return }

      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold text-frost mt-10 mb-4 pb-2 border-b border-black/[0.06]">{line.slice(3)}</h2>)
        return
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-xl font-semibold text-frost mt-8 mb-3">{line.slice(4)}</h3>)
        return
      }

      if (line.startsWith('|')) {
        const isSep = /^\|[\s-:|]+\|$/.test(line)
        if (isSep) return
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim())
        const isHeader = lines[i + 1] && /^\|[\s-:|]+\|$/.test(lines[i + 1])
        elements.push(
          <div key={i} className={`grid gap-4 py-2 border-b border-black/[0.04] text-sm ${isHeader ? 'font-semibold text-frost-700' : 'text-frost-500'}`}
            style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
            {cells.map((cell, ci) => (<span key={ci}>{cell.replace(/\*\*/g, '')}</span>))}
          </div>
        )
        return
      }

      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="border-l-3 border-stellar/30 pl-5 py-1 my-4 text-frost-500 italic leading-relaxed bg-stellar-light/20 rounded-r">
            {renderInline(line.slice(2))}
          </blockquote>
        )
        return
      }

      if (line === '---') { elements.push(<hr key={i} className="divider-tech my-8" />); return }
      if (line.trim() === '') { elements.push(<div key={i} className="h-3" />); return }

      elements.push(<p key={i} className="text-frost-600 leading-[1.85] text-[15px]">{renderInline(line)}</p>)
    })
    return elements
  }

  const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-frost-700 font-semibold">{part.slice(2, -2)}</strong>
      }
      const codeParts = part.split(/(`[^`]+`)/g)
      return codeParts.map((cp, j) => {
        if (cp.startsWith('`') && cp.endsWith('`')) {
          return <code key={`${i}-${j}`} className="text-stellar bg-stellar-light/50 px-1.5 py-0.5 text-sm font-mono rounded">{cp.slice(1, -1)}</code>
        }
        return cp
      })
    })
  }

  return (
    <article className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-frost-400 hover:text-stellar transition-colors">
          <span>←</span> 返回博客
        </Link>
      </motion.div>

      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
        <div className="w-full h-1 mb-6 rounded" style={{ backgroundColor: post.coverColor }} />
        <div className="flex items-center gap-3 text-xs font-mono text-frost-400 mb-4">
          <span className="tracking-wider">{formatDate(post.date)}</span>
          <span>·</span>
          <span>阅读 {post.readTime} 分钟</span>
        </div>
        <h1 className="text-display-md text-frost-700 mb-5 leading-tight">{post.title}</h1>
        <p className="text-lg text-frost-500 leading-relaxed mb-6">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono text-stellar bg-stellar-light/50 border border-stellar/10 px-3 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </motion.header>

      <div className="divider-tech mb-10" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
        {renderContent(post.content)}
      </motion.div>

      <div className="divider-tech my-14" />
      <div className="text-center">
        <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 border border-black/[0.08] rounded-lg hover:border-stellar/30 hover:bg-stellar-light/30 transition-all duration-300">
          <span className="text-xs font-mono tracking-widest text-frost-400 hover:text-stellar transition-colors">
            ← 返回全部文章
          </span>
        </Link>
      </div>
    </article>
  )
}
