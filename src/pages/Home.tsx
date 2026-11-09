import { ArrowDown, ArrowUpRight, Asterisk, MoveUpRight } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blog-posts'
import { profileData, GITHUB_USERNAME } from '../data/profile'
import { sortedPosts, selectedWorks } from '../data/editorial'
import JournalRow from '../components/JournalRow'
import TypePlayground from '../components/TypePlayground'
import GitHubActivity from '../components/GitHubActivity'
import '../styles/home.css'

export default function Home() {
  useEffect(() => { document.title = profileData.name }, [])
  return <>
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-main"><div className="hero-intro"><span className="status-dot" /><span>你好，我是 {profileData.name}</span><span className="mono">DEVELOPER & CREATIVE EXPLORER</span></div>
        <h1 id="hero-title">Ideas grow<br />in the <span>open.</span><Asterisk className="hero-asterisk" strokeWidth={1.1} aria-hidden="true" /></h1>
        <div className="hero-bottom"><p>在代码、设计与日常之间，<br />记录想法，让好奇心继续生长。</p><Link className="button" to="/blog">阅读我的文章 <ArrowUpRight size={18} /></Link></div>
      </div>
      <div className="hero-side"><div className="garden-art" aria-hidden="true"><div className="art-grid" /><div className="orbit-plant"><i /><i /><i /><i /><i /><i /></div><span className="art-cross cross-one">+</span><span className="art-cross cross-two">+</span><span className="art-dot" /></div><div className="hero-caption"><span className="mono">A DIGITAL GARDEN</span><span>持续记录 · 自由探索</span></div></div>
      <div className="hero-foot mono"><span>CODE, DESIGN & EVERYTHING IN BETWEEN</span><a href="#journal" aria-label="前往最新文章">SCROLL TO EXPLORE <ArrowDown size={14} /></a></div>
    </section>

    <section className="journal-section section container" id="journal" aria-labelledby="journal-title"><div className="section-head"><div><span className="section-index mono">01 / THE JOURNAL</span><h2 id="journal-title">Latest journal<span className="title-dot">.</span></h2></div><Link className="text-link" to="/blog">全部文章 <span className="mono">({String(blogPosts.length).padStart(2, '0')})</span><ArrowUpRight size={18} /></Link></div>
      <div className="journal-layout"><aside className="section-note"><p>一些思考，<br />一些构建，<br /><span>一些正在发生的事情。</span></p><span className="mono">NOTES FROM THE PROCESS</span></aside><div>{sortedPosts.slice(0, 3).map((post, index) => <JournalRow key={post.id} post={post} index={index} />)}</div></div>
    </section>

    <section className="works-section section" id="works" aria-labelledby="works-title"><div className="container"><div className="section-head"><div><span className="section-index mono">02 / SELECTED WORKS</span><h2 id="works-title">Built with curiosity<span className="title-dot">.</span></h2></div>{GITHUB_USERNAME && <a className="text-link" href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`} target="_blank" rel="noreferrer">GitHub 项目归档 <ArrowUpRight size={18} /></a>}</div>
      <div className="work-grid">{selectedWorks.map((work, index) => <article className={`work work-${work.kind}`} key={work.repo}>
        <Link className={`work-visual visual-${work.kind}`} to={`/blog/${work.slug}`} aria-label={`阅读 ${work.name} 项目记录`}><span className="mono work-number">PROJECT / 0{index + 1}</span><div className="work-symbol" aria-hidden="true">{work.kind === 'noosphere' ? <><i /><i /><i /><span>N</span></> : <span className="web-symbol">W<span>↗</span></span>}</div><span className="work-visual-label mono">{work.name} — {work.tags.join(' / ')}</span><span className="work-open"><MoveUpRight size={22} /></span></Link>
        <div className="work-info"><div><h3><Link to={`/blog/${work.slug}`}>{work.name}</Link></h3><span className="muted">{work.subtitle}</span></div><Link to={`/blog/${work.slug}`} aria-label={`阅读 ${work.name} 项目详情`}><ArrowUpRight size={24} /></Link></div><p className="work-description">{work.description}</p>
      </article>)}</div>
    </div></section>

    <section className="lab-section section container" id="lab" aria-labelledby="lab-title"><div className="section-head"><div><span className="section-index mono">03 / EXPERIMENTAL LAB</span><h2 id="lab-title">A little room to play<span className="title-dot">.</span></h2></div><span className="lab-sticker"><Asterisk size={20} /> ALWAYS CURIOUS</span></div>
      <div className="lab-intro"><p>让想法跳出笔记本。<br /><span className="muted">修改文字，调整字距，看看排版如何改变表达。</span></p><span className="mono">INTERACTIVE / TYPOGRAPHY</span></div><TypePlayground />
    </section>

    <section className="about-section section" id="about" aria-labelledby="about-title"><div className="container about-grid"><div><span className="section-index mono">04 / THE HUMAN BEHIND</span><h2 id="about-title">Hello again<span className="title-dot">.</span></h2><p className="about-name">{profileData.name} <span>↗</span></p><p className="muted">{profileData.role}{profileData.location && ` / ${profileData.location}`}</p></div><div><p className="about-tagline">{profileData.tagline}</p><p className="about-bio">{profileData.bio}</p><div className="tag-list">{profileData.skills.map(skill => <span className="tag" key={skill}>{skill}</span>)}</div><div className="social-links">{profileData.social.map(link => <a className="text-link" key={link.label} href={link.url} target={link.url.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">{link.label}<ArrowUpRight size={18} /></a>)}</div></div></div></section>
    {GITHUB_USERNAME && <div className="container"><GitHubActivity /></div>}
  </>
}
