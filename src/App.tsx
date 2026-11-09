import { Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Home from './pages/Home'
import Layout from './components/Layout'
import Blog from './pages/Blog'
import NotFound from './pages/NotFound'
const BlogPost = lazy(() => import('./pages/BlogPost'))

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:id" element={<Suspense fallback={<div className="container page-loading" role="status">正在打开文章…</div>}><BlogPost /></Suspense>} />
    <Route path="*" element={<NotFound />} />
  </Routes></Layout>
}
