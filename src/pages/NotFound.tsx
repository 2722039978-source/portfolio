import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { profileData } from '../data/profile'

export default function NotFound() {
  useEffect(() => { document.title = `页面不存在 — ${profileData.name}` }, [])
  return <div className="container not-found"><span className="mono">404 / NOT FOUND</span><h1>这条小径尚未开放。</h1><p>请求的页面不存在，可以继续浏览文章。</p><Link className="button" to="/blog">返回文章列表 <ArrowUpRight size={18} /></Link></div>
}
