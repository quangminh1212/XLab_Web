# XLab Web - PowerShell Deployment Script
# Usage: .\run.ps1

param(
    [string]$Action = "menu",
    [string]$Environment = "development"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

function Write-ColorOutput($ForegroundColor, $Message) {
    Write-Host $Message -ForegroundColor $ForegroundColor
}

function Show-Menu {
    Clear-Host
    Write-ColorOutput $Blue "=========================================="
    Write-ColorOutput $Blue "    XLab Web - Development & Deployment"
    Write-ColorOutput $Blue "    Domain: xlab.id.vn"
    Write-ColorOutput $Blue "=========================================="
    Write-Host ""
    Write-Host "[1] Development Mode (Local)"
    Write-Host "[2] Production Build & Test"
    Write-Host "[3] Deploy to Server (SSH)"
    Write-Host "[4] Health Check"
    Write-Host "[5] Fix Common Issues"
    Write-Host "[6] Generate SSL Commands"
    Write-Host "[7] Exit"
    Write-Host ""
    $choice = Read-Host "Chọn tùy chọn (1-7)"
    return $choice
}

function Test-Prerequisites {
    Write-ColorOutput $Blue "Kiểm tra prerequisites..."
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-ColorOutput $Green "✅ Node.js: $nodeVersion"
    }
    catch {
        Write-ColorOutput $Red "❌ Node.js chưa được cài đặt!"
        Write-ColorOutput $Yellow "Vui lòng cài đặt Node.js 18+ từ https://nodejs.org"
        return $false
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-ColorOutput $Green "✅ npm: $npmVersion"
    }
    catch {
        Write-ColorOutput $Red "❌ npm không khả dụng!"
        return $false
    }
    
    return $true
}

function Start-Development {
    Write-ColorOutput $Blue "=========================================="
    Write-ColorOutput $Blue "    Development Mode Setup"
    Write-ColorOutput $Blue "=========================================="
    
    if (-not (Test-Prerequisites)) {
        return
    }
    
    Write-ColorOutput $Blue "[1] Sửa lỗi SWC version..."
    npm install @next/swc-win32-x64-msvc@15.2.4
    
    Write-ColorOutput $Blue "[2] Cài đặt dependencies..."
    npm install
    
    Write-ColorOutput $Blue "[3] Chuẩn bị i18n directories..."
    if (-not (Test-Path "src\i18n\eng\product")) {
        New-Item -ItemType Directory -Path "src\i18n\eng\product" -Force
        Write-ColorOutput $Green "Created directory: src\i18n\eng\product"
    }
    
    Write-ColorOutput $Blue "[4] Copy product files..."
    $files = @("chatgpt.json", "grok.json", "index.ts")
    foreach ($file in $files) {
        $source = "src\i18n\vie\product\$file"
        $dest = "src\i18n\eng\product\$file"
        if (Test-Path $source) {
            Copy-Item $source $dest -Force
            Write-ColorOutput $Green "Copied: $file"
        }
    }
    
    Write-ColorOutput $Blue "[5] Fix language issues..."
    node scripts/fix-language-issues.js
    
    Write-ColorOutput $Blue "[6] Clear Next.js cache..."
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
    }
    
    Write-ColorOutput $Blue "[7] Kiểm tra environment variables..."
    if (-not (Test-Path ".env.local")) {
        Write-ColorOutput $Yellow "⚠️ File .env.local không tồn tại!"
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env.local"
            Write-ColorOutput $Green "✅ Đã tạo .env.local từ .env.example"
            Write-ColorOutput $Yellow "⚠️ Vui lòng cập nhật các biến môi trường trong .env.local"
        }
    }
    
    Write-ColorOutput $Green ""
    Write-ColorOutput $Green "✅ Setup hoàn tất! Khởi động development server..."
    Write-ColorOutput $Blue "🌐 Local: http://localhost:3000"
    Write-ColorOutput $Blue "🌐 Network: http://192.168.1.x:3000"
    Write-Host ""
    
    npm run dev
}

