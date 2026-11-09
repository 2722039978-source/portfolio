# GitHub 发布说明

## 上传文件

发布清单包含 `.gitignore`、`.env.example`、README、本文档、`docs`、`src`、`tests`、`public/favicon.svg`，以及 package、TypeScript、Vite、Playwright 和 HTML 入口配置。

本地 `.qa`、`.openai`、`node_modules`、`dist`、真实 `.env` 文件、旧项目目录和未使用的旧资源不上传。发布前检查具体文件清单，发布后比较远端路径与 Git blob SHA，确认内容完整。

## 资料检查

默认源码不包含个人姓名、邮箱、地区、GitHub 账号、个人站点地址或本机目录。`.env.example` 仅声明空变量。公开资料按 README 配置，`VITE_` 变量会进入浏览器产物。

检查源码、文档和锁文件中的个人标识、邮箱、访问令牌、私钥及本机路径，同时检查远端提交文件清单。GitHub 平台上的仓库所有者与提交者信息仍然可见。现有历史提交保持可访问，当前文件清理不删除历史内容。

## 发布验证

```powershell
npm ci
npm run build
npm run preview
```

在另一个终端执行：

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:4173'
npm test
npm audit
```

检查完整文章路由、深浅主题、移动导航、交互实验和控制台。测试无需旧项目文件。GitHub 集成测试的环境变量要求见 README。
