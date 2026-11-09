# Portfolio 2.0

使用 React、TypeScript 与 Vite 构建的 Digital Garden，包含 Journal、项目记录、交互排版实验、深浅主题和响应式页面。

## 本地运行

需要 Node.js 22 与 npm。

```powershell
npm ci
npm run dev
```

开发服务地址为 `http://127.0.0.1:5173`。

```powershell
npm run build
npm run preview
```

生产预览地址为 `http://127.0.0.1:4173`。构建执行 TypeScript 检查，输出位于 `dist`。

## 公开资料配置

默认名称为 Digital Garden，默认配置不包含个人姓名、地区、邮箱、GitHub 账号或个人部署地址。

需要展示公开资料时，将 `.env.example` 复制为 `.env.local`，填写需要的项目并重新启动或构建：

| 变量 | 用途 |
| --- | --- |
| `VITE_PROFILE_NAME` | 导航、介绍和页面标题中的名称 |
| `VITE_GITHUB_USERNAME` | GitHub 主页、仓库归档和公开动态 |
| `VITE_CONTACT_EMAIL` | 关于区域的邮箱链接 |

全部变量均为可选项。未配置 GitHub 账号时不发起 GitHub 请求，也不显示 GitHub 区域。配置后通过公开 API 获取资料、仓库与公共活动，成功数据缓存五分钟，支持刷新及网络错误提示。

`VITE_` 变量会进入浏览器构建产物，只能填写希望公开的资料。访问令牌、密码和私钥不应填写在这些变量中。`.env.local` 与其他真实环境配置文件被 Git 忽略。

## 内容与设计

- `src/data/blog-posts.ts` 保存原有 11 篇文章、正文和元数据，文章格式保持 TypeScript。
- `src/data/profile.ts` 保存通用介绍、技能和可选公开资料配置。
- `src/data/editorial.ts` 保存分类与精选项目映射。
- `src/styles/tokens.css` 定义色彩、字体、间距、边框、圆角、阴影、动效与响应式尺寸。
- `src/components/TypePlayground.tsx` 提供文字、字距、字重、颜色与重置操作。
- 字体由 npm 依赖提供并随构建发布。

## 路由与部署

| 路径 | 内容 |
| --- | --- |
| `/` | 首页 |
| `/blog` | 文章列表 |
| `/blog/:id` | 文章详情 |
| `/#works` | 精选项目 |
| `/#lab` | 交互实验 |
| `/#about` | 关于 |

搜索、分类与标签分别使用 `q`、`category`、`tag` 查询参数。原有文章 URL 保持有效。

将 `dist` 部署到支持 SPA history 的静态托管服务。实际资源请求返回资源文件，页面路径返回 `index.html`。Nginx 可以使用 `try_files $uri $uri/ /index.html;`。应用部署在域名根路径。

## 验证

启动开发服务后执行：

```powershell
npm test
npm audit
```

Playwright 默认使用本机 Google Chrome。使用 Playwright Chromium 时执行 `npx playwright install chromium`，设置 `$env:PLAYWRIGHT_CHANNEL = 'chromium'`。

生产预览服务运行期间可执行：

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:4173'
npm test
```

测试覆盖文章内容校验、全部文章路由、搜索筛选、主题、菜单、目录、排版实验、隐私默认值与响应式尺寸。文章 SHA256 基准直接保存在测试中，独立克隆本仓库即可执行检查。

真实 GitHub 集成测试需要在运行网站和测试的终端中设置相同的 `VITE_GITHUB_USERNAME`；使用生产预览时需要在设置变量后重新构建。未配置账号时明确跳过这些集成测试。测试通过真实浏览器 DOM、尺寸和交互执行，关闭截图、视频与 trace，不替换 API 响应。

测试结果保存在 Git 忽略的 `.qa`。发布范围与检查说明见 [开发说明](docs/implementation.md) 和 [GitHub 发布说明](GITHUB_GUIDE.md)。
