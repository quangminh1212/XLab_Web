@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------
echo [Running in Next.js 15.2.4 PRODUCTION mode]

:: Cài đặt mặc định phiên bản Next.js 15.2.4 và luôn dùng production
set NEXT_VERSION_FULL=15.2.4
set RUN_MODE=prod

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

:: Bước 3: Dọn dẹp môi trường
echo [3/7] Cleaning up environment...
echo Cleaning cache folders...
if exist .next rmdir /s /q .next 2>nul
if exist .next-dev rmdir /s /q .next-dev 2>nul
if exist node_modules rmdir /s /q node_modules 2>nul
if exist package-lock.json del /f /q package-lock.json 2>nul
if exist yarn.lock del /f /q yarn.lock 2>nul
if exist .pnpm-store rmdir /s /q .pnpm-store 2>nul

:: Bước 4: Cập nhật cấu hình next.config.js
echo [4/7] Configuring Next.js %NEXT_VERSION_FULL%...
cmd /c "findstr /v "scrollRestoration: true," next.config.js > next.config.tmp"
cmd /c "echo // scrollRestoration đã là tính năng mặc định trong Next.js 15 >> next.config.tmp"
cmd /c "move /y next.config.tmp next.config.js"
cmd /c "findstr /v "// ppr: true" next.config.js > next.config.tmp"
cmd /c "echo ppr: false, >> next.config.tmp"
cmd /c "move /y next.config.tmp next.config.js"

:: Bước 5: Cài đặt các package thay thế trước để loại bỏ warning
echo [5/7] Pre-installing replacement packages to fix warnings...
echo Installing modern versions of dependencies to replace deprecated ones...

:: Tạo thư mục fonts nếu chưa tồn tại
if not exist public\fonts mkdir public\fonts

:: Cài đặt các thư viện mới nhất để thay thế các thư viện đã lỗi thời
call npm install --no-save --save-exact lru-cache@10.2.0 @eslint/config-array@2.1.0 @eslint/object-schema@2.0.3 rimraf@5.0.10 glob@10.3.10

:: Bước 6: Cài đặt Next.js và các dependencies không bị lỗi
echo [6/7] Installing Next.js %NEXT_VERSION_FULL% and dependencies...

:: Cài đặt Next.js 15.2.4 với --force để ghi đè các dependencies
call npm install next@15.2.4 eslint-config-next@15.2.4 react@18.3.1 react-dom@18.3.1 --save --force

:: Cài đặt eslint phiên bản mới
call npm install eslint@9.0.0-alpha.2 --save-dev --force

:: Cài đặt toàn bộ dependencies và ghi đè các package đã lỗi thời
echo [6.1/7] Installing all dependencies with legacy peer deps...
call npm install --legacy-peer-deps

:: Liệt kê tất cả các dependencies
echo [7/7] Listing all dependencies...
call npm ls --depth=0

:: Luôn chạy ở chế độ production
echo.
echo Building for production...
call npm run build
    
echo.
echo Starting Next.js %NEXT_VERSION_FULL% production server...
echo [Press Ctrl+C to stop the server]
echo.
call npm start

endlocal 