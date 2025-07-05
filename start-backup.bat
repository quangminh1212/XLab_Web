@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Complete Hosting System
REM ========================================
REM Script tu dong thiet lap va khoi dong xlab.id.vn

title XLab Web - Complete Hosting System (xlab.id.vn)

echo.
echo ================================================================
echo                    XLab Web Complete Hosting
echo                   Auto Setup + Hosting xlab.id.vn
echo ================================================================
echo.

REM Mau sac cho production server
color 0B

REM Kiem tra Node.js
echo [INFO] Kiem tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js chua duoc cai dat!
    echo [INFO] Vui long tai va cai dat Node.js tu: https://nodejs.org/
    pause
    exit /b 1
)
echo [SUCCESS] Node.js da duoc cai dat

REM Kiem tra npm
echo [INFO] Kiem tra npm...
call npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm chua duoc cai dat!
    pause
    exit /b 1
)
echo [SUCCESS] npm da duoc cai dat

REM Hien thi thong tin he thong
echo [INFO] Thong tin he thong:
for /f "tokens=*" %%i in ('node --version 2^>nul') do echo - Node.js: %%i
for /f "tokens=1" %%i in ('npm --version 2^>nul') do echo - npm: %%i
echo - OS: Windows
echo - Mode: Complete Hosting
echo.

REM Kiem tra thu muc du an
if not exist "package.json" (
    echo [ERROR] Khong tim thay package.json!
    echo [INFO] Vui long chay script nay trong thu muc goc cua du an.
    pause
    exit /b 1
)
echo [SUCCESS] Tim thay package.json

REM Tao thu muc can thiet
echo [INFO] Tao thu muc can thiet...
if not exist "src\i18n\eng\product" mkdir "src\i18n\eng\product" 2>nul
if not exist "src\i18n\vie\product" mkdir "src\i18n\vie\product" 2>nul
if not exist ".next\cache" mkdir ".next\cache" 2>nul
echo [SUCCESS] Da tao thu muc can thiet

REM Sao chep file i18n neu can
echo [INFO] Kiem tra file i18n...
if exist "src\i18n\vie\product\index.ts" (
    if not exist "src\i18n\eng\product\index.ts" (
        copy "src\i18n\vie\product\index.ts" "src\i18n\eng\product\index.ts" >nul 2>&1
        echo [SUCCESS] Da sao chep file i18n
    )
)

REM Tao file .env.production cho xlab.id.vn
echo [INFO] Cau hinh environment cho production (xlab.id.vn)...
(
    echo NEXTAUTH_SECRET=Cmjb/lPYHoCnsiaEh0KwFkGG7POh6v3S3DXm169y8+U=
    echo NEXTAUTH_URL=https://xlab.id.vn
    echo GOOGLE_CLIENT_ID=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com
    echo GOOGLE_CLIENT_SECRET=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
    echo ADMIN_EMAILS=xlab.rnd@gmail.com
    echo NODE_ENV=production
    echo PORT=3000
    echo HOST=0.0.0.0
) > .env.local
echo [SUCCESS] Da cau hinh environment cho xlab.id.vn

REM Backup file .env.local thanh .env.production
copy ".env.local" ".env.production" >nul 2>&1
echo [SUCCESS] Da backup environment config

REM Kiem tra va cai dat tat ca dependencies (can cho build)
echo [INFO] Cai dat dependencies (bao gom dev dependencies cho build)...
call npm install
if errorlevel 1 (
    echo [ERROR] Loi khi cai dat dependencies!
    echo [INFO] Thu chay: npm cache clean --force
    echo [ERROR] Server khong the khoi dong. Dang thoat...
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies da duoc cai dat

REM Chay fix scripts
echo [INFO] Chuan bi moi truong production...
if exist "scripts\fix-next-errors.js" (
    call node scripts\fix-next-errors.js
    echo [SUCCESS] Da chuan bi moi truong Next.js
)

if exist "scripts\fix-language-issues.js" (
    call node scripts\fix-language-issues.js 2>nul
    if errorlevel 1 (
        echo [WARNING] Fix language script co loi, bo qua...
    ) else (
        echo [SUCCESS] Da sua loi ngon ngu
    )
)

REM Build production neu chua co
echo [INFO] Kiem tra va build production...
if not exist ".next\BUILD_ID" (
    echo [INFO] Dang build production cho xlab.id.vn...
    echo [INFO] Qua trinh nay co the mat 2-5 phut...
    set SKIP_TYPE_CHECK=true
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Build production that bai!
        echo [ERROR] Server khong the khoi dong. Dang thoat...
        pause
        exit /b 1
    )
    echo [SUCCESS] Build production hoan tat
) else (
    echo [SUCCESS] Production build da ton tai
)

