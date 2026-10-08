# JinTong 个人博客

一个纯 HTML/CSS/JS 构建的静态个人博客，包含首页、笔记、项目、关于四个页面，支持笔记标签筛选、Markdown 渲染与代码高亮、深浅色模式切换，部署到 GitHub Pages 免费访问。

- 博客作者：JinTong
- GitHub 主页：https://github.com/recoFar
- 部署后访问地址：`https://recoFar.github.io/JinTong-Blog/`

## 项目结构

```
JinTong-Blog/
├── index.html          # 页面结构（首页 / 笔记 / 项目 / 关于）
├── css/style.css       # 全部样式（设计变量集中在顶部 :root）
├── js/app.js           # 前端逻辑：路由、渲染、数据加载、主题切换
├── notes/              # ★ 笔记目录：你的 Markdown 笔记都放在这里
│   ├── rag-principles.md
│   ├── ai-agent-intro.md
│   └── ...             # 每个 .md 文件 = 一篇笔记
├── notes-data.json     # ★ 由 build_notes.py 自动生成，网页读取它展示笔记
├── projects.json       # 项目数据（想改项目列表，直接编辑这个文件）
├── build_notes.py      # ★ 笔记编译脚本：扫描 notes/ 生成 notes-data.json
├── .nojekyll           # 告诉 GitHub Pages 不要用 Jekyll 处理
└── README.md           # 本文档
```

---

## 一、更新笔记（重点：写 Markdown 文件，网页自动同步）

**核心流程只有三步：写笔记 → 跑脚本 → 推送。**

### 第 1 步：写笔记

在 `notes/` 文件夹里新建一个 `.md` 文件（或复制现有文件改内容），格式如下：

```markdown
---
title: 笔记标题
date: 2026-10-09
minutes: 10
tags: [AI, Python]
excerpt: 一句话摘要，显示在卡片上。
---

这里写正文，支持 Markdown 语法：

- 列表、**加粗**、`行内代码`
- ```python 代码块（自动高亮）
- 表格、引用、标题等
```

字段说明（都可以省略）：

| 字段 | 作用 | 缺省值 |
| --- | --- | --- |
| `title` | 笔记标题 | 文件名 |
| `date` | 发布日期，格式 `YYYY-MM-DD`，用于排序 | 文件修改日期 |
| `tags` | 标签数组，用于页面筛选 | 空 |
| `minutes` | 阅读时长（分钟） | 按正文字数估算 |
| `excerpt` | 卡片摘要 | 正文第一行 |

### 第 2 步：运行编译脚本

在项目根目录（`F:\JinTong-Blog`）打开终端，执行：

```bash
python build_notes.py
```

脚本会扫描 `notes/` 下所有 `.md` 文件，自动生成 `notes-data.json`，并打印笔记清单确认无误。

> 注意：脚本要用 `python` 或 `python3` 运行（Windows 自带或官网安装即可，无需任何第三方库）。

### 第 3 步：推送，网页自动更新

```bash
git add .
git commit -m "add: 新笔记"
git push
```

GitHub Pages 收到推送后会自动重新部署，约 1 分钟后刷新网页，新笔记就会出现在列表里，标签筛选项也会自动更新。**完全不用碰 HTML。**

删除笔记 = 删掉对应的 `.md` 文件 → 重跑脚本 → 推送。

---

## 二、部署到 GitHub Pages

### 1. 新建仓库

登录 GitHub → 右上角 **+** → **New repository** → 仓库名建议 **JinTong-Blog** → 可见性选 **Public** → 创建。

### 2. 上传整个项目

文件较多且有目录结构，推荐用 Git 命令行（网页上传也行，但要保留 `css/`、`js/`、`notes/` 这些文件夹结构）：

```bash
# 在 F:\JinTong-Blog 目录下打开终端
git init
git add .
git commit -m "init: JinTong personal blog"

git branch -M main
git remote add origin https://github.com/recoFar/JinTong-Blog.git
git push -u origin main
```

### 3. 开启 Pages

仓库 → **Settings** → 左侧 **Pages** → **Build and deployment**：
- Source 选 **Deploy from a branch**
- Branch 选 **main**，文件夹选 **/ (root)**
- 点 **Save**

### 4. 访问

等 1～2 分钟，打开：

```
https://recoFar.github.io/JinTong-Blog/
```

---

## 三、本地预览

**不要直接双击打开 `index.html`**——浏览器出于安全会阻止页面读取本地数据文件，笔记区将显示加载失败提示。请用本地服务器预览：

```bash
# 在 F:\JinTong-Blog 目录下打开终端
python -m http.server 8000
```

然后浏览器访问：`http://localhost:8000`

（部署到 GitHub Pages 后没有这个问题，线上直接访问即可。）

---

## 四、常见问题

**Q1：部署后笔记区空白或提示加载失败？**
- 检查 `notes-data.json` 是否已由 `build_notes.py` 生成并随仓库推送（它不会被 gitignore，但确认没被手动删除）。
- 检查仓库根目录是否有 `notes-data.json`（与 `index.html` 同级，不在子文件夹）。
- 强制刷新：`Ctrl + F5`。

**Q2：网页上笔记更新了，但本地看到的还是旧的？**
- 本地重新运行 `python build_notes.py`；线上推送后等 1 分钟再访问，必要时强制刷新。

**Q3：换了 GitHub 账号？**
- 全局搜索替换 `recoFar` 为你的新用户名（页面、`README.md`、`projects.json` 里的链接）。

**Q4：代码高亮 / Markdown 渲染依赖 CDN（marked、highlight.js），断网时会怎样？**
- 笔记正文会退回显示 Markdown 原文（纯文本），页面其余功能不受影响。正常联网环境无此问题。

**Q5：想用短地址 https://recoFar.github.io（不带 /JinTong-Blog）？**
- 把仓库名改成 `recoFar.github.io`（你的用户名 + .github.io），重新推送即可，无需改任何文件（本项目全部使用相对路径）。

**Q6：修改外观？**
- 配色、字体、间距改 `css/style.css` 顶部的 `:root` 设计变量；首页简介、关于页文字改 `index.html` 对应位置。

© 2026 JinTong · 纯静态构建 · 部署于 GitHub Pages
