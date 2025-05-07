@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------
echo [Running in Next.js 15.2.4 DEVELOPMENT mode]

:: Cài đặt mặc định phiên bản Next.js 15.2.4 và dùng development
set NEXT_VERSION_FULL=15.2.4
set RUN_MODE=dev

:: Bước 1: Kiểm tra cài đặt Node.js
echo [1/9] Checking Node.js installation...
node -v > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH. Please install Node.js from https://nodejs.org/
    exit /b 1
)
echo Node.js version: 
node -v

:: Bước 2: Dừng tất cả các tiến trình Node đang chạy
echo [2/9] Stopping any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

:: Bước 3: Dọn dẹp môi trường
echo [3/9] Cleaning up environment...
echo Cleaning cache folders...

:: Chạy script clean-trace.js để dọn dẹp thư mục .next
node clean-trace.js

:: Xóa một số thư mục cache bổ sung
if exist node_modules\.cache rmdir /s /q node_modules\.cache 2>nul
if exist .vercel rmdir /s /q .vercel 2>nul
if exist .turbo rmdir /s /q .turbo 2>nul

:: Xóa các file cache TypeScript
if exist *.tsbuildinfo del /f /q *.tsbuildinfo 2>nul

:: Xóa các file cache webpack
if exist .webpack rmdir /s /q .webpack 2>nul

:: Xóa các file lock
if exist package-lock.json del /f /q package-lock.json 2>nul
if exist yarn.lock del /f /q yarn.lock 2>nul
if exist pnpm-lock.yaml del /f /q pnpm-lock.yaml 2>nul

:: Bước 4: Tạo .npmrc để tắt warning và thiết lập cài đặt
echo [4/9] Configuring Next.js %NEXT_VERSION_FULL%...
echo loglevel=error > .npmrc
echo fund=false >> .npmrc
echo audit=false >> .npmrc
echo update-notifier=false >> .npmrc
echo legacy-peer-deps=true >> .npmrc
echo engine-strict=false >> .npmrc
echo save-exact=true >> .npmrc

:: Bước 5: Cài đặt các dependencies
echo [5/9] Installing Next.js %NEXT_VERSION_FULL% and dependencies...

:: Cài đặt Next.js và dependencies chính
call npm install next@%NEXT_VERSION_FULL% --save-exact --no-fund --no-audit --quiet
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install Next.js
    exit /b 1
)

call npm install --no-fund --no-audit --quiet
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies
    exit /b 1
)

:: Bước 6: Xóa cache của npm
echo [6/9] Clearing npm cache...
call npm cache clean --force

:: Bước 7: Kiểm tra cài đặt Next.js
echo [7/9] Verifying Next.js installation...
call npm ls next
if %ERRORLEVEL% NEQ 0 (
    echo Failed to verify Next.js installation
    exit /b 1
)

:: Bước 8: Kiểm tra môi trường
echo [8/9] Checking environment...
if not exist node_modules\.bin\next.cmd (
    echo Next.js binary not found
    exit /b 1
)

:: Bước 9: Chuẩn bị thư mục .next
echo [9/9] Starting application in %RUN_MODE% mode...

:: Tạo các thư mục cần thiết cho Next.js
if not exist .next\server mkdir .next\server
if not exist .next\static mkdir .next\static
if not exist .next\cache mkdir .next\cache

:: Tạo font manifest file để khắc phục lỗi
echo {} > .next\server\next-font-manifest.json

echo Starting Next.js %NEXT_VERSION_FULL% development server...
echo [Press Ctrl+C to stop the server]

:: Đặt biến môi trường
set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1

:: Chạy ứng dụng với đường dẫn đầy đủ
call node_modules\.bin\next.cmd dev

endlocal 