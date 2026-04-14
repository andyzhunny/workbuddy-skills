# render_xhs.py 参数说明

**基础用法：**
```bash
python scripts/render_xhs.py <markdown_file> [options]
```

**选项参数：**

| 短选项 | 长选项 | 说明 | 默认值 |
|--------|--------|------|--------|
| `-o` | `--output-dir` | 输出目录 | 当前目录 |
| `-t` | `--theme` | 主题样式 | `sketch` |
| `-m` | `--mode` | 模式：separator、auto-fit、auto-split、dynamic | separator |
| `-w` | `--width` | 画布宽度（px） | `1080` |
| | `--height` | 画布高度（px） | `1440` |
| | `--max-height` | 最大高度（px） | `4320` |
| `-d` | `--dpr` | 设备像素比 | `2` |

### 主题（`--theme`/`-t`）选项：

| 主题名称 | 说明 |
|----------|------|
| `sketch` | 素描风格（默认） |
| `default` | 默认主题 |
| `playful-geometric` | 几何趣味 |
| `neo-brutalism` | 新野兽派 |
| `botanical` | 植物风格 |
| `professional` | 专业商务 |
| `retro` | 复古风格 |
| `terminal` | 终端风格 |

### 模式（`--mode`/`-m`）选项：

| 模式 | 说明 |
|------|------|
| `separator` | 分隔符模式（用 `---` 分页） |
| `auto-fit` | 自动适应高度 |
| `auto-split` | 自动分割长图 |
| `dynamic` | 动态高度多页 |

### 使用示例：

```bash
# 素描风格 + 自动分割
python scripts/render_xhs.py content.md

# 自动适应模式
python scripts/render_xhs.py content.md -m auto-fit

# 几何趣味风格
python scripts/render_xhs.py content.md -t playful-geometric -m auto-split

# 复古风格 + 动态宽度
python scripts/render_xhs.py content.md -t retro -m dynamic --width 1080 --height 1440 --dpr 2
```

---

## publish_xhs.py 参数说明

**基础用法：**
```bash
python scripts/publish_xhs.py --title "<标题>" --desc "<描述>" --images image1.png image2.png
```

**选项参数：**

| 短选项 | 长选项 | 说明 | 默认值 |
|--------|--------|------|--------|
| `-t` | `--title` | 笔记标题 | - |
| `-d` | `--desc` | 笔记描述 | - |
| `-i` | `--images` | 图片文件列表 | - |
| | `--public` | 是否公开 | `False` |
| | `--post-time` | 发布时间 | 当前时间 |
| | `--api-mode` | API 运行模式 | - |
| | `--api-url` | API 地址 | `http://localhost:5005` |
| | `--dry-run` | 模拟运行 | `False` |

### 使用示例：

```bash
# 基本发布（不公开）
python scripts/publish_xhs.py --title "标题" --desc "描述" --images cover.png card_1.png card_2.png

# 公开笔记
python scripts/publish_xhs.py --title "标题" --desc "描述" --images cover.png card_1.png --public

# 设置定时发布
python scripts/publish_xhs.py --title "标题" --desc "描述" --images cover.png card_1.png --post-time "2024-12-01 10:00:00" --public

# API 模式运行
python scripts/publish_xhs.py --title "标题" --desc "描述" --images *.png --api-mode

# 模拟运行（不实际发布）
python scripts/publish_xhs.py --title "标题" --desc "描述" --images *.png --dry-run
```

---

## 环境变量配置

```bash
cp env.example.txt .env
```

编辑 `.env` 文件：

```env
# Cookie 信息
XHS_COOKIE=your_cookie_string_here

# API 配置
XHS_API_URL=http://localhost:5005
```

---

## YAML Front Matter 格式

```yaml
---
emoji: "📝"
title: "标题"
subtitle: "副标题"
---
```
