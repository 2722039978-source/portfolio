import { useEffect } from 'react'
import { Search, X, ArrowUpRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, sortedPosts } from '../data/editorial'
import { profileData } from '../data/profile'
import JournalRow from '../components/JournalRow'
import '../styles/blog.css'

const categoryNames = [...new Set(Object.values(categories))]
const tags = [...new Set(sortedPosts.flatMap(post => post.tags))]

export default function Blog() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const tag = params.get('tag') ?? ''
  const filtered = sortedPosts.filter(post => {
    const text = `${post.title} ${post.excerpt} ${post.tags.join(' ')} ${post.content}`.toLowerCase()
    return (!query.trim() || text.includes(query.trim().toLowerCase()))
      && (!category || categories[post.id] === category)
      && (!tag || post.tags.includes(tag))
  })
  useEffect(() => { document.title = `Journal — ${profileData.name}` }, [])
  function updateFilter(key: string, value: string, replace = false) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace })
  }
  return <div className="container blog-page">
    <header className="blog-heading"><span className="section-index mono">THE DIGITAL GARDEN / JOURNAL</span><div><h1>Thoughts,<br /><span>in progress.</span></h1><p>关于代码、架构、设计和工程实践的深度思考。<br />让每一次探索，都留下可以继续生长的记录。</p></div></header>
    <div className="blog-tools"><div className="category-tabs" aria-label="文章分类"><button className={!category ? 'active' : ''} aria-pressed={!category} onClick={() => updateFilter('category', '')}>全部文章 <span>{sortedPosts.length}</span></button>{categoryNames.map(name => <button key={name} className={category === name ? 'active' : ''} aria-pressed={category === name} onClick={() => updateFilter('category', name)}>{name}</button>)}</div><label className="search-box"><Search size={17} aria-hidden="true" /><input type="search" aria-label="搜索文章" placeholder="搜索想法、关键词…" value={query} onChange={event => updateFilter('q', event.target.value, true)} /></label></div>
    <div className="blog-body"><aside className="blog-sidebar"><div><span className="mono muted">EXPLORE BY TAG</span><h2>沿着兴趣探索</h2><div className="tag-list">{tags.map(name => <button className={`tag ${tag === name ? 'selected' : ''}`} aria-pressed={tag === name} onClick={() => updateFilter('tag', tag === name ? '' : name)} key={name}>{name}</button>)}</div></div><div className="garden-note"><span className="note-star" aria-hidden="true">✳</span><p>每一篇文章，<br />都是一颗想法的种子。</p><Link className="text-link" to="/#about">认识作者 <ArrowUpRight size={15} /></Link></div></aside>
      <div className="blog-results"><div className="results-heading"><p role="status">{filtered.length} 篇文章{tag ? ` · ${tag}` : ''}</p>{(query || category || tag) && <button className="clear-filters" onClick={() => setParams({})}>清除筛选 <X size={14} /></button>}</div>
        {filtered.length ? filtered.map((post, index) => <JournalRow key={post.id} post={post} index={index} />) : <div className="empty-results"><span className="mono">NO MATCHES</span><h2>还没有相关记录</h2><p>可以尝试其他关键词，或者查看全部文章。</p><button className="button button-secondary" onClick={() => setParams({})}>查看全部文章</button></div>}
      </div>
    </div>
  </div>
}
