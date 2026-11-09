import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/dm-sans/latin-400.css'
import '@fontsource/dm-sans/latin-500.css'
import '@fontsource/dm-sans/latin-700.css'
import '@fontsource/space-grotesk/latin-400.css'
import '@fontsource/space-grotesk/latin-500.css'
import '@fontsource/space-grotesk/latin-700.css'
import App from './App'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('缺少 root 元素')
const theme = localStorage.getItem('portfolio-theme')
document.documentElement.dataset.theme = theme === 'dark' || theme === 'light'
  ? theme : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
