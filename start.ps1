Write-Host "======================================" -ForegroundColor Green
Write-Host "  XLab Web - PowerShell Launcher" -ForegroundColor Green  
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "[1/4] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "+ Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "X Node.js not found! Please install from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check npm
Write-Host ""
Write-Host "[2/4] Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "+ npm $npmVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "X npm not found!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install missing packages
Write-Host ""
Write-Host "[3/4] Installing dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules\@radix-ui\react-slot") {
    Write-Host "+ @radix-ui/react-slot already installed" -ForegroundColor Green
} else {
    Write-Host "Installing @radix-ui/react-slot..." -ForegroundColor Blue
    npm install @radix-ui/react-slot --no-fund --no-audit
    if ($LASTEXITCODE -eq 0) {
        Write-Host "+ Package installed successfully" -ForegroundColor Green
    } else {
        Write-Host "X Failed to install package" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Clean cache
Write-Host ""
Write-Host "[4/4] Starting server..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "+ Cache cleared" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "URL: http://localhost:3000" -ForegroundColor White
Write-Host "Press Ctrl+C to stop" -ForegroundColor White
Write-Host ""

npm run dev:simple 