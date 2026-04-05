#!/bin/bash
# WorkBuddy Skills Backup Script
# 备份 ~/.workbuddy/skills/ 到 GitHub

SKILLS_DIR="$HOME/.workbuddy/skills"
REPO_DIR="$HOME/workbuddy-skills"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
GITHUB_USER="andyzhunny"
GITHUB_REPO="workbuddy-skills"

# 检查 token 是否设置
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GitHub token not set. Please set GITHUB_TOKEN environment variable."
    echo "Example: export GITHUB_TOKEN='ghp_your_token_here'"
    exit 1
fi

REMOTE_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git"

echo "========== WorkBuddy Skills Backup =========="
echo "Time: $(date)"
echo "Source: ${SKILLS_DIR}"
echo "Target: ${REPO_DIR}"
echo ""

# 检查源目录是否存在
if [ ! -d "$SKILLS_DIR" ]; then
    echo "Error: Skills directory not found at ${SKILLS_DIR}"
    exit 1
fi

# 如果本地仓库不存在，克隆已有仓库
if [ ! -d "$REPO_DIR/.git" ]; then
    echo "Cloning existing repository..."
    git clone "$REMOTE_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"

# 拉取最新代码（处理其他设备可能的手动修改）
echo "Pulling latest changes..."
git pull origin main 2>/dev/null || echo "No remote changes to pull"

# 同步 skills 目录（使用 rsync 或 cp）
echo "Syncing skills directory..."
rm -rf "${REPO_DIR}/skills" 2>/dev/null
cp -r "$SKILLS_DIR" "${REPO_DIR}/skills"

# 检查是否有变更
cd "$REPO_DIR"
if git diff --quiet && git diff --cached --quiet; then
    echo "No changes detected. Skipping commit."
    exit 0
fi

# 添加所有变更
echo "Adding changes..."
git add -A

# 获取变更统计
CHANGES=$(git status --porcelain)
CHANGE_COUNT=$(echo "$CHANGES" | wc -l)

# 创建提交
echo "Creating commit..."
git config user.email "backup@workbuddy.local"
git config user.name "WorkBuddy Backup Bot"
git commit -m "Backup skills - $(date '+%Y-%m-%d %H:%M:%S')

Auto-generated backup from WorkBuddy.
Changes: ${CHANGE_COUNT} file(s)"

# 推送到 GitHub
echo "Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========== Backup Complete =========="
    echo "Successfully backed up to GitHub!"
    echo "Repository: https://github.com/${GITHUB_USER}/${GITHUB_REPO}"
else
    echo ""
    echo "========== Backup Failed =========="
    echo "Failed to push to GitHub. Please check your token and network."
    exit 1
fi
