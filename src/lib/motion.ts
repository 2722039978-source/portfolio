import type { Variants } from 'framer-motion'

// ============================================
// 动画令牌 — 统一的缓动和变体定义
// 美学: Apple 的精确 + 游戏UI的力度感
// ============================================

export const easing = {
  expo: [0.16, 1, 0.3, 1] as const,
  back: [0.34, 1.56, 0.64, 1] as const,
  spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
  springGentle: { type: 'spring' as const, stiffness: 200, damping: 25 },
  springBouncy: { type: 'spring' as const, stiffness: 400, damping: 20 },
}

// 淡入上浮 — 最常用
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easing.expo },
  },
}

// 延迟淡入
export const fadeUpDelay = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easing.expo, delay },
  },
})

// 从左滑入
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easing.expo },
  },
}

// 从右滑入
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easing.expo },
  },
}

// 缩放进入 (用于卡片)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easing.expo },
  },
}

// 逐字显现容器 (stagger)
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

// 子元素 (配合 staggerContainer)
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.expo },
  },
}

// 线条生长 (用于分隔线)
export const lineGrow: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: easing.expo },
  },
}

// 页面过渡
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.expo },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.3, ease: easing.expo },
  },
}

// 卡片悬浮 (用于 hover)
export const cardHover = {
  rest: { y: 0, scale: 1, transition: { duration: 0.4, ...easing.springGentle } },
  hover: {
    y: -6,
    scale: 1.02,
    transition: { duration: 0.4, ...easing.springGentle },
  },
}

// 旋转装饰 (用于背景元素)
export const rotateSlow: Variants = {
  animate: {
    rotate: 360,
    transition: { duration: 60, repeat: Infinity, ease: 'linear' },
  },
}
