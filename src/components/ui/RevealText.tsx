import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '../../lib/utils'

interface RevealTextProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
}

/**
 * 文本逐行上浮入场动画
 * 用于标题和段落
 */
export function RevealText({
  children,
  className,
  delay = 0,
  duration = 0.7,
  as: Tag = 'div',
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <span ref={ref} className={cn('block overflow-hidden', className)}>
      <motion.div
        initial={{ y: '105%', opacity: 0 }}
        animate={isInView ? { y: '0%', opacity: 1 } : {}}
        transition={{
          duration,
          ease: [0.16, 1, 0.3, 1],
          delay,
        }}
      >
        {/* @ts-ignore dynamic tag */}
        <Tag>{children}</Tag>
      </motion.div>
    </span>
  )
}

/**
 * 字符逐个显现动画 (用于短标题)
 */
export function RevealChars({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <span ref={ref} className={cn('inline-flex flex-wrap', className)}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + i * 0.03,
          }}
          className={char === ' ' ? 'w-[0.3em]' : undefined}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}
