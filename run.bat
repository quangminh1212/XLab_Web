@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js Startup Tool
echo ------------------------------
echo [Running in Next.js 14.2.4 mode]

:: Cài đặt mặc định phiên bản Next.js 14.2.4 (ổn định hơn)
set NEXT_VERSION=14
set NEXT_VERSION_FULL=14.2.4

:: Bước 1: Kiểm tra cài đặt Node.js
echo [1/7] Checking Node.js installation...
node -v > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH. Please install Node.js from https://nodejs.org/
    exit /b 1
)
echo Node.js version: 
node -v

:: Bước 2: Dừng tất cả các tiến trình Node đang chạy
echo [2/7] Stopping any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

:: Bước 3: Xác định chế độ chạy (clean hoặc normal)
set CLEAN_INSTALL=Y
echo [3/7] Performing CLEAN installation to ensure compatibility...

:: Bước 4: Dọn dẹp môi trường
echo Cleaning cache folders...
if exist .next rmdir /s /q .next 2>nul
if exist .next-dev rmdir /s /q .next-dev 2>nul
if exist node_modules rmdir /s /q node_modules 2>nul
if exist package-lock.json del /f /q package-lock.json 2>nul
if exist yarn.lock del /f /q yarn.lock 2>nul
if exist .pnpm-store rmdir /s /q .pnpm-store 2>nul

:: Bước 5: Cập nhật Next.js trong package.json và cấu hình
echo [4/7] Configuring Next.js %NEXT_VERSION_FULL%...

:: Sửa lỗi trong tệp cấu hình next.config.js
powershell -Command "(Get-Content next.config.js) -replace '// scrollRestoration đã là tính năng mặc định trong Next.js 15', 'scrollRestoration: true,' | Set-Content next.config.js"
powershell -Command "(Get-Content next.config.js) -replace '// ppr: true, // Chỉ hoạt động với phiên bản canary', '' | Set-Content next.config.js"
powershell -Command "(Get-Content next.config.js) -replace 'serverActions: {', '// serverActions: {' | Set-Content next.config.js"
powershell -Command "(Get-Content next.config.js) -replace 'bodySizeLimit: .2mb.,', '// bodySizeLimit: \"2mb\",' | Set-Content next.config.js"
powershell -Command "(Get-Content next.config.js) -replace '},', '// },' | Set-Content next.config.js"

:: Bước 6: Cài đặt Next.js và các dependencies cập nhật
echo [5/7] Installing Next.js %NEXT_VERSION_FULL% and dependencies...
:: Cài đặt next @14.2.4 là phiên bản ổn định
npm install next@14.2.4 eslint-config-next@14.2.4 --save

:: Cài đặt các dependencies đã cập nhật để tránh warning
echo [6/7] Updating dependencies to fix warnings...
:: Cập nhật các package đã deprecated
npm install rimraf@5.0.10 glob@10.3.10 eslint@9.0.0-alpha.2 lru-cache@10.2.0 @eslint/config-array@2.1.0 @eslint/object-schema@2.0.3 --save-dev

:: Tạo thư mục fonts nếu chưa tồn tại
if not exist public\fonts mkdir public\fonts

:: Cài đặt toàn bộ dependencies
npm install

:: Liệt kê tất cả các dependencies
echo [7/7] Listing all dependencies (npm ls)...
npm ls --depth=0

:: Khởi chạy ứng dụng
echo.
echo Starting Next.js %NEXT_VERSION_FULL% development server...
echo [Press Ctrl+C to stop the server]
echo.
npm run dev

endlocal 