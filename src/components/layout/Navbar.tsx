import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GooglePig } from '../dashboard/GooglePig'

export function Navbar() {
  const location = useLocation()
  return (
    <motion.header initial={{ y: -40 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="sticky top-0 z-50 bg-void/80 backdrop-blur-xl border-b border-black/[0.04]">
      <nav className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <GooglePig size={22} />
          <span className="text-xs font-bold text-frost-700 tracking-tight">NOOSPHERE</span>
        </Link>
        <div className="flex items-center gap-2">
          {[{ path: '/', label: '仪表盘' }, { path: '/blog', label: '博客' }].map(l => (
            <Link key={l.path} to={l.path}
              className={`px-3 py-1.5 text-[11px] font-mono tracking-wide rounded-full transition-all duration-200 ${
                location.pathname === l.path ? 'bg-frost-700 text-white' : 'text-frost-400 hover:text-frost-600'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </motion.header>
  )
}
