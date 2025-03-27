@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------
echo [Running in Next.js 15.2.4 PRODUCTION mode]

:: Cài đặt mặc định phiên bản Next.js 15.2.4 và luôn dùng production
set NEXT_VERSION_FULL=15.2.4
set RUN_MODE=prod

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
if exist .next rmdir /s /q .next 2>nul
if exist .next-dev rmdir /s /q .next-dev 2>nul
if exist node_modules rmdir /s /q node_modules 2>nul
if exist package-lock.json del /f /q package-lock.json 2>nul
if exist yarn.lock del /f /q yarn.lock 2>nul
if exist .pnpm-store rmdir /s /q .pnpm-store 2>nul
if exist npm-shrinkwrap.json del /f /q npm-shrinkwrap.json 2>nul
if exist .npmrc del /f /q .npmrc 2>nul

:: Bước 4: Tạo .npmrc để tắt warning và thiết lập cài đặt
echo [4/8] Creating .npmrc to suppress deprecation warnings...
echo loglevel=error > .npmrc
echo fund=false >> .npmrc
echo audit=false >> .npmrc
echo update-notifier=false >> .npmrc
echo legacy-peer-deps=true >> .npmrc
echo engine-strict=false >> .npmrc
echo # Force override deprecated packages >> .npmrc
echo # Via resolutions section in package.json >> .npmrc
echo save-exact=true >> .npmrc

:: Bước 5: Cập nhật cấu hình next.config.js
echo [5/8] Configuring Next.js %NEXT_VERSION_FULL%...
findstr /v "scrollRestoration: true," next.config.js > next.config.tmp
echo // scrollRestoration đã là tính năng mặc định trong Next.js 15 >> next.config.tmp
move /y next.config.tmp next.config.js >nul
findstr /v "// ppr: true" next.config.js > next.config.tmp
echo ppr: false, >> next.config.tmp
move /y next.config.tmp next.config.js >nul

:: Bước 6: Cập nhật package.json để ghi đè các package bị deprecated
echo [6/8] Updating package.json to override deprecated packages...

:: Tạo thư mục fonts nếu chưa tồn tại
if not exist public\fonts mkdir public\fonts

:: Thêm phần resolutions vào package.json để ghi đè các package cũ
node -e "const fs = require('fs'); const pkg = require('./package.json'); pkg.resolutions = { ...pkg.resolutions, 'inflight': 'npm:lru-cache@10.2.0', 'glob': '^10.3.10', 'rimraf': '^5.0.10', '@humanwhocodes/config-array': 'npm:@eslint/config-array@2.1.0', '@humanwhocodes/object-schema': 'npm:@eslint/object-schema@2.0.3', 'eslint': '9.0.0-alpha.2' }; fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));"

:: Bước 7: Cài đặt các dependencies
echo [7/8] Installing all dependencies (ignoring deprecation warnings)...

:: Cài đặt Next.js 15.2.4 và dependencies chính
call npm install --no-deprecation --no-audit --quiet

:: Liệt kê tất cả các dependencies
echo [8/8] Listing all dependencies...
call npm ls --depth=0 --no-deprecation --silent

:: Luôn chạy ở chế độ production
echo.
echo Building for production...
call npm run build --no-deprecation --quiet

echo.
echo Starting Next.js %NEXT_VERSION_FULL% production server...
echo [Press Ctrl+C to stop the server]
echo.
call npm start

endlocal 