REM Thiet lap Nginx Reverse Proxy
echo.
echo ================================================================
echo                    NGINX REVERSE PROXY SETUP
echo ================================================================
echo [INFO] Thiet lap Nginx reverse proxy cho xlab.id.vn...

REM Kiem tra va cai dat Nginx
if not exist "C:\nginx\nginx.exe" (
    echo [INFO] Nginx chua duoc cai dat, dang tai va cai dat...
    powershell -ExecutionPolicy Bypass -File download-nginx.ps1
    if not exist "C:\nginx\nginx.exe" (
        echo [ERROR] Khong the cai dat Nginx!
        echo [WARNING] Website se chi chay tren localhost:3000
    ) else (
        echo [SUCCESS] Nginx da duoc cai dat
    )
) else (
    echo [SUCCESS] Nginx da ton tai
)

REM Cau hinh Nginx
if exist "C:\nginx\nginx.exe" (
    echo [INFO] Cau hinh Nginx cho xlab.id.vn...

    REM Copy file cau hinh nginx da co san
    if exist "nginx.conf" (
        copy "nginx.conf" "C:\nginx\conf\nginx.conf" >nul 2>&1
        echo [SUCCESS] Da cau hinh Nginx
    ) else (
        echo [WARNING] Khong tim thay nginx.conf, su dung cau hinh mac dinh
    )
)

REM Thiet lap Cloudflare Tunnel
echo.
echo ================================================================
echo                    CLOUDFLARE TUNNEL SETUP
echo ================================================================
echo [INFO] Thiet lap Cloudflare Tunnel cho xlab.id.vn...

REM Kiem tra va tai cloudflared
if not exist "cloudflared.exe" (
    echo [INFO] Dang tai cloudflared...
    powershell -ExecutionPolicy Bypass -File download-cloudflared.ps1
    if exist "cloudflared.exe" (
        echo [SUCCESS] Cloudflared da duoc tai
    ) else (
        echo [WARNING] Khong the tai cloudflared, se bo qua tunnel setup
    )
) else (
    echo [SUCCESS] Cloudflared da ton tai
)

echo [SUCCESS] Thiet lap hoan tat
echo.
echo ================================================================
echo                    COMPLETE HOSTING READY
echo ================================================================
echo   Domain: xlab.id.vn
echo   Environment: Production
echo   XLab Server: Port 3000
echo   Nginx Proxy: Port 80, 8080
echo   Cloudflare Tunnel: Ready
echo   Status: Starting...
echo ================================================================
echo.

REM Hien thi thong tin ket noi
echo [INFO] Complete Hosting Configuration:
echo [INFO] - XLab Server: http://localhost:3000
echo [INFO] - Nginx Proxy: http://localhost:80, http://localhost:8080
echo [INFO] - Production Domain: https://xlab.id.vn (via Cloudflare Tunnel)
echo [INFO] - Environment: Production Mode
echo [INFO] - Authentication: Google OAuth Enabled
echo [INFO] - Admin Email: xlab.rnd@gmail.com
echo.

REM Kiem tra va dong cac service cu
echo [INFO] Dong cac service cu...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im nginx.exe >nul 2>&1
taskkill /f /im cloudflared.exe >nul 2>&1
timeout /t 2 >nul

REM Khoi dong tat ca cac service
echo [INFO] ========================================
echo [INFO] KHOI DONG COMPLETE HOSTING CHO XLAB.ID.VN
echo [INFO] ========================================
echo [INFO] Starting XLab Web Complete Hosting System...
echo [INFO] Domain: xlab.id.vn
echo [INFO] Services: XLab Server + Nginx + Cloudflare Tunnel
echo [INFO] ========================================
echo.

REM Tao log file
if not exist "logs" mkdir "logs"
set LOG_FILE=logs\hosting-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.log
set LOG_FILE=%LOG_FILE: =0%

echo [INFO] Log file: %LOG_FILE%
echo.

REM Khoi dong server voi logging
echo [%date% %time%] Starting XLab Web Complete Hosting for xlab.id.vn > "%LOG_FILE%"
echo [%date% %time%] Environment: Production >> "%LOG_FILE%"
echo [%date% %time%] Services: XLab + Nginx + Cloudflare >> "%LOG_FILE%"

