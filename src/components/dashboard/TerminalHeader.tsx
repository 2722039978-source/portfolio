import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GooglePig } from './GooglePig'

export function TerminalHeader() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])

  return (
    <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="sticky top-0 z-50 bg-void/80 backdrop-blur-xl border-b border-black/[0.04]">
      <div className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GooglePig size={22} />
          <span className="text-xs font-bold text-frost-700 tracking-tight">NOOSPHERE</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-frost-400">
          <span>{time.toLocaleDateString('zh-CN', { month:'2-digit', day:'2-digit' })}</span>
          <span className="text-frost-600 font-medium">
            {time.toLocaleTimeString('zh-CN', { hour:'2-digit', minute:'2-digit' })}
          </span>
        </div>
      </div>
    </motion.header>
  )
}
