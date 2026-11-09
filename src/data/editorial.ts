import { blogPosts } from './blog-posts'

export const categories: Record<string, string> = {
  'noosphere-vision': '架构与工程',
  'lsm-tree-from-scratch': '架构与工程',
  'hybrid-code-search': 'AI 与探索',
  'devops-intelligence': 'AI 与探索',
  'game-ui-design': '设计与前端',
  'noosphere-platform': '架构与工程',
  'nebula-four-memories': 'AI 与探索',
  'ai-gateway-design': '架构与工程',
  'ktn-ai-agent': '设计与前端',
  'web-vue-project': '设计与前端',
  'open-source-contribution': '开源记录',
}

export const sortedPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))
export const formatDate = (value: string) => value.replaceAll('-', '.')

export const selectedWorks = [
  { name: 'Noosphere', subtitle: '开发者的 AI 操作系统', description: '代码理解、项目记忆与运维保障，连接成一个持续生长的开源平台。', tags: ['Go', 'Python', 'TypeScript'], slug: 'noosphere-platform', repo: 'Noosphere', kind: 'noosphere' },
  { name: 'Web / Vue', subtitle: '从想法到浏览器', description: '记录 Vue 项目的构建过程，以及框架选择与部署中的思考。', tags: ['Vue', 'TypeScript'], slug: 'web-vue-project', repo: 'web', kind: 'web' },
]
