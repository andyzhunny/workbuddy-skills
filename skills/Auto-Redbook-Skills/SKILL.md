---
name: xhs-note-creator
description: 小红书笔记创作助手，一键生成高质量图文笔记，支持自动排版、自定义模板、批量生成，适配多场景需求。

---

# 小红书笔记生成器

## 功能概述

这是一款专为小红书平台设计的笔记生成工具，帮助用户快速创建高质量、有吸引力的图文内容。

### 核心特性
- **自动排版**：智能识别内容结构，自动优化排版布局
- **自定义模板**：支持多种预设模板，灵活调整风格
- **批量生成**：一次性生成多篇笔记，提升创作效率
- **多场景适配**：支持种草、测评、教程、分享等多种类型

## 使用方法

### 基本使用

```bash
python scripts/render_xhs.py <markdown_file> [options]
```

**参数说明：**
- `<markdown_file>`: Markdown格式的笔记文件
- `[options]`: 可选参数

### 渲染命令

```bash
# 自动分割模式（默认）
python scripts/render_xhs.py content.md -m auto-split

# 指定分隔符
python scripts/render_xhs.py content.md -m separator

# 动态排版
python scripts/render_xhs.py content.md -t playful-geometric -m auto-split

# 自适应适应
python scripts/render_xhs.py content.md -m auto-fit
```

**可用模板：**
- `cover.png` + `card_1.png` + `card_2.png`...
- `default` - 默认风格
- `playful-geometric` - 活泼几何
- `neo-brutalism` - 新丑风
- `botanical` - 自然植物
- `professional` - 专业商务
- `retro` - 复古风格
- `terminal` - 终端风格
- `sketch` - 素描手绘

**选项说明：**
- `-m` 参数：`auto-fit`, `auto-split`, `dynamic`, `separator`
- 参考 `references/params.md` 获取更多配置

---

## 完整示例

### 完整流程

```bash
# 渲染生成笔记
python scripts/render_xhs.py content.md -t sketch -m auto-split

# 发布笔记
python scripts/publish_xhs.py --title "标题" --desc "描述" \
  --images cover.png card_1.png card_2.png --public
```

> 注：发布功能需要配置 `.env` 文件中的 XHS_COOKIE

---

## 资源文件

### 静态资源
- `assets/cover.html` - 封面HTML模板
- `assets/card.html` - 卡片HTML模板
- `assets/styles.css` - 样式文件
- `assets/themes/` - 主题文件夹（8个主题）

### 配置说明
- `references/params.md` - 参数配置详解
- `env.example.txt` - Cookie配置模板
