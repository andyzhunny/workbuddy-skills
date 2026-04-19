---
name: ds-wechat
description: |
  横纵分析 + 微信公众号一键发布工作流。当用户说"深度研究[主题]"时自动触发。
  等同于连续执行：hv-analysis（生成横纵分析.md，不转PDF）+ wechat-publisher（发布到草稿箱）。
  触发词：深度研究[主题]、深度调研[主题]、横纵分析并发布、ds-wechat
---

# ds-wechat：横纵分析 + 微信公众号发布

一键完成「横纵分析研究 → 推送到草稿箱」的完整闭环。

## 工作流

本 Skill 由两个子 Skill 串联组成，全自动执行，无需用户干预。

### 第一步：加载 hv-analysis，执行深度研究

1. 使用 `use_skill("hv-analysis")` 加载横纵分析法技能
2. 执行完整的四步研究流程：
   - 联网信息收集（纵向 + 横向并行）
   - 纵向分析（从诞生到当下）
   - 横向分析（竞争图谱）
   - 横纵交汇洞察（未来三剧本）
3. **关键**：研究完成后，只输出 Markdown 报告文件，**跳过 PDF 生成步骤**
4. 报告文件名格式：`[主题]_横纵分析报告.md`，保存到当前工作目录
5. frontmatter 必须包含：
   ```yaml
   ---
   title: 深度报告 | [主题名称]
   cover: ./assets/default-cover.jpg
   ---
   ```

### 第二步：加载 wechat-publisher，发布到草稿箱

1. 确认封面图 `assets/default-cover.jpg` 存在于工作目录（若不存在则从 `~/.workbuddy/skills/wechat-publisher/assets/default-cover.jpg` 复制）
2. 使用 `use_skill("wechat-publisher")` 加载发布技能
3. 确认环境变量已设置（若未设置则设置）：
   ```powershell
   $env:WECHAT_APP_ID = "wx2756a5c20e96d972"
   $env:WECHAT_APP_SECRET = "c8f1a69a97dfd31f7437d4d11a812847"
   ```
4. 执行发布命令：
   ```bash
   wenyan publish -f "[工作目录]/[主题]_横纵分析报告.md" -t lapis -h solarized-light
   ```
5. 返回 Media ID 和发布结果

## 封面图说明

- 使用 `~/.workbuddy/skills/wechat-publisher/assets/default-cover.jpg` 作为默认封面
- 发布前确保封面图在工作目录的 `assets/` 子目录中
- 如封面图路径问题导致失败，可改用网络图片 URL 或绝对路径

## 环境依赖

- `wenyan-cli`：`npm install -g @wenyan-md/cli`
- 微信公众号 API 凭证：已配置（见上方环境变量）
- IP 白名单：确保本机公网 IP 在 mp.weixin.qq.com 后台白名单中

## 错误处理

| 错误 | 原因 | 解决 |
|------|------|------|
| `wenyan: command not found` | wenyan-cli 未安装 | `npm install -g @wenyan-md/cli` |
| `ip not in whitelist` | IP 不在白名单 | 登录 mp.weixin.qq.com 后台添加 IP |
| `未能找到文章封面` | frontmatter 缺少 title 或 cover | 检查并补充 frontmatter |
| `title is required` | Markdown 缺少 frontmatter | 在文件顶部添加完整的 YAML frontmatter |

## 输出交付物

1. `[主题]_横纵分析报告.md` — 完整研究报告（保存到工作目录）
2. 微信公众号草稿箱 — 文章已推送（返回 Media ID）

## 使用示例

```
用户：深度研究许渊冲

AI 执行流程：
  [1/2] 加载 hv-analysis → 研究"许渊冲" → 生成 许渊冲_横纵分析报告.md
  [2/2] 加载 wechat-publisher → 推送到草稿箱 → 返回 Media ID
```
