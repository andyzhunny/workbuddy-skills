# WorkBuddy Skills Backup Script (PowerShell)
# 备份 ~/.workbuddy/skills/ 到 GitHub

param(
    [string]$SkillsDir = "$HOME\.workbuddy\skills",
    [string]$RepoDir = "$HOME\workbuddy-skills",
    [string]$GitHubToken = $env:GITHUB_TOKEN,
    [string]$GitHubUser = "andyzhunny",
    [string]$GitHubRepo = "workbuddy-skills"
)

if ([string]::IsNullOrEmpty($GitHubToken)) {
    Write-Host "Error: GitHub token not set. Please set $env:GITHUB_TOKEN or pass -GitHubToken parameter."
    Write-Host "Example: $env:GITHUB_TOKEN='ghp_your_token_here'"
    exit 1
}

$RemoteUrl = "https://${GitHubToken}@github.com/${GitHubUser}/${GitHubRepo}.git"

Write-Host "========== WorkBuddy Skills Backup =========="
Write-Host "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "Source: ${SkillsDir}"
Write-Host "Target: ${RepoDir}"
Write-Host ""

# 检查源目录是否存在
if (-not (Test-Path $SkillsDir)) {
    Write-Host "Error: Skills directory not found at ${SkillsDir}"
    exit 1
}

# 确保 repo 目录存在
if (-not (Test-Path $RepoDir)) {
    New-Item -ItemType Directory -Path $RepoDir -Force | Out-Null
}

# 设置 git 配置
git config --global user.email "backup@workbuddy.local" 2>$null
git config --global user.name "WorkBuddy Backup Bot" 2>$null

Set-Location $RepoDir

# 如果没有 .git，初始化仓库并关联远程
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..."
    git init
    git remote add origin $RemoteUrl
    git pull origin main 2>$null
}

# 同步 skills 目录
Write-Host "Syncing skills directory..."
if (Test-Path "skills") {
    Remove-Item -Recurse -Force "skills"
}
Copy-Item -Recurse $SkillsDir "skills"

# 检查是否有变更
git fetch origin main 2>$null
$localCommit = git rev-parse HEAD 2>$null
$remoteCommit = git rev-parse "origin/main" 2>$null

# 添加所有变更
Write-Host "Adding changes..."
git add -A

# 检查工作目录是否有变更
$hasChanges = -not (git diff --cached --quiet --ignore-space-at-eol --ignore-space-change --ignore-blank-lines 2>$null)

if (-not $hasChanges) {
    Write-Host "No changes detected. Skipping commit."
    exit 0
}

# 获取变更统计
$changeCount = (git status --porcelain).Count
Write-Host "Changed files: ${changeCount}"

# 创建提交
Write-Host "Creating commit..."
$commitMsg = "Backup skills - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n`nAuto-generated backup from WorkBuddy.`nChanges: ${changeCount} file(s)"
git commit -m $commitMsg

# 推送到 GitHub
Write-Host "Pushing to GitHub..."
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========== Backup Complete =========="
    Write-Host "Successfully backed up to GitHub!"
    Write-Host "Repository: https://github.com/${GitHubUser}/${GitHubRepo}"
} else {
    Write-Host ""
    Write-Host "========== Backup Failed =========="
    Write-Host "Failed to push to GitHub. Please check your token and network."
    exit 1
}
