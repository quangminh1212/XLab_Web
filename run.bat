@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------
echo [Running in Next.js 15.2.4 mode]

:: Cài đặt mặc định phiên bản Next.js 15.2.4
set NEXT_VERSION=15
set NEXT_VERSION_FULL=15.2.4

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

:: Bước 3: Xác định chế độ chạy (clean hoặc normal)
set CLEAN_INSTALL=Y
echo [3/6] Performing CLEAN installation to ensure compatibility...

:: Bước 4: Dọn dẹp môi trường
echo Cleaning cache folders...
if exist .next rmdir /s /q .next 2>nul
if exist .next-dev rmdir /s /q .next-dev 2>nul
if exist node_modules rmdir /s /q node_modules 2>nul
if exist package-lock.json del /f /q package-lock.json 2>nul
if exist yarn.lock del /f /q yarn.lock 2>nul
if exist .pnpm-store rmdir /s /q .pnpm-store 2>nul

:: Bước 5: Cập nhật Next.js 15 trong package.json và cấu hình
echo [4/6] Configuring Next.js %NEXT_VERSION_FULL%...

:: Sửa lỗi trong tệp cấu hình next.config.js
powershell -Command "(Get-Content next.config.js) -replace 'scrollRestoration: true,', '// scrollRestoration đã là tính năng mặc định trong Next.js 15' | Set-Content next.config.js"
powershell -Command "(Get-Content next.config.js) -replace 'ppr: true', '// ppr: true' | Set-Content next.config.js"

:: Cài đặt Next.js 15.2.4 và các dependencies
echo [5/6] Installing dependencies...
npm install next@15.2.4 eslint-config-next@15.2.4 react@18.3.1 react-dom@18.3.1 --save
npm install

:: Tạo thư mục fonts nếu chưa tồn tại
if not exist public\fonts mkdir public\fonts

:: Bước 6: Khởi chạy ứng dụng
echo [6/6] Starting Next.js %NEXT_VERSION_FULL% development server...
echo.
echo [Press Ctrl+C to stop the server]
echo.
npm run dev

endlocal 