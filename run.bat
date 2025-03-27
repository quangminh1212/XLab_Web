@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js Startup Tool
echo ------------------------------

:: Xác định phiên bản Next.js
set NEXT_VERSION=14
set /p NEXT_VERSION=Which Next.js version do you want to use? (14/15) [default: 14]: 

if /I "%NEXT_VERSION%"=="15" (
    echo [Running in Next.js 15.2.4 mode]
    set NEXT_VERSION_FULL=15.2.4
) else (
    echo [Running in Next.js 14.2.4 mode]
    set NEXT_VERSION_FULL=14.2.4
)

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
set CLEAN_INSTALL=N
set /p CLEAN_INSTALL=Do you want to do a clean installation? (Y/N) [default: N]: 

:: Bước 4: Dọn dẹp môi trường
echo [3/7] Cleaning up environment...
echo Cleaning cache folders...
if exist .next rmdir /s /q .next 2>nul
if exist .next-dev rmdir /s /q .next-dev 2>nul

if /I "%CLEAN_INSTALL%"=="Y" (
    echo Performing CLEAN installation...
    if exist node_modules rmdir /s /q node_modules 2>nul
    if exist package-lock.json del /f /q package-lock.json 2>nul
    if exist yarn.lock del /f /q yarn.lock 2>nul
    if exist .pnpm-store rmdir /s /q .pnpm-store 2>nul
) else (
    if exist node_modules\.cache rmdir /s /q node_modules\.cache 2>nul
)

:: Bước 5: Kiểm tra cấu hình Next.js
echo [4/7] Verifying Next.js configuration...
if not exist next.config.js (
    echo ERROR: next.config.js not found. Project configuration is missing.
    exit /b 1
)

:: Bước 6: Cập nhật phiên bản Next.js trong package.json và cấu hình
echo [5/7] Configuring Next.js %NEXT_VERSION_FULL%...
if /I "%NEXT_VERSION%"=="15" (
    :: Cập nhật next.config.js cho Next.js 15
    powershell -Command "(Get-Content next.config.js) -replace 'scrollRestoration: true,', '// scrollRestoration đã là tính năng mặc định trong Next.js 15' | Set-Content next.config.js"
    
    :: Cài đặt Next.js 15.2.4
    npm install next@15.2.4 eslint-config-next@15.2.4 --save
) else (
    :: Cập nhật next.config.js cho Next.js 14
    powershell -Command "(Get-Content next.config.js) -replace '// scrollRestoration đã là tính năng mặc định trong Next.js 15', 'scrollRestoration: true,' | Set-Content next.config.js"
    powershell -Command "(Get-Content next.config.js) -replace '// ppr: true, // Chỉ hoạt động với phiên bản canary', '' | Set-Content next.config.js"
    powershell -Command "(Get-Content next.config.js) -replace 'serverActions: {', '// serverActions: {' | Set-Content next.config.js"
    powershell -Command "(Get-Content next.config.js) -replace 'bodySizeLimit: .2mb.,', '// bodySizeLimit: \"2mb\",' | Set-Content next.config.js"
    powershell -Command "(Get-Content next.config.js) -replace '},', '// },' | Set-Content next.config.js"
    
    :: Cài đặt Next.js 14.2.4
    npm install next@14.2.4 eslint-config-next@14.2.4 --save
)

:: Bước 7: Cài đặt dependencies
echo [6/7] Installing dependencies...
if not exist node_modules (
    echo Node modules not found. Installing dependencies...
    npm install
) else (
    if /I "%CLEAN_INSTALL%"=="Y" (
        npm install
    ) else (
        echo Dependencies already installed. Use clean installation option to reinstall.
    )
)

:: Bước 8: Khởi chạy ứng dụng
echo [7/7] Starting Next.js %NEXT_VERSION_FULL% development server...
echo.
echo [Press Ctrl+C to stop the server]
echo.
npm run dev

endlocal 