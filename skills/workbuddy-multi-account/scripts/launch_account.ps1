# WorkBuddy Multi-Account Launcher
# Usage: .\launch_account.ps1 [-AccountName <name>]
# Example: .\launch_account.ps1 -AccountName "Account2"

param(
    [string]$AccountName = "Account2"
)

$ExePath = "C:\Program Files\WorkBuddy\WorkBuddy.exe"
$DataDir  = "$env:APPDATA\WorkBuddy-$AccountName"

if (-not (Test-Path $ExePath)) {
    Write-Error "WorkBuddy not found at: $ExePath"
    exit 1
}

Write-Host "Launching WorkBuddy with account profile: $AccountName"
Write-Host "Data directory: $DataDir"

Start-Process -FilePath $ExePath -ArgumentList "--user-data-dir=`"$DataDir`""
Write-Host "Done! WorkBuddy ($AccountName) started."
