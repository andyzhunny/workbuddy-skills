# workbuddy-skills

WorkBuddy AI 助手技能库备份 - 每天自动同步

## 简介

本仓库用于备份 `~/.workbuddy/skills/` 目录下的所有技能配置。通过自动化脚本每天早上 9:00 自动同步更新，确保技能配置的版本管理和安全备份。

## 技能列表

### 开发类 (Development)

| 技能 | 描述 |
|------|------|
| `frontend-dev` | 全栈前端开发：UI 设计、动画系统、AI 素材生成、文案写作、视觉艺术 |
| `flutter-dev` | Flutter 跨平台开发：Widget 模式、Riverpod/Bloc 状态管理、GoRouter 导航 |
| `fullstack-dev` | 全栈后端架构与前后端集成开发 |
| `android-native-dev` | Android 原生应用开发：Material Design 3、Kotlin/Compose |
| `ios-application-dev` | iOS 应用开发：UIKit、SwiftUI、Swift |
| `react-native-dev` | React Native 跨平台开发 |

### 创意类 (Creative)

| 技能 | 描述 |
|------|------|
| `ljg-card` | 内容铸图：将内容转换为 PNG 视觉卡片（长图/信息图/漫画/白板） |
| `ljg-writes` | 写作引擎：带着观点深入思考并完成文章 |
| `ljg-learn` | 概念解剖：从 8 个维度深度解析任何概念 |
| `ljg-chinese-dict` | 汉语新解：全新角度解释汉语词汇 |
| `ljg-roundtable` | 圆桌讨论：多视角辩证讨论框架 |
| `ljg-invest` | 投资分析：深度投资分析报告 |
| `ljg-rank` | 降秩分析：找出领域背后的独立力 |
| `ljg-relationship` | 关系分析：结构诊断与心理分析 |
| `gif-sticker-maker` | GIF 贴纸制作：照片转动画 GIF |

### 效率类 (Productivity)

| 技能 | 描述 |
|------|------|
| `minimax-xlsx` | Excel/电子表格处理：创建、编辑、验证公式 |
| `minimax-docx` | Word 文档处理：创建、编辑、格式化 DOCX |
| `minimax-pdf` | PDF 文档处理：创建、填充表单、重格式化 |
| `brainstorming` | 头脑风暴：通过对话将想法转化为设计 |
| `project-proposal-writer` | 项目提案写作 |
| `thesis-review` | 论文评审 |
| `find-skills` | 技能查找：发现和安装可用技能 |

### 多媒体类 (Multimedia)

| 技能 | 描述 |
|------|------|
| `minimax-multimodal-toolkit` | 多模态工具包：语音、音乐、视频、图片生成 |
| `vision-analysis` | 视觉分析：图像和视频内容理解 |

### AI 代理类 (Agent)

| 技能 | 描述 |
|------|------|
| `gstack` | 浏览器自动化测试 |
| `subagent-driven-development` | 子代理驱动开发 |
| `dispatching-parallel-agents` | 并行代理调度 |
| `self-improving-agent` | 自我改进代理 |
| `skill-builder` | 技能构建 |
| `skill-vetter` | 技能审查 |

### 专业领域类 (Domain)

| 技能 | 描述 |
|------|------|
| `ljg-paper` | 论文阅读：提取论文核心思想 |
| `ljg-paper-flow` | 论文流：读论文并生成卡片 |
| `ljg-travel` | 旅行研究：博物馆和古建筑深度功课 |
| `ljg-translation-plan` | 翻译规划：医学翻译团队项目规划 |
| `edu-brainstorming` | 教育内容设计：课程计划、教学设计 |
| `talent-miner` | 人才挖掘 |
| `pua-*` | 关系心理学系列技能 |

### 系统工具类 (System)

| 技能 | 描述 |
|------|------|
| `executing-plans` | 执行计划：分阶段实施计划 |
| `verification-before-completion` | 完成前验证 |
| `systematic-debugging` | 系统调试 |
| `test-driven-development` | 测试驱动开发 |
| `requesting-code-review` | 请求代码审查 |
| `receiving-code-review` | 接收代码审查 |
| `using-git-worktrees` | Git Worktree 使用 |
| `search-with-tavily` | Tavily 搜索集成 |
| `web-access` | 网络访问 |

## 自动备份

本仓库通过 WorkBuddy 自动化功能每天早上 **9:00** 自动同步更新。

备份内容包括：
- 所有技能的 `SKILL.md` 配置文件
- 技能附带的脚本和参考文档
- 模板和资源文件

## 同步机制

```
┌─────────────────────────────────────────────────────────────┐
│                    每日 9:00 AM                             │
│                                                             │
│   ~/.workbuddy/skills/  ──────►  GitHub Repository        │
│   (源目录)                    workbuddy-skills              │
│                                                             │
│   自动检测变更 → 提交更新 → 推送至 GitHub                   │
└─────────────────────────────────────────────────────────────┘
```

## 仓库信息

- **创建时间**: 2026-04-05
- **所有者**: [andyzhunny](https://github.com/andyzhunny)
- **许可证**: MIT License

## 免责声明

本仓库仅用于个人技能配置备份和数据安全保护。技能内容版权归 WorkBuddy 及相关开发者所有。