function Build-Production {
    Write-ColorOutput $Blue "=========================================="
    Write-ColorOutput $Blue "    Production Build & Test"
    Write-ColorOutput $Blue "=========================================="
    
    if (-not (Test-Prerequisites)) {
        return
    }
    
    Write-ColorOutput $Blue "[1] Kiểm tra environment production..."
    if (-not (Test-Path ".env.production")) {
        Write-ColorOutput $Red "❌ File .env.production không tồn tại!"
        Write-ColorOutput $Yellow "Vui lòng tạo file .env.production với các biến môi trường cần thiết."
        return
    }
    
    Write-ColorOutput $Blue "[2] Copy environment cho production..."
    Copy-Item ".env.production" ".env.local" -Force
    Write-ColorOutput $Green "✅ Đã copy .env.production -> .env.local"
    
    Write-ColorOutput $Blue "[3] Cài đặt dependencies..."
    npm ci --only=production
    
    Write-ColorOutput $Blue "[4] Chạy type checking..."
    $typeCheck = npm run type-check
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput $Red "❌ Type checking failed!"
        return
    }
    
    Write-ColorOutput $Blue "[5] Chạy linting..."
    $lint = npm run lint
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput $Red "❌ Linting failed!"
        return
    }
    
    Write-ColorOutput $Blue "[6] Build ứng dụng..."
    $build = npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput $Red "❌ Build failed!"
        return
    }
    
    Write-ColorOutput $Green ""
    Write-ColorOutput $Green "✅ Production build hoàn tất!"
    Write-ColorOutput $Blue ""
    Write-ColorOutput $Blue "📋 Các bước tiếp theo:"
    Write-ColorOutput $Blue "1. Upload source code lên server (1.52.110.251)"
    Write-ColorOutput $Blue "2. Chạy script: sudo ./scripts/setup-xlab-id-vn.sh"
    Write-ColorOutput $Blue "3. Cập nhật Google OAuth credentials"
    Write-ColorOutput $Blue "4. Test website tại https://xlab.id.vn"
    Write-Host ""
    
    $test = Read-Host "Bạn có muốn test production build locally? (y/n)"
    if ($test -eq "y" -or $test -eq "Y") {
        Write-ColorOutput $Blue "Khởi động production server..."
        npm run start
    }
}

function Deploy-ToServer {
    Write-ColorOutput $Blue "=========================================="
    Write-ColorOutput $Blue "    Deploy to Server (SSH)"
    Write-ColorOutput $Blue "=========================================="
    
    $serverIP = "1.52.110.251"
    Write-ColorOutput $Blue "Server IP: $serverIP"
    Write-ColorOutput $Blue "Domain: xlab.id.vn"
    Write-Host ""
    
    Write-ColorOutput $Yellow "Các bước deploy:"
    Write-ColorOutput $Yellow "1. Kết nối SSH: ssh root@$serverIP"
    Write-ColorOutput $Yellow "2. Upload source code"
    Write-ColorOutput $Yellow "3. Chạy setup script"
    Write-Host ""
    
    Write-ColorOutput $Blue "SSH Commands:"
    Write-Host "ssh root@$serverIP" -ForegroundColor White
    Write-Host "cd /tmp && git clone <your-repo> xlab-web" -ForegroundColor White
    Write-Host "cd xlab-web && chmod +x scripts/setup-xlab-id-vn.sh" -ForegroundColor White
    Write-Host "sudo ./scripts/setup-xlab-id-vn.sh" -ForegroundColor White
    Write-Host ""
    
    $copyCommands = Read-Host "Bạn có muốn copy commands vào clipboard? (y/n)"
    if ($copyCommands -eq "y" -or $copyCommands -eq "Y") {
        $commands = @"
ssh root@$serverIP
cd /tmp && git clone <your-repo> xlab-web
cd xlab-web && chmod +x scripts/setup-xlab-id-vn.sh
sudo ./scripts/setup-xlab-id-vn.sh
"@
        $commands | Set-Clipboard
        Write-ColorOutput $Green "✅ Commands đã được copy vào clipboard!"
    }
}

function Test-Health {
    Write-ColorOutput $Blue "=========================================="
    Write-ColorOutput $Blue "    Health Check"
    Write-ColorOutput $Blue "=========================================="
    
    $files = @{
        "package.json" = "Package configuration"
        "next.config.js" = "Next.js configuration"
        ".env.local" = "Environment variables (optional for dev)"
        "src\app\layout.tsx" = "Main layout component"
        "node_modules" = "Dependencies"
    }
    
    foreach ($file in $files.Keys) {
        if (Test-Path $file) {
            Write-ColorOutput $Green "✅ $file - $($files[$file])"
        } else {
            Write-ColorOutput $Red "❌ $file - $($files[$file])"
        }
    }
    
    Write-Host ""
    Write-ColorOutput $Blue "Kiểm tra scripts..."
    if (Test-Path "scripts\health-check.sh") {
        Write-ColorOutput $Green "✅ Health check script có sẵn"
    } else {
        Write-ColorOutput $Yellow "⚠️ Health check script không tồn tại"
    }
    
    Write-Host ""
    $testUrl = Read-Host "Bạn có muốn test URL https://xlab.id.vn? (y/n)"
    if ($testUrl -eq "y" -or $testUrl -eq "Y") {
        try {
            $response = Invoke-WebRequest -Uri "https://xlab.id.vn" -Method Head -TimeoutSec 10
            Write-ColorOutput $Green "✅ Website phản hồi: $($response.StatusCode)"
        }
        catch {
            Write-ColorOutput $Red "❌ Không thể kết nối đến website: $($_.Exception.Message)"
        }
    }
}

