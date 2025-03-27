@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

cd /d "%~dp0"
title XLab_Web - Next.js Dev Server

echo XLab Web - Next.js Startup Tool
echo ------------------------------

:: Kiểm tra tham số
set CLEAN_MODE=0
if "%1"=="clean" set CLEAN_MODE=1
if "%1"=="--clean" set CLEAN_MODE=1
if "%1"=="-c" set CLEAN_MODE=1

if "%1"=="help" goto :show_help
if "%1"=="--help" goto :show_help
if "%1"=="-h" goto :show_help
if "%1"=="/?" goto :show_help

:: Hiển thị chế độ chạy
if %CLEAN_MODE% EQU 1 (
  echo [Running in CLEAN mode]
) else (
  echo [Running in NORMAL mode]
)

:: Kiểm tra Node.js
echo [1/4] Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found! Please install Node.js v20+
    echo Visit https://nodejs.org to download and install
    pause
    exit /b 1
)
node --version | find "v20" >nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Recommended Node.js version is 20.x or higher
) else (
    echo Node.js version: && node --version
)

:: Dừng các quy trình Node.js đang chạy
echo [2/4] Cleaning up environment...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 >nul

:: Dọn dẹp cache
echo Running cleanup...
call npm run clean

:: Nếu chọn chế độ clean, xóa hoàn toàn cài đặt
if %CLEAN_MODE% EQU 1 (
    echo [*] Removing all dependencies for clean install...
    if exist node_modules rd /s /q node_modules >nul 2>&1
    if exist package-lock.json del /f package-lock.json >nul 2>&1
    call npm cache clean --force >nul 2>&1
    timeout /t 2 >nul
)

:: Đảm bảo next.config.js
if not exist next.config.js (
    echo [3/4] Creating default Next.js config...
    (
    echo /** @type {import('next').NextConfig} */
    echo const nextConfig = {
    echo   reactStrictMode: true,
    echo   poweredByHeader: false,
    echo   experimental: {
    echo     scrollRestoration: true,
    echo   },
    echo   webpack: function(config) {
    echo     return config;
    echo   },
    echo   distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
    echo };
    echo.
    echo module.exports = nextConfig;
    ) > next.config.js.txt
    
    :: Copy thay vì tạo trực tiếp để tránh lỗi cú pháp
    copy /Y next.config.js.txt next.config.js >nul
    del next.config.js.txt >nul
)

:: Cài đặt dependencies nếu cần
echo [3/4] Installing dependencies...
if not exist node_modules (
    echo Node modules not found, installing dependencies...
    call npm install --legacy-peer-deps
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
) else (
    if not exist node_modules\next\package.json (
        echo Next.js package not found, reinstalling...
        call npm install next@14.2.4 react@latest react-dom@latest --legacy-peer-deps --force
    )
)

:: Khởi động server
echo [4/4] Starting development server...
echo.
echo Server will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

:: Cấu hình môi trường
set NODE_OPTIONS=--max-old-space-size=4096

:: Sử dụng npm run để khởi động ứng dụng
call npm run dev

goto :eof

:show_help
echo.
echo XLab Web - Helper Script
echo ---------------------
echo.
echo Usage: run.bat [option]
echo.
echo Options:
echo   (no option)  Start normally
echo   clean        Clean and reinstall all dependencies
echo   -c, --clean  Same as clean
echo   -h, --help   Show this help message
echo.
echo Examples:
echo   run.bat            - Normal startup
echo   run.bat clean      - Clean all and reinstall
echo   run.bat --help     - Show this help
echo.
exit /b 0

:eof
endlocal
exit /b 0 