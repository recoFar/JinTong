# JinTong 个人博客

一个纯 HTML/CSS/JS 构建的静态个人博客，包含首页、笔记、项目、关于四个页面，支持笔记标签筛选、Markdown 渲染与代码高亮、深浅色模式切换

- 博客作者：JinTong
- GitHub 主页：https://github.com/recoFar

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

