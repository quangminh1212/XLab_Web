@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------
echo [Running in Next.js 15.2.4 PRODUCTION mode]

:: Cài đặt mặc định phiên bản Next.js 15.2.4 và luôn dùng production
set NEXT_VERSION_FULL=15.2.4
set RUN_MODE=prod

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
if exist node_modules rmdir /s /q node_modules 2>nul
if exist package-lock.json del /f /q package-lock.json 2>nul
if exist yarn.lock del /f /q yarn.lock 2>nul
if exist .pnpm-store rmdir /s /q .pnpm-store 2>nul

:: Bước 4: Cập nhật cấu hình next.config.js
echo [4/6] Configuring Next.js %NEXT_VERSION_FULL%...
powershell -Command "(Get-Content next.config.js) -replace 'scrollRestoration: true,', '// scrollRestoration đã là tính năng mặc định trong Next.js 15' | Set-Content next.config.js"
powershell -Command "(Get-Content next.config.js) -replace '// ppr: true', 'ppr: false' | Set-Content next.config.js"

:: Bước 5: Cài đặt Next.js và các dependencies không bị lỗi
echo [5/6] Installing Next.js %NEXT_VERSION_FULL% and dependencies...

:: Cài đặt Next.js 15.2.4
npm install next@15.2.4 eslint-config-next@15.2.4 react@18.3.1 react-dom@18.3.1 --save

:: Tạo thư mục fonts nếu chưa tồn tại
if not exist public\fonts mkdir public\fonts

:: Cài đặt các package mới để thay thế các package đã lỗi thời
echo [5.1/6] Fixing deprecated packages...
npm install lru-cache@10.2.0 --save-dev
npm install @eslint/config-array@2.1.0 @eslint/object-schema@2.0.3 --save-dev
npm install rimraf@5.0.10 glob@10.3.10 --save-dev
npm install eslint@9.0.0-alpha.2 --save-dev

:: Cài đặt toàn bộ dependencies
echo [5.2/6] Installing all dependencies...
npm install --legacy-peer-deps

:: Liệt kê tất cả các dependencies
echo [6/6] Listing all dependencies...
npm ls --depth=0

:: Luôn chạy ở chế độ production
echo.
echo Building for production...
npm run build
    
echo.
echo Starting Next.js %NEXT_VERSION_FULL% production server...
echo [Press Ctrl+C to stop the server]
echo.
npm start

endlocal 