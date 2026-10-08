---
title: Python 全栈实践：FastAPI 从接口到部署
date: 2026-08-30
minutes: 10
tags: [Python, 全栈]
excerpt: 一次完整的 FastAPI 实践记录：项目结构、鉴权、文档，以及如何一步步部署上线。
---

FastAPI 自带 OpenAPI 文档、基于 Pydantic 的请求校验和异步支持，非常适合快速搭建 AI 应用的后端。项目建议按功能模块分包：`routers`、`schemas`、`services`、`models` 各司其职，避免所有逻辑堆在一个文件里。

## 项目结构

```
app/
├── main.py          # 应用入口
├── routers/         # 路由（按业务域拆分）
├── schemas/         # Pydantic 请求/响应模型
├── services/        # 业务逻辑
└── models/          # 数据库模型
```

## 一个带鉴权的示例

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

app = FastAPI()
security = HTTPBearer()

def get_current_user(cred: HTTPAuthorizationCredentials = Depends(security)):
    # 校验 JWT，返回用户信息
    ...

@app.get("/notes")
def list_notes(user = Depends(get_current_user)):
    return {"user": user.id, "notes": [...]}
```

鉴权部分用 JWT 是常见方案：登录接口签发 token，依赖注入统一做用户校验。数据库用 SQLAlchemy 或 Tortoise ORM，配合 Alembic 做迁移，保证表结构可版本化。

## 部署链路

- 本地 `uvicorn app.main:app --reload` 调试
- Docker 镜像（多阶段构建瘦身）
- 服务器上用 Docker Compose 或 gunicorn + Nginx 反向代理
- 密钥放进环境变量，而不是写死在代码里
