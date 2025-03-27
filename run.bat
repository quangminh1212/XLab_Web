@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------
echo [Running in Next.js 15.2.4 DEVELOPMENT mode]

:: Cài đặt mặc định phiên bản Next.js 15.2.4 và dùng development
set NEXT_VERSION_FULL=15.2.4
set RUN_MODE=dev

:: Bước 1: Kiểm tra cài đặt Node.js
echo [1/6] Checking Node.js installation...
node -v > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH. Please install Node.js from https://nodejs.org/
    exit /b 1
)
echo Node.js version: 
node -v

:: Bước 2: Dừng tất cả các tiến trình Node đang chạy
echo [2/6] Stopping any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

:: Bước 3: Dọn dẹp môi trường
echo [3/6] Cleaning up environment...
echo Cleaning cache folders...
if exist .next rmdir /s /q .next 2>nul
if exist .next-dev rmdir /s /q .next-dev 2>nul
if exist node_modules\.cache rmdir /s /q node_modules\.cache 2>nul
if exist .vercel rmdir /s /q .vercel 2>nul
if exist .turbo rmdir /s /q .turbo 2>nul

:: Xóa các file cache TypeScript
if exist *.tsbuildinfo del /f /q *.tsbuildinfo 2>nul

:: Xóa các file cache webpack
if exist .webpack rmdir /s /q .webpack 2>nul

:: Bước 4: Tạo .npmrc để tắt warning và thiết lập cài đặt
echo [4/6] Configuring Next.js %NEXT_VERSION_FULL%...
echo loglevel=error > .npmrc
echo fund=false >> .npmrc
echo audit=false >> .npmrc
echo update-notifier=false >> .npmrc
echo legacy-peer-deps=true >> .npmrc
echo engine-strict=false >> .npmrc
echo save-exact=true >> .npmrc

:: Bước 5: Cài đặt các dependencies
echo [5/6] Installing Next.js %NEXT_VERSION_FULL% and dependencies...

:: Cài đặt Next.js và dependencies chính (chỉ cài lại nếu không có node_modules)
if not exist node_modules (
  call npm install --no-fund --no-audit --quiet
) else (
  echo Node modules already installed, skipping installation
)

:: Bước 6: Chạy ứng dụng
echo [6/6] Starting application in %RUN_MODE% mode...
echo Starting Next.js %NEXT_VERSION_FULL% development server...
echo [Press Ctrl+C to stop the server]

:: Chạy ứng dụng
call npm run dev

endlocal 