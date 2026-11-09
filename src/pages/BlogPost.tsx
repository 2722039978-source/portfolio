import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Clock3 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { blogPosts, type BlogPost as BlogPostData } from '../data/blog-posts'
import { categories, formatDate, sortedPosts } from '../data/editorial'
import { profileData } from '../data/profile'
import '../styles/article.css'

interface ContentsEntry {
  id: string
  text: string
  level: number
}

const markdownComponents: Components = {
  pre: ({ children }) => <pre tabIndex={0} aria-label="代码示例">{children}</pre>,
  table: ({ children }) => <div className="article-table-scroll" tabIndex={0} role="region" aria-label="文章表格，可横向滚动"><table>{children}</table></div>,
  a: ({ href, children }) => <a href={href} target={href?.startsWith('https://') ? '_blank' : undefined} rel={href?.startsWith('https://') ? 'noreferrer' : undefined}>{children}</a>,
}

function ArticleContent({ post }: { post: BlogPostData }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contents, setContents] = useState<ContentsEntry[]>([])
  const position = sortedPosts.findIndex(item => item.id === post.id)
  const newerPost = sortedPosts[position - 1]
  const olderPost = sortedPosts[position + 1]

  useEffect(() => {
    document.title = `${post.title} — ${profileData.name}`
    const headings = contentRef.current?.querySelectorAll<HTMLHeadingElement>('h2, h3')
    if (!headings) return
    const entries = Array.from(headings, (heading, index) => {
      heading.id = `section-${index + 1}`
      heading.tabIndex = -1
      return { id: heading.id, text: heading.textContent ?? '', level: Number(heading.tagName.slice(1)) }
    })
    setContents(entries)
    const hash = window.location.hash.slice(1)
    const target = entries.find(entry => entry.id === hash)
    if (target) document.getElementById(target.id)?.scrollIntoView({ behavior: 'instant' })
  }, [post.id, post.title])

  return <article className="article-page container">
    <div className="article-breadcrumb"><Link className="text-link" to="/blog"><ArrowLeft size={15} aria-hidden="true" />返回全部文章</Link><span className="mono">THE JOURNAL / {String(position + 1).padStart(2, '0')}</span></div>
    <header className="article-header">
      <div className="article-category"><span className="article-color" style={{ backgroundColor: post.coverColor }} aria-hidden="true" /><Link to={`/blog?category=${encodeURIComponent(categories[post.id])}`}>{categories[post.id]}</Link></div>
      <h1>{post.title}</h1>
      <p className="article-excerpt">{post.excerpt}</p>
      <div className="article-byline"><span>{profileData.name}</span><time dateTime={post.date}>{formatDate(post.date)}</time><span><Clock3 size={14} aria-hidden="true" />阅读 {post.readTime} 分钟</span></div>
      <div className="tag-list article-tags">{post.tags.map(tag => <Link className="tag" key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>
    </header>

    <div className="article-layout">
      <aside className="article-sidebar">
        <details className="article-contents" open>
          <summary><span>文章目录</span><ChevronDown size={16} aria-hidden="true" /></summary>
          <nav aria-label="文章目录"><ol>{contents.map(entry => <li key={entry.id} className={entry.level === 3 ? 'contents-subheading' : undefined}><a href={`#${entry.id}`} onClick={() => document.getElementById(entry.id)?.focus({ preventScroll: true })}>{entry.text}</a></li>)}</ol></nav>
        </details>
        <p className="article-sidebar-note mono">IDEAS TAKE ROOT<br />ONE NOTE AT A TIME.</p>
      </aside>
      <div className="article-reading-column">
        <div className="article-body" ref={contentRef}><ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{post.content}</ReactMarkdown></div>
        <div className="article-endnote"><span className="mono">END OF NOTE</span><span>感谢阅读，保持好奇。</span></div>
        <nav className="article-pagination" aria-label="相邻文章">
          {newerPost ? <Link to={`/blog/${newerPost.id}`}><span className="pagination-direction"><ArrowLeft size={15} aria-hidden="true" />较新的文章</span><strong>{newerPost.title}</strong></Link> : <Link to="/blog"><span className="pagination-direction"><ArrowLeft size={15} aria-hidden="true" />继续探索</span><strong>浏览全部文章</strong></Link>}
          {olderPost ? <Link to={`/blog/${olderPost.id}`}><span className="pagination-direction">较早的文章<ArrowRight size={15} aria-hidden="true" /></span><strong>{olderPost.title}</strong></Link> : <Link to="/blog"><span className="pagination-direction">继续探索<ArrowRight size={15} aria-hidden="true" /></span><strong>浏览全部文章</strong></Link>}
        </nav>
      </div>
    </div>
  </article>
}

function MissingArticle() {
  useEffect(() => { document.title = `文章不存在 — ${profileData.name}` }, [])
  return <div className="article-missing container"><span className="mono">404 / JOURNAL</span><h1>这篇文章尚未收录。</h1><p>可以返回文章列表，继续寻找感兴趣的内容。</p><Link className="button" to="/blog">返回文章列表<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
}

export default function BlogPost() {
  const { id } = useParams<{ id: string }>()
  const post = blogPosts.find(item => item.id === id)
  return post ? <ArticleContent key={post.id} post={post} /> : <MissingArticle />
}
