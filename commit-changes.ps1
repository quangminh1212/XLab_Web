# PowerShell script to commit changes using GitHub CLI or Git
param(
    [string]$Message = "Fix encoding issues in batch files"
)

Write-Host "Attempting to commit changes..." -ForegroundColor Green

# Try to find Git executable
$gitPaths = @(
    "git",
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\git.exe"
)

$gitExe = $null
foreach ($path in $gitPaths) {
    try {
        if (Get-Command $path -ErrorAction SilentlyContinue) {
            $gitExe = $path
            break
        }
    }
    catch {
        continue
    }
}

if ($gitExe) {
    Write-Host "Found Git at: $gitExe" -ForegroundColor Yellow
    
    # Add all changes
    & $gitExe add .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Files staged successfully" -ForegroundColor Green
        
        # Commit changes
        & $gitExe commit -m $Message
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Changes committed successfully" -ForegroundColor Green
            
            # Push changes
            & $gitExe push
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Changes pushed to GitHub successfully" -ForegroundColor Green
            } else {
                Write-Host "Failed to push changes" -ForegroundColor Red
            }
        } else {
            Write-Host "Failed to commit changes" -ForegroundColor Red
        }
    } else {
        Write-Host "Failed to stage files" -ForegroundColor Red
    }
} else {
    Write-Host "Git not found. Please install Git or GitHub Desktop" -ForegroundColor Red
    Write-Host "You can download Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
}

Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
