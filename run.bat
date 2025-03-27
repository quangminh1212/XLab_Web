@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------
echo [Running in NORMAL mode]

:: Bước 1: Kiểm tra cài đặt Node.js
echo [1/5] Checking Node.js installation...
node -v > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH. Please install Node.js from https://nodejs.org/
    exit /b 1
)
echo Node.js version: 
node -v

:: Bước 2: Dừng tất cả các tiến trình Node đang chạy
echo [2/5] Stopping any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

:: Bước 3: Dọn dẹp môi trường
echo [3/5] Cleaning up environment...
echo Cleaning cache folders...
if exist .next rmdir /s /q .next 2>nul
if exist .next-dev rmdir /s /q .next-dev 2>nul
if exist node_modules\.cache rmdir /s /q node_modules\.cache 2>nul

:: Bước 4: Kiểm tra cấu hình Next.js
echo [4/5] Verifying Next.js configuration...
if not exist next.config.js (
    echo ERROR: next.config.js not found. Project configuration is missing.
    exit /b 1
)

:: Bước 5: Cài đặt dependencies nếu cần
echo [5/5] Checking dependencies...
if not exist node_modules (
    echo Node modules not found. Installing dependencies...
    npm install
) else (
    echo Dependencies already installed. Use 'npm install' to update if needed.
)

:: Khởi chạy ứng dụng
echo.
echo Starting Next.js 15.2.4 development server...
echo [Press Ctrl+C to stop the server]
echo.
npm run dev

endlocal 