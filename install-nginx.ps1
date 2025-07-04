# XLab Web - Nginx Installation Script
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                XLab Web - Nginx Setup" -ForegroundColor Cyan
Write-Host "              Reverse Proxy cho xlab.id.vn" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "[ERROR] Script nay can quyen Administrator!" -ForegroundColor Red
    Write-Host "[INFO] Vui long chay PowerShell as Administrator" -ForegroundColor Yellow
    Read-Host "Nhan Enter de thoat"
    exit 1
}

Write-Host "[SUCCESS] Dang chay voi quyen Administrator" -ForegroundColor Green

# Set variables
$nginxDir = "C:\nginx"
$nginxUrl = "http://nginx.org/download/nginx-1.24.0.zip"
$nginxZip = "nginx-1.24.0.zip"

# Create nginx directory
if (-not (Test-Path $nginxDir)) {
    Write-Host "[INFO] Tao thu muc nginx..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $nginxDir -Force | Out-Null
}

# Check if nginx already exists
if (Test-Path "$nginxDir\nginx.exe") {
    Write-Host "[SUCCESS] Nginx da duoc cai dat" -ForegroundColor Green
} else {
    Write-Host "[INFO] Dang tai va cai dat Nginx..." -ForegroundColor Yellow
    Write-Host "[INFO] Qua trinh nay co the mat vai phut..." -ForegroundColor Yellow

    try {
        # Download nginx
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $nginxUrl -OutFile $nginxZip -UseBasicParsing
        Write-Host "[SUCCESS] Da tai Nginx" -ForegroundColor Green

        # Extract nginx
        Write-Host "[INFO] Giai nen Nginx..." -ForegroundColor Yellow
        Expand-Archive -Path $nginxZip -DestinationPath "." -Force
        
        # Move files
        if (Test-Path "nginx-1.24.0") {
            Copy-Item "nginx-1.24.0\*" -Destination $nginxDir -Recurse -Force
            Remove-Item "nginx-1.24.0" -Recurse -Force
        }
        
        Remove-Item $nginxZip -Force
        
        if (Test-Path "$nginxDir\nginx.exe") {
            Write-Host "[SUCCESS] Da cai dat Nginx" -ForegroundColor Green
        } else {
            throw "Nginx installation failed"
        }
    }
    catch {
        Write-Host "[ERROR] Cai dat Nginx that bai: $($_.Exception.Message)" -ForegroundColor Red
        Read-Host "Nhan Enter de thoat"
        exit 1
    }
}

# Configure nginx
Write-Host "[INFO] Cau hinh Nginx cho xlab.id.vn..." -ForegroundColor Yellow

# Backup existing config
if (Test-Path "$nginxDir\conf\nginx.conf") {
    Copy-Item "$nginxDir\conf\nginx.conf" "$nginxDir\conf\nginx.conf.backup" -Force
}

# Create new nginx config
$nginxConfig = @"
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    # Upstream cho XLab Web
    upstream xlab_backend {
        server 127.0.0.1:3000;
    }

    # HTTP Server
    server {
        listen       80;
        server_name  xlab.id.vn www.xlab.id.vn localhost;

        location / {
            proxy_pass http://xlab_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade `$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host `$host;
            proxy_set_header X-Real-IP `$remote_addr;
            proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto `$scheme;
            proxy_cache_bypass `$http_upgrade;
            proxy_read_timeout 86400;
        }
    }
}
"@

$nginxConfig | Out-File -FilePath "$nginxDir\conf\nginx.conf" -Encoding UTF8

Write-Host "[SUCCESS] Da tao file cau hinh nginx.conf" -ForegroundColor Green

# Create start script
$startScript = @"
@echo off
title Nginx for XLab Web
echo Starting Nginx for xlab.id.vn...
cd /d "$nginxDir"
nginx.exe
if errorlevel 1 (
    echo [ERROR] Nginx khong the khoi dong!
    pause
)
"@

$startScript | Out-File -FilePath "$nginxDir\start-nginx.bat" -Encoding ASCII

# Create stop script
$stopScript = @"
@echo off
title Stop Nginx
echo Stopping Nginx...
cd /d "$nginxDir"
nginx.exe -s quit
echo Nginx stopped.
timeout /t 2 >nul
"@

$stopScript | Out-File -FilePath "$nginxDir\stop-nginx.bat" -Encoding ASCII

Write-Host "[SUCCESS] Da tao cac script quan ly" -ForegroundColor Green

# Configure Windows Firewall
Write-Host "[INFO] Cau hinh Windows Firewall..." -ForegroundColor Yellow

try {
    # Remove old rules
    netsh advfirewall firewall delete rule name="XLab Web Port 3000" | Out-Null
    netsh advfirewall firewall delete rule name="XLab Web HTTP" | Out-Null
    netsh advfirewall firewall delete rule name="XLab Web HTTPS" | Out-Null

    # Add new rules
    netsh advfirewall firewall add rule name="XLab Web Port 3000" dir=in action=allow protocol=TCP localport=3000 | Out-Null
    netsh advfirewall firewall add rule name="XLab Web HTTP" dir=in action=allow protocol=TCP localport=80 | Out-Null
    netsh advfirewall firewall add rule name="XLab Web HTTPS" dir=in action=allow protocol=TCP localport=443 | Out-Null
    
    Write-Host "[SUCCESS] Da cau hinh Windows Firewall" -ForegroundColor Green
}
catch {
    Write-Host "[WARNING] Khong the cau hinh firewall: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                NGINX SETUP COMPLETE" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Location: $nginxDir" -ForegroundColor White
Write-Host "  Config:   $nginxDir\conf\nginx.conf" -ForegroundColor White
Write-Host "  Start:    $nginxDir\start-nginx.bat" -ForegroundColor White
Write-Host "  Stop:     $nginxDir\stop-nginx.bat" -ForegroundColor White
Write-Host "  Domain:   xlab.id.vn (HTTP port 80)" -ForegroundColor White
Write-Host "  Backend:  localhost:3000" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[SUCCESS] Nginx da duoc cai dat va cau hinh cho xlab.id.vn!" -ForegroundColor Green
Write-Host "[INFO] De khoi dong Nginx, chay: $nginxDir\start-nginx.bat" -ForegroundColor Yellow

Read-Host "Nhan Enter de tiep tuc"
