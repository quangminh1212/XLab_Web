@echo off
setlocal enabledelayedexpansion

title XLab Web - Launcher
color 0A

echo ========================================================
echo     XLab Web - Launcher 
echo     (khoi dong tren Windows)
echo ========================================================
echo.

REM Xac dinh duong dan hien tai
cd /d "%~dp0"
echo Thu muc hien tai: %CD%
echo.

REM Dung cac tien trinh Node.js
echo [1/4] Dung cac tien trinh Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 >nul
echo.

REM Xoa cache Next.js
echo [2/4] Xoa cache Next.js...
if exist ".next" (
    echo Dang xoa thu muc .next...
    rmdir /S /Q .next 2>nul
    if exist ".next" (
        del /F /S /Q ".next\*.*" >nul 2>&1
        rmdir /S /Q ".next" >nul 2>&1
    )
)
echo.

REM Thiet lap bien moi truong
echo [3/4] Thiet lap moi truong...
set "NODE_OPTIONS=--max-old-space-size=4096 --no-warnings --no-experimental-fetch"
set "NEXT_TELEMETRY_DISABLED=1"
set "NEXT_SWCMINIFY=false"
set "NODE_ENV=development"
set "CHOKIDAR_USEPOLLING=true"
set "WATCHPACK_POLLING=true"

REM Tao file cau hinh moi truong
(
echo NODE_OPTIONS=--max-old-space-size=4096 --no-warnings --no-experimental-fetch
echo NEXT_TELEMETRY_DISABLED=1
echo NEXT_SWCMINIFY=false
echo NODE_ENV=development
echo CHOKIDAR_USEPOLLING=true
echo WATCHPACK_POLLING=true
) > .env.local

REM Tao file cau hinh npm
(
echo registry=https://registry.npmjs.org/
echo legacy-peer-deps=true
echo fund=false
echo save-exact=true
echo prefer-offline=true
echo cache-min=3600
echo progress=false
) > .npmrc
echo.

REM Khoi dong ung dung
echo [4/4] Sua loi va khoi dong ung dung...
echo.
echo ========================================================
echo     KHOI DONG XLAB WEB
echo     Nhan Ctrl+C de dung lai
echo ========================================================
echo.

REM Chay rieng script sua loi webpack roi khoi dong
node fix-webpack-direct.js && npm run dev:win

echo.
echo ========================================================
echo     UNG DUNG DA DUNG
echo ========================================================
echo.
pause
exit /b 0
