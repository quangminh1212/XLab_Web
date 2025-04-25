@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------
echo [Running in Next.js 15.2.4 DEVELOPMENT mode]

:: Cài đặt mặc định phiên bản Next.js 15.2.4 và dùng development
set NEXT_VERSION_FULL=15.2.4
set RUN_MODE=dev

:: Bước 1: Kiểm tra cài đặt Node.js
echo [1/8] Checking Node.js installation...
node -v > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH. Please install Node.js from https://nodejs.org/
    exit /b 1
)
echo Node.js version: 
node -v

:: Bước 2: Dừng tất cả các tiến trình Node đang chạy
echo [2/8] Stopping any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

:: Bước 3: Dọn dẹp môi trường
echo [3/8] Cleaning up environment...
echo Cleaning cache folders...
powershell.exe -Command "Remove-Item -Force -Recurse .next -ErrorAction SilentlyContinue"
powershell.exe -Command "Remove-Item -Force -Recurse .next-dev -ErrorAction SilentlyContinue"
powershell.exe -Command "Remove-Item -Force -Recurse node_modules\.cache -ErrorAction SilentlyContinue"
powershell.exe -Command "Remove-Item -Force -Recurse .vercel -ErrorAction SilentlyContinue"
powershell.exe -Command "Remove-Item -Force -Recurse .turbo -ErrorAction SilentlyContinue"

:: Xóa các file cache TypeScript
powershell.exe -Command "Remove-Item -Force *.tsbuildinfo -ErrorAction SilentlyContinue"

:: Xóa các file cache webpack
powershell.exe -Command "Remove-Item -Force -Recurse .webpack -ErrorAction SilentlyContinue"

:: Bước 4: Xóa các thư mục SWC có vấn đề
echo [4/8] Removing problematic SWC folders...
powershell.exe -Command "Remove-Item -Recurse -Force 'node_modules\next\node_modules\@next\swc-win32-x64-msvc' -ErrorAction SilentlyContinue"

:: Bước 5: Tạo .npmrc để tắt warning và thiết lập cài đặt
echo [5/8] Configuring Next.js %NEXT_VERSION_FULL%...
echo loglevel=error > .npmrc
echo fund=false >> .npmrc
echo audit=false >> .npmrc
echo update-notifier=false >> .npmrc
echo legacy-peer-deps=true >> .npmrc
echo engine-strict=false >> .npmrc
echo save-exact=true >> .npmrc

:: Bước 6: Cài đặt dependencies
echo [6/8] Installing cross-env and dependencies...
call npm install cross-env @babel/core --save-dev --no-fund --no-audit --quiet
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install development dependencies
    exit /b 1
)

call npm install --no-fund --no-audit --quiet
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies
    exit /b 1
)

:: Bước 7: Xóa cache của npm
echo [7/8] Clearing npm cache...
call npm cache clean --force

:: Bước 8: Chạy ứng dụng
echo [8/8] Starting application in %RUN_MODE% mode...
echo Starting Next.js %NEXT_VERSION_FULL% development server...
echo [Press Ctrl+C to stop the server]

:: Đặt biến môi trường
set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--no-experimental-fetch
set WATCHPACK_POLLING=true

:: Chạy ứng dụng với cross-env để đảm bảo biến môi trường được thiết lập đúng
call node_modules\.bin\cross-env.cmd NODE_OPTIONS=--no-experimental-fetch npm run dev

endlocal 