echo ================================================================
echo   XLab Web Complete Hosting is STARTING...
echo   Domain: https://xlab.id.vn
echo   Services: XLab Server + Nginx + Cloudflare Tunnel
echo   Status: Initializing...
echo   Log: %LOG_FILE%
echo ================================================================
echo.

REM Khoi dong XLab Web Server (background)
echo [1/3] Starting XLab Web Server...
start "XLab Web Server" /min cmd /c "npm run start"
timeout /t 5 >nul

REM Kiem tra XLab Server
netstat -an | find "3000" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] XLab Web Server khong khoi dong duoc!
    pause
    exit /b 1
)
echo [SUCCESS] XLab Web Server da khoi dong (port 3000)

REM Khoi dong Nginx (neu co)
if exist "C:\nginx\nginx.exe" (
    echo [2/3] Starting Nginx Reverse Proxy...
    start "Nginx" /min cmd /c "cd /d C:\nginx && nginx.exe"
    timeout /t 3 >nul

    netstat -an | find ":80 " >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Nginx khong khoi dong duoc
    ) else (
        echo [SUCCESS] Nginx da khoi dong (port 80, 8080)
    )
) else (
    echo [2/3] Nginx khong co san, bo qua...
)

REM Khoi dong Cloudflare Tunnel (neu co)
if exist "cloudflared.exe" (
    echo [3/3] Starting Cloudflare Tunnel...
    echo [INFO] Tao quick tunnel cho xlab.id.vn...
    start "Cloudflare Tunnel" cmd /c "cloudflared.exe tunnel --url http://localhost:80"
    timeout /t 5 >nul
    echo [SUCCESS] Cloudflare Tunnel da khoi dong
    echo [INFO] Kiem tra terminal Cloudflare de lay URL public
) else (
    echo [3/3] Cloudflared khong co san, bo qua tunnel...
    echo [INFO] Website chi hoat dong local: http://localhost
)

echo.
echo ================================================================
echo                    HOSTING SYSTEM READY!
echo ================================================================
echo [✅] XLab Web Server: http://localhost:3000
if exist "C:\nginx\nginx.exe" (
    echo [✅] Nginx Proxy: http://localhost:80, http://localhost:8080
) else (
    echo [⚠️] Nginx: Not installed
)
if exist "cloudflared.exe" (
    echo [✅] Cloudflare Tunnel: Check tunnel window for public URL
    echo [INFO] Public URL will be like: https://abc123.trycloudflare.com
    echo [INFO] This URL will redirect to xlab.id.vn content
) else (
    echo [⚠️] Cloudflare Tunnel: Not installed
)
echo ================================================================
echo.
echo [INFO] Tat ca service dang chay. Website xlab.id.vn san sang!
echo [INFO] Nhan Ctrl+C de dung tat ca service.
echo [INFO] Neu dong cua so nay, tat ca service se bi dung.
echo.

REM Giu cua so mo va xu ly Ctrl+C
echo [INFO] Waiting... (Press Ctrl+C to stop all services)

REM Thiet lap xu ly Ctrl+C
if "%1"=="cleanup" goto cleanup

:wait_loop
timeout /t 10 >nul
if errorlevel 1 goto cleanup
goto wait_loop

REM Xu ly khi dung (Ctrl+C)
:cleanup
echo.
echo [INFO] ========================================
echo [INFO] DANG DUNG TAT CA SERVICE...
echo [INFO] ========================================
echo [INFO] Thoi gian: %date% %time%

REM Dong tat ca service
echo [INFO] Dong XLab Web Server...
taskkill /f /im node.exe >nul 2>&1

echo [INFO] Dong Nginx...
if exist "C:\nginx\nginx.exe" (
    C:\nginx\nginx.exe -s quit >nul 2>&1
    taskkill /f /im nginx.exe >nul 2>&1
)

echo [INFO] Dong Cloudflare Tunnel...
taskkill /f /im cloudflared.exe >nul 2>&1

echo [%date% %time%] All services stopped >> "%LOG_FILE%"

echo.
echo [INFO] ========================================
echo [INFO] TAT CA SERVICE DA DUNG
echo [INFO] ========================================
echo [INFO] Domain xlab.id.vn da ngung hoat dong
echo [INFO] Log file: %LOG_FILE%
echo [INFO] ========================================
echo.
echo [INFO] De khoi dong lai website, chay lai start.bat
echo [INFO] Nhan phim bat ky de thoat...
pause >nul