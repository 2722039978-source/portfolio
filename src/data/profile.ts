export const GITHUB_USERNAME = import.meta.env?.VITE_GITHUB_USERNAME?.trim() ?? ''
const contactEmail = import.meta.env?.VITE_CONTACT_EMAIL?.trim() ?? ''

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
  name: import.meta.env?.VITE_PROFILE_NAME?.trim() || 'Digital Garden',
  role: '开发与设计',
  tagline: '记录思考，探索代码与设计',
  location: '',
  bio: '这里收藏技术文章、项目记录与交互实验，在持续写作和构建中探索新的想法。',
  skills: [
    'Go', 'Python', 'TypeScript', 'React', 'Next.js',
    'Vue', 'FastAPI', 'Docker', 'LSM-Tree', '向量搜索',
    'RAG', 'LLM', 'Framer Motion', 'Tailwind CSS',
    'Three.js', '系统设计',
  ],
  social: [
    ...(GITHUB_USERNAME ? [{ label: 'GitHub', url: `https://github.com/${GITHUB_USERNAME}`, icon: 'GH' }] : []),
    ...(contactEmail ? [{ label: '邮箱', url: `mailto:${contactEmail}`, icon: 'EM' }] : []),
  ],
}
