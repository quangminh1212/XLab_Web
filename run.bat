@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

cd /d "%~dp0"
title XLab_Web - Next.js Dev Server

echo XLab Web - Next.js Startup Tool
echo ------------------------------

:: Kiểm tra tham số help
if "%1"=="help" goto :show_help
if "%1"=="--help" goto :show_help
if "%1"=="-h" goto :show_help
if "%1"=="/?" goto :show_help

:: Kiểm tra tham số
set CLEAN_MODE=0
if "%1"=="clean" set CLEAN_MODE=1
if "%1"=="--clean" set CLEAN_MODE=1
if "%1"=="-c" set CLEAN_MODE=1
if "%1"=="-r" set CLEAN_MODE=1
if "%1"=="reset" set CLEAN_MODE=1

:: Không hỏi nữa - chạy tự động theo chế độ đã định
echo [Mode: %CLEAN_MODE%] - 0=Normal, 1=Clean Install

:: Kiểm tra Node.js
echo [1/5] Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found! Please install Node.js v20+
    echo Visit https://nodejs.org to download and install
    pause
    exit /b 1
)

:: Hiển thị phiên bản Node.js
node --version | find "v20" >nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Recommended Node.js version is 20.x or higher
) else (
    echo Node.js version: && node --version
)

:: Kiểm tra và xử lý dọn dẹp nếu cần
echo [2/5] Cleaning previous builds and caches...

:: Dừng các quy trình Node.js đang chạy
taskkill /F /IM node.exe /T >nul 2>&1

:: Xóa các tệp cache
if exist .next rd /s /q .next >nul 2>&1
if exist .next-dev rd /s /q .next-dev >nul 2>&1
if exist node_modules\.cache rd /s /q node_modules\.cache >nul 2>&1

:: Nếu chọn chế độ clean, xóa hoàn toàn cài đặt
if %CLEAN_MODE% EQU 1 (
    echo [*] CLEAN MODE: Removing all dependencies and reinstalling...
    if exist node_modules rd /s /q node_modules >nul 2>&1
    if exist package-lock.json del /f package-lock.json >nul 2>&1
    call npm cache clean --force >nul 2>&1
    echo [*] All dependencies removed successfully.
)

:: Kiểm tra node_modules
echo [3/5] Verifying dependencies...
if not exist node_modules (
    echo Node modules not found, installing dependencies...
    call npm install --no-fund --legacy-peer-deps
    
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    
    echo Dependencies installed successfully
) else (
    :: Kiểm tra xem next có tồn tại không
    if not exist node_modules\next\dist\bin\next.js (
        echo Next.js modules incomplete, reinstalling...
        if exist package-lock.json del /f package-lock.json >nul 2>&1
        call npm install next@14.2.4 react@latest react-dom@latest --no-fund --legacy-peer-deps
        
        if %ERRORLEVEL% NEQ 0 (
            echo ERROR: Failed to install Next.js!
            pause
            exit /b 1
        )
    )
)

:: Tắt telemetry
echo [4/5] Configuring Next.js...
call npx next telemetry disable >nul 2>&1

:: Kiểm tra cấu hình next.config.js
echo [+] Validating Next.js configuration...
if not exist next.config.js (
    echo WARNING: next.config.js not found!
) else (
    :: Lấy kích thước file
    for %%A in (next.config.js) do set filesize=%%~zA
    if !filesize! LEQ 100 (
        echo ERROR: next.config.js appears to be corrupted or empty
        echo Creating backup and generating default config...
        if exist next.config.js ren next.config.js next.config.js.bak
        (
            echo /** @type {import('next').NextConfig} */
            echo const nextConfig = {
            echo   reactStrictMode: true,
            echo   poweredByHeader: false,
            echo   experimental: {
            echo     scrollRestoration: true,
            echo   },
            echo   webpack: (config^) =^> {
            echo     return config;
            echo   },
            echo   distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
            echo };
            echo. 
            echo module.exports = nextConfig;
        ) > next.config.js
        echo Default configuration created!
    )
)

:: Cấu hình môi trường
echo [5/5] Starting development server...
set NODE_OPTIONS=--max-old-space-size=4096

:: Khởi động server
echo.
echo Starting Next.js development server...
echo Server will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

:: Sử dụng node trực tiếp để tránh các lỗi với npm scripts
node node_modules\next\dist\bin\next dev --port 3000

goto :eof

:show_help
echo.
echo XLab Web - Helper Script
echo ---------------------
echo.
echo Usage: run.bat [option]
echo.
echo Options:
echo   (no option)  Start normally without asking
echo   clean        Clean and reinstall all dependencies
echo   -c, --clean  Same as clean
echo   -r, reset    Reset and reinstall
echo   -h, --help   Show this help message
echo.
echo Examples:
echo   run.bat            - Normal startup (no questions)
echo   run.bat clean      - Clean all and reinstall
echo   run.bat --help     - Show this help
echo.
exit /b 0

:eof
endlocal
exit /b 0 