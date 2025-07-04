@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Production Hosting Server
REM ========================================
REM Script tu dong khoi dong server production cho xlab.id.vn

title XLab Web - Production Server (xlab.id.vn)

echo.
echo ================================================================
echo                    XLab Web Production Server
echo                   Hosting for xlab.id.vn Domain
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
echo - Mode: Development
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

REM Hien thi thong tin server
echo.
echo ================================================================
echo                    PRODUCTION SERVER READY
echo ================================================================
echo   Domain: xlab.id.vn
echo   Environment: Production
echo   Port: 3000
echo   Host: 0.0.0.0 (All interfaces)
echo   Protocol: HTTP (Reverse proxy to HTTPS)
echo   Status: Starting...
echo ================================================================
echo.

REM Hien thi thong tin ket noi
echo [INFO] Server Configuration:
echo [INFO] - Local Access: http://localhost:3000
echo [INFO] - Network Access: http://[YOUR-IP]:3000
echo [INFO] - Production Domain: https://xlab.id.vn
echo [INFO] - Environment: Production Mode
echo [INFO] - Authentication: Google OAuth Enabled
echo [INFO] - Admin Email: xlab.rnd@gmail.com
echo.

REM Kiem tra port 3000 co san khong
echo [INFO] Kiem tra port 3000...
netstat -an | find "3000" >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Port 3000 dang duoc su dung!
    echo [INFO] Dang thu dong cac tien trinh Node.js cu...
    taskkill /f /im node.exe >nul 2>&1
    timeout /t 3 >nul
)

REM Khoi dong production server
echo [INFO] ========================================
echo [INFO] KHOI DONG PRODUCTION SERVER CHO XLAB.ID.VN
echo [INFO] ========================================
echo [INFO] Starting Next.js Production Server...
echo [INFO] Domain: xlab.id.vn
echo [INFO] Port: 3000
echo [INFO] Environment: Production
echo [INFO] ========================================
echo.

REM Tao log file
if not exist "logs" mkdir "logs"
set LOG_FILE=logs\server-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.log
set LOG_FILE=%LOG_FILE: =0%

echo [INFO] Log file: %LOG_FILE%
echo [INFO] Server dang khoi dong...
echo.

REM Khoi dong server voi logging
echo [%date% %time%] Starting XLab Web Production Server for xlab.id.vn > "%LOG_FILE%"
echo [%date% %time%] Environment: Production >> "%LOG_FILE%"
echo [%date% %time%] Port: 3000 >> "%LOG_FILE%"
echo [%date% %time%] Domain: xlab.id.vn >> "%LOG_FILE%"

echo ================================================================
echo   XLab Web Production Server is STARTING...
echo   Domain: https://xlab.id.vn
echo   Local: http://localhost:3000
echo   Status: Initializing...
echo   Log: %LOG_FILE%
echo ================================================================
echo.
echo [INFO] Server se chay lien tuc. Nhan Ctrl+C de dung server.
echo [INFO] Neu ban dong cua so nay, server se bi dung.
echo.

REM Khoi dong server production
call npm run start

REM Xu ly khi server dung
if errorlevel 1 (
    echo.
    echo [ERROR] ========================================
    echo [ERROR] PRODUCTION SERVER DA DUNG VOI LOI!
    echo [ERROR] ========================================
    echo [ERROR] Thoi gian: %date% %time%
    echo [ERROR] Log file: %LOG_FILE%
    echo [ERROR] ========================================
    echo [%date% %time%] Server stopped with error >> "%LOG_FILE%"
    echo.
    echo [INFO] Kiem tra log file de xem chi tiet loi.
    echo [INFO] Nhan phim bat ky de thoat...
    pause >nul
) else (
    echo.
    echo [INFO] ========================================
    echo [INFO] PRODUCTION SERVER DA DUNG BINH THUONG
    echo [INFO] ========================================
    echo [INFO] Thoi gian: %date% %time%
    echo [INFO] Domain xlab.id.vn da ngung hoat dong
    echo [INFO] Log file: %LOG_FILE%
    echo [INFO] ========================================
    echo [%date% %time%] Server stopped normally >> "%LOG_FILE%"
    echo.
    echo [INFO] De khoi dong lai server, chay lai start.bat
    echo [INFO] Nhan phim bat ky de thoat...
    pause >nul
)