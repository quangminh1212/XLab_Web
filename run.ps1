# PowerShell script for XLab Web
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "    ⚡ XLab Web - Quick Start" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
    }
    catch {
        Write-Host ""
        Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
else {
    Write-Host "✅ node_modules found. Checking for updates..." -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🔄 Updating dependencies..." -ForegroundColor Yellow
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
    }
    catch {
        Write-Host ""
        Write-Host "❌ Failed to update dependencies." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Dependencies ready!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
Write-Host ""

# Start development server
try {
    npm run dev
}
catch {
    Write-Host ""
    Write-Host "❌ Error occurred while starting server." -ForegroundColor Red
    Read-Host "Press Enter to exit"
} 