---
title: Docker 容器化部署笔记
date: 2026-04-02
minutes: 8
tags: [DevOps, Docker]
excerpt: Dockerfile 编写、镜像瘦身与 Compose 编排的实操笔记。
---

Docker 的核心价值是环境一致性：镜像把代码、依赖、运行时一起打包，本地和线上跑的是同一个东西。Dockerfile 是镜像的构建说明书，推荐用多阶段构建，把编译环境和运行环境分开。

## 多阶段构建示例

```dockerfile
# 阶段一：编译 / 安装依赖
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 阶段二：精简运行镜像
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 镜像瘦身的几个手段

- 使用轻量基础镜像（如 `python:slim`、`alpine`）
- 合并 `RUN` 指令减少层数
- 清理安装缓存（`pip --no-cache-dir`）
- 使用 `.dockerignore` 排除无关文件

## Compose 编排

单容器解决不了的问题交给 docker-compose：一个 yaml 文件即可编排应用、数据库、Redis 多个服务，配上 `depends_on` 控制启动顺序。

```yaml
services:
  app:
    build: .
    ports: ["8000:8000"]
    environment:
      - DB_HOST=db
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secret
```

开发环境一键起，非常省心。
