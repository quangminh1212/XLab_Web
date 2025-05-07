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

:: Bước 3: Dọn dẹp môi trường và xóa thư mục .next
echo [3/9] Cleaning up environment...
echo Cleaning cache folders...

:: Xóa dấu vết của lần chạy trước
if exist .next\server\pages\_error.js del /f /q .next\server\pages\_error.js 2>nul
if exist .next\server\pages\_document.js del /f /q .next\server\pages\_document.js 2>nul
if exist .next\server\pages\_app.js del /f /q .next\server\pages\_app.js 2>nul
if exist .next\server\pages\webpack-runtime.js del /f /q .next\server\pages\webpack-runtime.js 2>nul

:: Đảm bảo thư mục node_modules tồn tại
if not exist node_modules (
    echo Creating node_modules directory...
    mkdir node_modules
)

:: Đảm bảo thư mục .next tồn tại cho script clean-trace.js
if not exist .next (
    echo Creating .next directory structure...
    mkdir .next
    mkdir .next\server
    mkdir .next\server\pages
    mkdir .next\static
    mkdir .next\static\chunks
    mkdir .next\static\chunks\app
    mkdir .next\static\css
    mkdir .next\static\css\app
    mkdir .next\cache
    mkdir .next\cache\webpack
)

:: Chạy script clean-trace.js để dọn dẹp và khởi tạo thư mục .next
node clean-trace.js

:: Xóa một số thư mục cache bổ sung
if exist node_modules\.cache rmdir /s /q node_modules\.cache 2>nul
if exist .vercel rmdir /s /q .vercel 2>nul
if exist .turbo rmdir /s /q .turbo 2>nul

:: Xóa các file cache TypeScript
if exist *.tsbuildinfo del /f /q *.tsbuildinfo 2>nul

:: Xóa các file cache webpack
if exist .webpack rmdir /s /q .webpack 2>nul

:: Giữ nguyên package-lock.json để tránh cài đặt lại không cần thiết
:: if exist package-lock.json del /f /q package-lock.json 2>nul
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

:: Bước 5: Cài đặt các dependencies nếu cần
echo [5/9] Installing Next.js %NEXT_VERSION_FULL% and dependencies...

:: Kiểm tra Next.js đã cài đặt chưa
if not exist node_modules\next (
    :: Cài đặt Next.js và dependencies chính
    call npm install next@%NEXT_VERSION_FULL% --save-exact --no-fund --no-audit --quiet
) else (
    :: Kiểm tra phiên bản đã có
    for /f "tokens=*" %%i in ('node -e "console.log(require('./node_modules/next/package.json').version)"') do (
        set INSTALLED_VERSION=%%i
    )
    if not "!INSTALLED_VERSION!"=="%NEXT_VERSION_FULL%" (
        call npm install next@%NEXT_VERSION_FULL% --save-exact --no-fund --no-audit --quiet
    ) else (
        echo Next.js %NEXT_VERSION_FULL% already installed.
    )
)

:: Cài đặt các dependencies còn thiếu
call npm install --no-fund --no-audit --quiet

:: Bước 6: Xóa cache của npm
echo [6/9] Clearing npm cache...
call npm cache clean --force >nul 2>&1

:: Bước 7: Kiểm tra cài đặt Next.js
echo [7/9] Verifying Next.js installation...
call npm ls next
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Dependency check returned warnings but continuing...
)

:: Bước 8: Kiểm tra môi trường
echo [8/9] Checking environment...
if not exist node_modules\.bin\next.cmd (
    echo Next.js binary not found
    exit /b 1
)

:: Bước 9: Chạy ứng dụng
echo [9/9] Starting application in %RUN_MODE% mode...

:: Khởi tạo lại thư mục .next sau khi cài đặt để đảm bảo dùng cấu trúc mới nhất
node clean-trace.js

:: Đặt biến môi trường
set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--max-old-space-size=4096

echo Starting Next.js %NEXT_VERSION_FULL% development server...
echo [Press Ctrl+C to stop the server]

:: Chạy ứng dụng với đường dẫn đầy đủ
call node_modules\.bin\next.cmd dev

endlocal 