@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js Startup Tool
echo ------------------------------
echo [Running in NORMAL mode]

:: Bước 1: Kiểm tra cài đặt Node.js
echo [1/4] Checking Node.js installation...
node -v > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH. Please install Node.js from https://nodejs.org/
    exit /b 1
)
echo Node.js version: 
node -v

:: Bước 2: Dọn dẹp môi trường
echo [2/4] Cleaning up environment...
echo Cleaning cache folders...
if exist .next rd /s /q .next
if exist .next-dev rd /s /q .next-dev
if exist node_modules\.cache rd /s /q node_modules\.cache

:: Bước 3: Kiểm tra cấu hình Next.js
echo [3/4] Verifying Next.js configuration...
if not exist next.config.js (
    echo ERROR: next.config.js not found. Project configuration is missing.
    exit /b 1
)

:: Bước 4: Cài đặt dependencies nếu cần
echo [4/4] Installing dependencies...
if not exist node_modules (
    echo Node modules not found. Installing dependencies...
    npm install
) else (
    echo Dependencies already installed. Use 'npm install' to update if needed.
)

:: Khởi chạy ứng dụng
echo.
echo Starting Next.js development server...
echo [Press Ctrl+C to stop the server]
echo.
npm run dev

endlocal 