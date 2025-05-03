@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------

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

:: Xóa thư mục .next và các thư mục cache khác
powershell.exe -Command "Remove-Item -Force -Recurse .next -ErrorAction SilentlyContinue"
powershell.exe -Command "Remove-Item -Force -Recurse .next-dev -ErrorAction SilentlyContinue"
powershell.exe -Command "Remove-Item -Force -Recurse node_modules\.cache -ErrorAction SilentlyContinue"
powershell.exe -Command "Remove-Item -Force -Recurse .vercel -ErrorAction SilentlyContinue"
powershell.exe -Command "Remove-Item -Force -Recurse .turbo -ErrorAction SilentlyContinue"

:: Xóa file .babelrc nếu tồn tại
echo Removing .babelrc if it exists...
if exist .babelrc del /f /q .babelrc >nul 2>&1

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
echo [6/8] Installing dependencies...
call npm install cross-env undici@5.28.3 --save --no-fund --no-audit --quiet
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies
    exit /b 1
)

:: Cài đặt SWC dependencies
echo Installing SWC binary for Windows...
call npm install --save-dev @next/swc-win32-x64-msvc@%NEXT_VERSION_FULL% --no-fund --no-audit --quiet
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install SWC binary, but continuing...
)

:: Patch Next.js
echo Running Next.js patch for Node.js v20...
node manual-patch.js

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
set NODE_OPTIONS=--require ./src/lib/fetch-polyfill.js --no-experimental-fetch --no-warnings
set FAST_REFRESH=false
set WATCHPACK_POLLING=true
set CHOKIDAR_USEPOLLING=1

:: Chạy ứng dụng với cross-env để đảm bảo biến môi trường được thiết lập đúng
call node_modules\.bin\cross-env.cmd FAST_REFRESH=false NODE_OPTIONS="--require ./src/lib/fetch-polyfill.js --no-experimental-fetch --no-warnings" npm run dev

endlocal 