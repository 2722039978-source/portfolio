import { cn } from '../../lib/utils'

interface HUDCornerProps {
  position: 'tl' | 'tr' | 'bl' | 'br'
  className?: string
  size?: number
}

export function HUDCorner({ position, className, size = 10 }: HUDCornerProps) {
  const styles = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0',
    bl: 'bottom-0 left-0',
    br: 'bottom-0 right-0',
  }

  const borders: Record<string, { top: boolean; left: boolean; right: boolean; bottom: boolean }> = {
    tl: { top: true, left: true, right: false, bottom: false },
    tr: { top: true, left: false, right: true, bottom: false },
    bl: { top: false, left: true, right: false, bottom: true },
    br: { top: false, left: false, right: true, bottom: true },
  }

  const b = borders[position]

  return (
    <div
      className={cn('absolute', styles[position], className)}
      style={{
        width: size,
        height: size,
        borderTopWidth: b.top ? 1 : 0,
        borderLeftWidth: b.left ? 1 : 0,
        borderRightWidth: b.right ? 1 : 0,
        borderBottomWidth: b.bottom ? 1 : 0,
        borderColor: 'rgba(37, 99, 235, 0.2)',
        borderStyle: 'solid',
      }}
    />
  )
}

export function HUDCorners({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <HUDCorner position="tl" />
      <HUDCorner position="tr" />
      <HUDCorner position="bl" />
      <HUDCorner position="br" />
      {children}
    </div>
  )
}
