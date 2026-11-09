import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BlogPost } from '../data/blog-posts'
import { categories, formatDate } from '../data/editorial'

export default function JournalRow({ post, index }: { post: BlogPost; index: number }) {
  return <article className="journal-row">
    <span className="row-number mono">{String(index + 1).padStart(2, '0')}</span>
    <div className="journal-content">
      <div className="article-meta"><span>{categories[post.id]}</span><span className="mono"><time dateTime={post.date}>{formatDate(post.date)}</time> / {post.readTime} MIN READ</span></div>
      <h3><Link to={`/blog/${post.id}`}>{post.title}</Link></h3>
      <p>{post.excerpt}</p>
      <div className="tag-list">{post.tags.map(tag => <Link className="tag" key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>
    </div>
    <Link className="round-link" to={`/blog/${post.id}`} aria-label={`阅读：${post.title}`}><ArrowUpRight size={22} aria-hidden="true" /></Link>
  </article>
}
