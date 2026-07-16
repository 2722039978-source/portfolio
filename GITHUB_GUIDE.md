# 📤 推送到 GitHub 完整指南

## 前置条件

你本机没有安装 Git。先安装 Git for Windows：

1. 下载：https://git-scm.com/download/win
2. 安装时选默认选项即可
3. 安装完成后**重启终端**

---

## 步骤 1：初始化 Git 仓库

打开 PowerShell，进入项目目录：

```powershell
cd d:\Project\portfolio

# 初始化 Git
git init

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "feat: 初始化 Noosphere 个人开发者仪表盘"
```

---

## 步骤 2：在 GitHub 创建仓库

1. 打开 https://github.com/2722039978-source
2. 点击右上角 `+` → `New repository`
3. 填写：
   - **Repository name**: `portfolio` (或任意名字)
   - **Description**: 个人开发者仪表盘 — Apple 设计 × 游戏 UI × 互联网幽默
   - **Public** 或 **Private** 任选
   - ⚠️ **不要**勾选 "Add a README file"（你已有 README.md）
4. 点击 `Create repository`

---

## 步骤 3：推送代码

创建仓库后 GitHub 会显示推送命令，复制执行：

```powershell
# 添加远程仓库（替换为你的实际地址）
git remote add origin https://github.com/2722039978-source/portfolio.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

> ⚠️ 推送时会弹出 GitHub 登录窗口，用浏览器授权即可。

---

## 步骤 4：配置 GitHub Pages（可选）

如果要在线预览：

1. 仓库页面 → `Settings` → `Pages`
2. Source 选 `GitHub Actions`
3. 在项目根目录创建 `.github/workflows/deploy.yml`

---

## 日常更新流程

```powershell
# 修改代码后
git add .
git commit -m "描述你改了什么"
git push
```

---

## 常用 Git 命令

| 命令 | 说明 |
|------|------|
| `git status` | 查看文件变更 |
| `git log --oneline` | 查看提交历史 |
| `git diff` | 查看具体改动 |
| `git pull` | 拉取远程更新 |
| `git checkout -b 分支名` | 创建新分支 |