function Fix-CommonIssues {
    Write-ColorOutput $Blue "=========================================="
    Write-ColorOutput $Blue "    Fix Common Issues"
    Write-ColorOutput $Blue "=========================================="
    
    Write-ColorOutput $Blue "[1] Sửa SWC version mismatch..."
    npm install @next/swc-win32-x64-msvc@15.2.4
    
    Write-ColorOutput $Blue "[2] Clear caches..."
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
        Write-ColorOutput $Green "✅ Cleared .next cache"
    }
    
    if (Test-Path "node_modules\.cache") {
        Remove-Item "node_modules\.cache" -Recurse -Force
        Write-ColorOutput $Green "✅ Cleared node_modules cache"
    }
    
    Write-ColorOutput $Blue "[3] Reinstall dependencies..."
    npm install
    
    Write-ColorOutput $Blue "[4] Fix language issues..."
    node scripts/fix-language-issues.js
    
    Write-ColorOutput $Green "✅ Common issues fixed!"
}

function Generate-SSLCommands {
    Write-ColorOutput $Blue "=========================================="
    Write-ColorOutput $Blue "    SSL Commands for xlab.id.vn"
    Write-ColorOutput $Blue "=========================================="
    
    Write-ColorOutput $Yellow "Commands để cài đặt SSL trên server:"
    Write-Host ""
    Write-Host "# Cài đặt Certbot" -ForegroundColor White
    Write-Host "sudo apt install certbot python3-certbot-nginx" -ForegroundColor White
    Write-Host ""
    Write-Host "# Tạo SSL certificate" -ForegroundColor White
    Write-Host "sudo certbot --nginx -d xlab.id.vn -d www.xlab.id.vn" -ForegroundColor White
    Write-Host ""
    Write-Host "# Test auto-renewal" -ForegroundColor White
    Write-Host "sudo certbot renew --dry-run" -ForegroundColor White
    Write-Host ""
    Write-Host "# Kiểm tra SSL" -ForegroundColor White
    Write-Host "openssl s_client -servername xlab.id.vn -connect xlab.id.vn:443" -ForegroundColor White
    Write-Host ""
    
    $copySSL = Read-Host "Copy SSL commands vào clipboard? (y/n)"
    if ($copySSL -eq "y" -or $copySSL -eq "Y") {
        $sslCommands = @"
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d xlab.id.vn -d www.xlab.id.vn
sudo certbot renew --dry-run
openssl s_client -servername xlab.id.vn -connect xlab.id.vn:443
"@
        $sslCommands | Set-Clipboard
        Write-ColorOutput $Green "✅ SSL commands đã được copy vào clipboard!"
    }
}

# Main execution
switch ($Action) {
    "menu" {
        do {
            $choice = Show-Menu
            switch ($choice) {
                "1" { Start-Development }
                "2" { Build-Production }
                "3" { Deploy-ToServer }
                "4" { Test-Health }
                "5" { Fix-CommonIssues }
                "6" { Generate-SSLCommands }
                "7" { 
                    Write-ColorOutput $Green "Cảm ơn bạn đã sử dụng XLab Web Tool!"
                    exit 
                }
                default { 
                    Write-ColorOutput $Red "❌ Lựa chọn không hợp lệ!"
                    Start-Sleep -Seconds 2
                }
            }
            if ($choice -ne "7") {
                Write-Host ""
                Read-Host "Nhấn Enter để tiếp tục..."
            }
        } while ($choice -ne "7")
    }
    "dev" { Start-Development }
    "build" { Build-Production }
    "deploy" { Deploy-ToServer }
    "health" { Test-Health }
    "fix" { Fix-CommonIssues }
    "ssl" { Generate-SSLCommands }
    default { Show-Menu }
}
