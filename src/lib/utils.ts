/**
 * 合并 className 字符串
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * 格式化日期
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 估算阅读时间
 */
export function readingTime(text: string): number {
  const wordsPerMinute = 300 // 中文字数/分钟
  const chars = text.replace(/\s/g, '').length
  return Math.max(1, Math.ceil(chars / wordsPerMinute))
}
