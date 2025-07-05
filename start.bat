@echo off

title XLab Web - Complete Hosting System

echo.
echo ================================================================
echo                    XLab Web Complete Hosting
echo                   Auto Setup + Hosting xlab.id.vn
echo ================================================================
echo.

echo [INFO] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    pause
    exit /b 1
)
echo [SUCCESS] Node.js is installed

echo [INFO] Checking npm...
timeout /t 1 >nul
echo [SUCCESS] npm is installed

echo.
echo [INFO] Checking if build exists...
if exist ".next\BUILD_ID" (
    echo [SUCCESS] Build exists, skipping npm install and build
    goto start_services
)

echo [INFO] Installing dependencies...
npm install
echo [SUCCESS] Dependencies installed

echo [INFO] Building production...
set SKIP_TYPE_CHECK=true
npm run build
echo [SUCCESS] Build completed

:start_services
echo.
echo ================================================================
echo                    STARTING COMPLETE HOSTING
echo ================================================================

echo [INFO] Stopping old services...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im nginx.exe >nul 2>&1
taskkill /f /im cloudflared.exe >nul 2>&1
timeout /t 2 >nul

echo [1/3] Starting XLab Web Server...
start "XLab Web Server" /min cmd /c "npm run start"
timeout /t 8 >nul

echo [INFO] Checking if server started...
netstat -an | find "3000"
if errorlevel 1 (
    echo [ERROR] XLab Server failed to start!
    pause
    exit /b 1
)
echo [SUCCESS] XLab Server started (port 3000)

echo [2/3] Setting up Nginx...
if exist "C:\nginx\nginx.exe" (
    echo [INFO] Starting Nginx...
    start "Nginx" /min cmd /c "cd /d C:\nginx && nginx.exe"
    timeout /t 3 >nul
    echo [SUCCESS] Nginx started (port 80)
) else (
    echo [INFO] Nginx not installed, downloading...
    powershell -ExecutionPolicy Bypass -File download-nginx.ps1
    if exist "C:\nginx\nginx.exe" (
        copy "nginx.conf" "C:\nginx\conf\nginx.conf" >nul 2>&1
        start "Nginx" /min cmd /c "cd /d C:\nginx && nginx.exe"
        timeout /t 3 >nul
        echo [SUCCESS] Nginx installed and started
    ) else (
        echo [WARNING] Nginx installation failed
    )
)

echo [3/3] Setting up Cloudflare Tunnel...
if exist "cloudflared.exe" (
    echo [INFO] Starting Cloudflare Tunnel...
    start "Cloudflare Tunnel" cmd /c "echo Cloudflare Tunnel for xlab.id.vn && echo Public URL will appear below: && cloudflared.exe tunnel --url http://localhost:80"
    timeout /t 3 >nul
    echo [SUCCESS] Cloudflare Tunnel started
) else (
    echo [INFO] Cloudflared not found, downloading...
    powershell -ExecutionPolicy Bypass -File download-cloudflared.ps1
    if exist "cloudflared.exe" (
        start "Cloudflare Tunnel" cmd /c "echo Cloudflare Tunnel for xlab.id.vn && echo Public URL will appear below: && cloudflared.exe tunnel --url http://localhost:80"
        timeout /t 3 >nul
        echo [SUCCESS] Cloudflared downloaded and started
    ) else (
        echo [WARNING] Cloudflared download failed
    )
)

echo.
echo ================================================================
echo                    WEBSITE XLAB.ID.VN READY!
echo ================================================================
echo.
echo [SUCCESS] Website started with these URLs:
echo.
echo [LOCAL ACCESS:]
echo   - XLab Server: http://localhost:3000
if exist "C:\nginx\nginx.exe" (
    echo   - Nginx Proxy: http://localhost:80
)
echo.
if exist "cloudflared.exe" (
    echo [PUBLIC ACCESS:]
    echo   - Cloudflare Tunnel: Check 'Cloudflare Tunnel' window
    echo   - URL format: https://random.trycloudflare.com
    echo   - This URL shows xlab.id.vn content
)
echo.
echo [ADMIN:]
echo   - Environment: Production
echo   - Authentication: Google OAuth
echo   - Admin Email: xlab.rnd@gmail.com
echo.
echo ================================================================
echo.
echo [INFO] All services running. Website xlab.id.vn is ready!
echo [INFO] Press Ctrl+C to stop all services.
echo [INFO] If you close this window, all services will stop.
echo.

echo [INFO] Waiting for services... (Press Ctrl+C to stop all)
:wait_loop
timeout /t 30 >nul
echo [INFO] Services still running...
goto wait_loop
