import { GooglePig } from '../dashboard/GooglePig'

export function Footer() {
  return (
    <footer className="border-t border-black/[0.04] bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-frost-400">
          <GooglePig size={18} />
          <span>© 2026 Noosphere</span>
        </div>
        <span className="text-xs text-frost-300">用 ❤️ 构建</span>
      </div>
    </footer>
  )
}
