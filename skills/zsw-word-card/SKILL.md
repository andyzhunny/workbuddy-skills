---
name: zsw-word-card
description: Use when a user wants one Chinese or English word turned into a full ljg-word analysis and a matching PNG card in one continuous workflow.
version: "1.0.0"
user_invocable: true
---

# zsw-word-card

编排型单词工作流：先解词，再铸卡，但对用户呈现为一次完成。

## When to Use

- 用户给出一个中文或英文词条，希望同时得到深度词解和卡片
- 用户明确要求“先解释，再做卡片”“单词生成卡片”“词解 + PNG”
- 用户希望第二步卡片严格继承第一步的完整内容，而不是摘要版

## Core Rules

1. **先调用 `ljg-word`，后调用 `ljg-card`。** 不可跳步，不可颠倒。
2. **完整词解是唯一内容源。** `ljg-word` 产出的完整 Markdown 必须原样保留为 source of truth；生成卡片时不得先摘要、删节或重写。
3. **词解结构完全继承 `ljg-word`。** 保持标题行、核心语义、原始画面、核心意象、解释、一语道破这些模块完整出现。
4. **卡片模具由内容气质决定。** 优先在 `-l`、`-i`、`-v` 中择优；只有在内容明显更适合时才使用其他模具。
5. **最终回复必须同时交付两部分。** 先在对话中展示完整词解，再展示生成好的 PNG 卡片结果。

## Workflow

1. 读取用户词条，保留原词面貌；中文词可补充对应英文，英文词可补充中文释义。
2. 调用 `ljg-word` 并产出完整词解。
3. 读取 `references/orchestration.md`，按其中的完整性规则与模具选择规则组织下一步。
4. 调用 `ljg-card`，把第 2 步的完整词解作为卡片输入。
5. 返回完整词解，并附上卡片文件结果。

## Quick Reference

| 输入 | 第一步 | 第二步 | 输出 |
|------|--------|--------|------|
| 中文词 / 英文词 | `ljg-word` 完整词解 | `ljg-card` 根据完整词解出图 | 对话词解 + PNG |

## Common Mistakes

- 先脑补词解，再直接做图，没有真的走 `ljg-word`
- 卡片只用了几条摘要，而不是完整词解
- 对话里只给 PNG，不给完整词解
- 无脑固定 `-l`，没有根据内容气质判断模具
