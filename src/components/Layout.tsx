import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowUp, ArrowUpRight, Asterisk, Menu, Moon, Sun, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { profileData } from '../data/profile'
import '../styles/layout.css'

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(document.documentElement.dataset.theme ?? 'light')
  const menuButton = useRef<HTMLButtonElement>(null)
  const routeKey = location.pathname

  useEffect(() => {
    setMenuOpen(false)
    const frame = requestAnimationFrame(() => {
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
        target?.scrollIntoView({ behavior: 'instant' })
        target?.focus({ preventScroll: true })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        document.getElementById('main')?.focus({ preventScroll: true })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus() }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    function followSystem() {
      if (!localStorage.getItem('portfolio-theme')) {
        const next = media.matches ? 'dark' : 'light'
        document.documentElement.dataset.theme = next
        setTheme(next)
      }
    }
    media.addEventListener('change', followSystem)
    return () => media.removeEventListener('change', followSystem)
  }, [])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    localStorage.setItem('portfolio-theme', next)
    setTheme(next)
  }

  function navigateToSection(id: string) {
    setMenuOpen(false)
    if (location.pathname === '/' && location.hash === `#${id}`) {
      document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    }
  }

  return <>
    <a className="skip-link" href="#main">跳转到主要内容</a>
    <header className="site-header"><div className="header-inner container"><Link to="/" className="wordmark" aria-label={`${profileData.name} 首页`}><Asterisk size={31} strokeWidth={1.4} aria-hidden="true" /><span>{profileData.name}<span className="brand-dot">.</span></span></Link>
      <nav aria-label="主导航" className={menuOpen ? 'main-nav is-open' : 'main-nav'} id="site-navigation">
        <NavLink to="/blog" onClick={() => setMenuOpen(false)}>Journal <span>/ 文章</span></NavLink>
        <Link to="/#works" onClick={() => navigateToSection('works')}>Works <span>/ 项目</span></Link>
        <Link to="/#lab" onClick={() => navigateToSection('lab')}>Lab <span>/ 实验</span></Link>
        <Link to="/#about" onClick={() => navigateToSection('about')}>About <span>/ 关于</span></Link>
      </nav>
      <div className="header-actions"><button type="button" className="theme-button icon-button" onClick={toggleTheme} aria-label={theme === 'light' ? '切换到深色主题' : '切换到浅色主题'}>{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</button><button type="button" ref={menuButton} className="menu-button icon-button" aria-label={menuOpen ? '关闭导航' : '打开导航'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
    </div></header>
    <main id="main" tabIndex={-1}><div className="page-transition" key={routeKey}>{children}</div></main>
    <footer className="site-footer"><div className="container"><div className="footer-top"><p>Keep thinking.<br /><span>Keep making.</span></p><div><p>继续阅读，发现更多想法。</p><Link className="text-link" to="/blog">浏览文章 <ArrowUpRight size={18} /></Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {profileData.name}</span><span className="mono">A GARDEN, ALWAYS GROWING.</span><button type="button" className="back-top" aria-label="返回顶部" onClick={() => { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); document.querySelector<HTMLAnchorElement>('.wordmark')?.focus({ preventScroll: true }) }}>BACK TO TOP <ArrowUp size={14} /></button></div></div></footer>
  </>
}
