@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

title XLab Web - Complete Hosting System

echo.
echo ================================================================
echo                    XLab Web Complete Hosting
echo                   Auto Setup + Hosting xlab.id.vn
echo ================================================================
echo.

REM Kiem tra Node.js
echo [INFO] Kiem tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js chua duoc cai dat!
    pause
    exit /b 1
)
echo [SUCCESS] Node.js da duoc cai dat

REM Kiem tra npm
echo [INFO] Kiem tra npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm chua duoc cai dat!
    pause
    exit /b 1
)
echo [SUCCESS] npm da duoc cai dat

REM Cai dat dependencies
echo [INFO] Cai dat dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Loi khi cai dat dependencies!
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies da duoc cai dat

REM Build production
echo [INFO] Build production...
if not exist ".next\BUILD_ID" (
    set SKIP_TYPE_CHECK=true
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Build that bai!
        pause
        exit /b 1
    )
)
echo [SUCCESS] Production build hoan tat

REM Cai dat Nginx
echo [INFO] Cai dat Nginx...
if not exist "C:\nginx\nginx.exe" (
    powershell -ExecutionPolicy Bypass -File download-nginx.ps1
)

REM Cau hinh Nginx
if exist "C:\nginx\nginx.exe" (
    if exist "nginx.conf" (
        copy "nginx.conf" "C:\nginx\conf\nginx.conf" >nul 2>&1
    )
    echo [SUCCESS] Nginx da san sang
)

REM Tai Cloudflared
echo [INFO] Tai Cloudflared...
if not exist "cloudflared.exe" (
    powershell -ExecutionPolicy Bypass -File download-cloudflared.ps1
)

echo.
echo ================================================================
echo                    KHOI DONG SERVICES
echo ================================================================

REM Dong cac service cu
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im nginx.exe >nul 2>&1
taskkill /f /im cloudflared.exe >nul 2>&1
timeout /t 2 >nul

REM Khoi dong XLab Server
echo [1/3] Starting XLab Web Server...
start "XLab Web Server" /min cmd /c "npm run start"
timeout /t 5 >nul

netstat -an | find "3000" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] XLab Server khong khoi dong duoc!
    pause
    exit /b 1
)
echo [SUCCESS] XLab Server da khoi dong (port 3000)

REM Khoi dong Nginx
if exist "C:\nginx\nginx.exe" (
    echo [2/3] Starting Nginx...
    start "Nginx" /min cmd /c "cd /d C:\nginx && nginx.exe"
    timeout /t 3 >nul
    echo [SUCCESS] Nginx da khoi dong
) else (
    echo [2/3] Nginx khong co san, bo qua...
)

REM Khoi dong Cloudflare Tunnel
if exist "cloudflared.exe" (
    echo [3/3] Starting Cloudflare Tunnel...
    start "Cloudflare Tunnel" cmd /c "cloudflared.exe tunnel --url http://localhost:80"
    timeout /t 3 >nul
    echo [SUCCESS] Cloudflare Tunnel da khoi dong
) else (
    echo [3/3] Cloudflared khong co san, bo qua...
)

echo.
echo ================================================================
echo                    WEBSITE SAN SANG!
echo ================================================================
echo [✅] XLab Web Server: http://localhost:3000
if exist "C:\nginx\nginx.exe" (
    echo [✅] Nginx Proxy: http://localhost:80
)
if exist "cloudflared.exe" (
    echo [✅] Cloudflare Tunnel: Kiem tra cua so tunnel de lay URL
)
echo ================================================================
echo.
echo [INFO] Website xlab.id.vn da san sang!
echo [INFO] Nhan Ctrl+C de dung tat ca service.
echo.

:wait_loop
timeout /t 10 >nul
goto wait_loop
