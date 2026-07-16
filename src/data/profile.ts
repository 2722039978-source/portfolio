export const GITHUB_USERNAME = '2722039978-source'

export interface ProfileData {
  name: string
  role: string
  tagline: string
  location: string
  bio: string
  skills: string[]
  social: { label: string; url: string; icon: string }[]
}

export const profileData: ProfileData = {
  name: 'Ktndeswua',
  role: '独立全栈开发者',
  tagline: '构建开发者的 AI 操作系统',
  location: '中国',
  bio: `全栈独立开发者，热衷于构建高质量的开源工具和 AI 基础设施。
从 Go 后端的 LSM-Tree 存储引擎，到 Python RAG 管线，再到 TypeScript 前端交互设计——
在代码、设计和工程的交叉点上持续探索。

当前核心工作：Noosphere —— 由 CodeLens AI、Nebula Agent 和 DevOps Agent
组成的开源 AI 操作系统平台。相信好的开发者工具值得被精心设计。`,
  skills: [
    'Go', 'Python', 'TypeScript', 'React', 'Next.js',
    'Vue', 'FastAPI', 'Docker', 'LSM-Tree', '向量搜索',
    'RAG', 'LLM', 'Framer Motion', 'Tailwind CSS',
    'Three.js', '系统设计',
  ],
  social: [
    { label: 'GitHub', url: `https://github.com/${GITHUB_USERNAME}`, icon: 'GH' },
    { label: '邮箱', url: 'mailto:dev@noosphere.io', icon: 'EM' },
  ],
}
