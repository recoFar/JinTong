---
title: AI Agent 开发入门：工具调用与工作流编排
date: 2026-09-15
minutes: 15
tags: [AI, Agent]
excerpt: Agent 的本质是什么？从 ReAct 循环到工具调用，理解一个最小可用 Agent 的组成。
---

Agent 可以理解为一个让大模型具备行动能力的框架：模型不再只输出文字，而是输出调用工具的指令，由程序执行后把结果反馈回来，如此循环直到任务完成。核心组件是规划、工具、记忆与执行。

## ReAct 循环

最经典的循环是 ReAct：思考（Reason）当前需要什么信息 → 行动（Act）调用工具 → 观察（Observe）返回结果 → 再次思考。工具调用通过 Function Calling 或结构化输出实现，关键是给模型清晰、准确的工具描述。

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "查询指定城市的当前天气",
            "parameters": {
                "type": "object",
                "properties": {"city": {"type": "string"}},
                "required": ["city"],
            },
        },
    }
]
```

## 最小 Agent 的组成

| 组件 | 作用 | 常见实现 |
| --- | --- | --- |
| 模型 | 决策与生成 | GPT / Claude / 豆包大模型 |
| 工具 | 与外部世界交互 | Function Calling、API 封装 |
| 记忆 | 保存上下文与历史 | 消息列表、向量存储 |
| 执行器 | 编排循环与错误处理 | LangChain、Coze 或手写循环 |

## 入门建议

- 先用一个简单任务（比如查天气 + 写总结）手工实现一遍完整循环，再接触框架，否则很容易被抽象层绕晕
- 重视错误处理：工具失败、模型死循环、上下文超限都需要兜底
- 给每个工具写清晰的中文描述，模型才知道什么时候该用它
