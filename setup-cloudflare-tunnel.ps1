# XLab Web - Cloudflare Tunnel Setup
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                XLab Web - Cloudflare Tunnel" -ForegroundColor Cyan
Write-Host "              Tao tunnel on dinh cho xlab.id.vn" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[INFO] Cloudflare Tunnel la giai phap mien phi va on dinh nhat" -ForegroundColor Yellow
Write-Host "[INFO] Khong can cau hinh router, URL khong doi" -ForegroundColor Yellow
Write-Host ""

# Check if cloudflared exists
$cloudflaredPath = ".\cloudflared.exe"
if (-not (Test-Path $cloudflaredPath)) {
    Write-Host "[INFO] Dang tai cloudflared..." -ForegroundColor Yellow
    
    try {
        # Download cloudflared for Windows
        $downloadUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $downloadUrl -OutFile $cloudflaredPath -UseBasicParsing
        Write-Host "[SUCCESS] Da tai cloudflared thanh cong" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERROR] Khong the tai cloudflared: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "[INFO] Vui long tai thu cong tu: https://github.com/cloudflare/cloudflared/releases" -ForegroundColor Yellow
        Read-Host "Nhan Enter de thoat"
        exit 1
    }
} else {
    Write-Host "[SUCCESS] cloudflared da ton tai" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                CLOUDFLARE TUNNEL SETUP" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[OPTION 1] QUICK TUNNEL (Khong can dang ky):" -ForegroundColor Yellow
Write-Host "  - Nhanh nhat, khong can tai khoan" -ForegroundColor White
Write-Host "  - URL thay doi moi lan restart" -ForegroundColor White
Write-Host "  - Phu hop cho test nhanh" -ForegroundColor White
Write-Host ""

Write-Host "[OPTION 2] NAMED TUNNEL (Can dang ky):" -ForegroundColor Yellow
Write-Host "  - URL co dinh, khong doi" -ForegroundColor White
Write-Host "  - Can tai khoan Cloudflare (mien phi)" -ForegroundColor White
Write-Host "  - Phu hop cho production" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Chon lua chon (1 hoac 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "[INFO] Khoi dong Quick Tunnel..." -ForegroundColor Yellow
    Write-Host "[INFO] Tunnel se chay lien tuc. Nhan Ctrl+C de dung." -ForegroundColor Yellow
    Write-Host ""
    
    # Create batch file to run tunnel
    $tunnelScript = @"
@echo off
title XLab Web - Cloudflare Quick Tunnel
echo ================================================================
echo                XLab Web - Cloudflare Tunnel
echo                     Quick Tunnel Mode
echo ================================================================
echo.
echo [INFO] Dang khoi dong tunnel cho xlab.id.vn...
echo [INFO] Tunnel se tao URL public tu dong
echo [INFO] Nhan Ctrl+C de dung tunnel
echo.
cloudflared.exe tunnel --url http://localhost:80
pause
"@
    
    $tunnelScript | Out-File -FilePath "start-tunnel.bat" -Encoding ASCII
    
    Write-Host "[SUCCESS] Da tao script start-tunnel.bat" -ForegroundColor Green
    Write-Host "[INFO] Chay start-tunnel.bat de khoi dong tunnel" -ForegroundColor Yellow
    
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "[INFO] Thiet lap Named Tunnel..." -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "[STEP 1] Dang nhap Cloudflare:" -ForegroundColor Cyan
    Write-Host "  1. Truy cap: https://dash.cloudflare.com/" -ForegroundColor White
    Write-Host "  2. Dang ky tai khoan mien phi (neu chua co)" -ForegroundColor White
    Write-Host "  3. Dang nhap vao dashboard" -ForegroundColor White
    Write-Host ""
    
    Write-Host "[STEP 2] Chay lenh dang nhap:" -ForegroundColor Cyan
    Write-Host "  cloudflared.exe tunnel login" -ForegroundColor White
    Write-Host ""
    
    Write-Host "[STEP 3] Tao tunnel:" -ForegroundColor Cyan
    Write-Host "  cloudflared.exe tunnel create xlab-web" -ForegroundColor White
    Write-Host ""
    
    Write-Host "[STEP 4] Cau hinh DNS:" -ForegroundColor Cyan
    Write-Host "  cloudflared.exe tunnel route dns xlab-web xlab.id.vn" -ForegroundColor White
    Write-Host ""
    
    Write-Host "[STEP 5] Chay tunnel:" -ForegroundColor Cyan
    Write-Host "  cloudflared.exe tunnel run xlab-web" -ForegroundColor White
    Write-Host ""
    
    # Create detailed setup script
    $namedTunnelScript = @"
@echo off
title XLab Web - Cloudflare Named Tunnel Setup
echo ================================================================
echo                XLab Web - Named Tunnel Setup
echo ================================================================
echo.
echo [STEP 1] Dang nhap Cloudflare...
cloudflared.exe tunnel login
if errorlevel 1 (
    echo [ERROR] Dang nhap that bai!
    pause
    exit /b 1
)
echo.

echo [STEP 2] Tao tunnel 'xlab-web'...
cloudflared.exe tunnel create xlab-web
if errorlevel 1 (
    echo [ERROR] Tao tunnel that bai!
    pause
    exit /b 1
)
echo.

echo [STEP 3] Cau hinh DNS cho xlab.id.vn...
cloudflared.exe tunnel route dns xlab-web xlab.id.vn
if errorlevel 1 (
    echo [WARNING] Cau hinh DNS that bai - co the can cau hinh thu cong
)
echo.

echo [SUCCESS] Setup hoan tat!
echo [INFO] Chay start-named-tunnel.bat de khoi dong tunnel
echo.
pause
"@
    
    $namedTunnelScript | Out-File -FilePath "setup-named-tunnel.bat" -Encoding ASCII
    
    # Create run script for named tunnel
    $runNamedTunnel = @"
@echo off
title XLab Web - Cloudflare Named Tunnel
echo ================================================================
echo                XLab Web - Named Tunnel
echo                     xlab.id.vn
echo ================================================================
echo.
echo [INFO] Khoi dong named tunnel 'xlab-web'...
echo [INFO] Website se co san tai: https://xlab.id.vn
echo [INFO] Nhan Ctrl+C de dung tunnel
echo.
cloudflared.exe tunnel --config config.yml run xlab-web
pause
"@
    
    $runNamedTunnel | Out-File -FilePath "start-named-tunnel.bat" -Encoding ASCII
    
    # Create config file
    $configYml = @"
tunnel: xlab-web
credentials-file: C:\Users\$env:USERNAME\.cloudflared\xlab-web.json

ingress:
  - hostname: xlab.id.vn
    service: http://localhost:80
  - hostname: www.xlab.id.vn
    service: http://localhost:80
  - service: http_status:404
"@
    
    $configYml | Out-File -FilePath "config.yml" -Encoding UTF8
    
    Write-Host "[SUCCESS] Da tao cac script setup:" -ForegroundColor Green
    Write-Host "  - setup-named-tunnel.bat (chay truoc)" -ForegroundColor White
    Write-Host "  - start-named-tunnel.bat (chay sau)" -ForegroundColor White
    Write-Host "  - config.yml (file cau hinh)" -ForegroundColor White
    
} else {
    Write-Host "[ERROR] Lua chon khong hop le!" -ForegroundColor Red
    Read-Host "Nhan Enter de thoat"
    exit 1
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                SETUP COMPLETE" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

if ($choice -eq "1") {
    Write-Host "[NEXT STEPS]:" -ForegroundColor Yellow
    Write-Host "  1. Chay: start-tunnel.bat" -ForegroundColor White
    Write-Host "  2. Copy URL tu output" -ForegroundColor White
    Write-Host "  3. Test URL do thay vi xlab.id.vn" -ForegroundColor White
} else {
    Write-Host "[NEXT STEPS]:" -ForegroundColor Yellow
    Write-Host "  1. Chay: setup-named-tunnel.bat" -ForegroundColor White
    Write-Host "  2. Lam theo huong dan tren man hinh" -ForegroundColor White
    Write-Host "  3. Chay: start-named-tunnel.bat" -ForegroundColor White
    Write-Host "  4. Truy cap: https://xlab.id.vn" -ForegroundColor White
}

Write-Host ""
Write-Host "[UU DIEM CLOUDFLARE TUNNEL]:" -ForegroundColor Green
Write-Host "  ✅ Mien phi va khong gioi han" -ForegroundColor White
Write-Host "  ✅ HTTPS tu dong" -ForegroundColor White
Write-Host "  ✅ Khong can cau hinh router" -ForegroundColor White
Write-Host "  ✅ Bao mat cao" -ForegroundColor White
Write-Host "  ✅ Toc do nhanh" -ForegroundColor White

Read-Host "Nhan Enter de tiep tuc"
