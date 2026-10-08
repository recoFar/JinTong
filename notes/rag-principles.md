---
title: RAG 原理与落地：从检索到生成的完整链路
date: 2026-09-28
minutes: 12
tags: [AI, RAG, LLM]
excerpt: 为什么需要 RAG、一条完整的检索增强链路是怎么跑通的，以及落地时最容易踩的坑。
---

大模型存在知识截止时间与幻觉问题。RAG（检索增强生成）的思路是在生成前先从外部知识库中检索相关内容，把结果作为上下文喂给模型，让回答可以引用可追溯的来源，也方便随时更新知识而无需重新训练。

## 为什么需要 RAG

- **知识时效**：模型的训练数据有截止时间，无法回答其后发生的事
- **幻觉控制**：没有依据的生成容易编造，检索结果提供了事实锚点
- **可溯源**：回答可以引用具体文档，方便用户验证
- **更新成本低**：换一批知识文档即可更新能力，不用重新训练

## 一条典型的链路

1. 文档切分（chunk 的大小与重叠度直接影响召回质量）
2. 向量化（Embedding 模型的选择）
3. 向量检索（近似最近邻）
4. 重排序（用精排模型纠正召回结果）
5. 生成（把检索结果拼进 Prompt）

一个最小实现的大致样子：

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

# 1. 切分文档
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = splitter.split_documents(raw_docs)

# 2. 向量化并建库
vectorstore = FAISS.from_documents(docs, embedding_model)

# 3. 检索 + 生成
hits = vectorstore.similarity_search(question, k=5)
answer = llm.invoke(f"请基于以下资料回答：\n{context}\n\n问题：{question}")
```

## 落地时的经验

- 先用混合检索（关键词 + 向量）兜底长尾问题
- 对答案做引用溯源，标注来源文档
- 上线前一定要建评测集，用命中率和回答质量两个指标持续回归，而不是凭感觉调参
