# WorkBuddy 全账号启动器
# 直接双击运行此文件即可

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$LaunchScript = Join-Path $ScriptDir "launch_account.ps1"
$ExePath = "C:\Program Files\WorkBuddy\WorkBuddy.exe"

Write-Host ""
Write-Host "=========================================="
Write-Host "  WorkBuddy 全账号启动器"
Write-Host "=========================================="
Write-Host ""

$accounts = @(
    @{ Name = "本账号（默认）"; Script = $null },
    @{ Name = "Account2";       Script = "Account2" },
    @{ Name = "Account3";       Script = "Account3" },
    @{ Name = "Account4";       Script = "Account4" },
    @{ Name = "Account5";       Script = "Account5" },
    @{ Name = "Account6";       Script = "Account6" }
)

$total = $accounts.Count
$accounts | ForEach-Object -Begin { $i = 0 } -Process {
    $i++
    $pct = [math]::Round($i / $total * 100)
    Write-Host "[$i/$total] 启动 $($_.Name)..."
    if ($_.Script) {
        & powershell -ExecutionPolicy Bypass -File $LaunchScript -AccountName $_.Script | Out-Null
    } else {
        Start-Process $ExePath | Out-Null
    }
    Write-Host "  OK"
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "=========================================="
Write-Host "  全部账号已启动完成！"
Write-Host "=========================================="
Write-Host ""
Start-Sleep -Seconds 1
