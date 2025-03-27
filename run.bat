@echo off
setlocal enabledelayedexpansion

cd /d %~dp0

:: Kiểm tra tham số dòng lệnh
if "%1"=="clean" goto :clean_install
if "%1"=="--clean" goto :clean_install
if "%1"=="-c" goto :clean_install

:: Nếu không có tham số, hỏi người dùng
if "%1"=="" (
    choice /C NT /M "Bạn có muốn cài đặt mới hoàn toàn (T) hay chạy bình thường (N)?"
    if errorlevel 2 goto :clean_install
)

:normal_start
echo Đang khởi động bình thường...
echo Checking for dependencies...

echo Checking for node version...
node --version

echo Cleaning old cache files...
if exist .next-dev rd /s /q .next-dev
if exist node_modules\.cache rd /s /q node_modules\.cache

IF NOT EXIST node_modules (
    echo Node modules not found. Installing dependencies...
    call npm install --no-fund --loglevel=error --legacy-peer-deps
    echo Installation complete.
) ELSE (
    echo Checking for updates...
    call npm update --no-fund --loglevel=error
)

echo Cleaning Next.js cache...
call npx next clean

goto :start_server

:clean_install
echo ===== CÀI ĐẶT MỚI HOÀN TOÀN =====
echo Cleaning project files for fresh install...

echo Stopping any running Node.js processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Removing old installation files...
if exist .next rd /s /q .next
if exist .next-dev rd /s /q .next-dev
if exist node_modules rd /s /q node_modules
if exist package-lock.json del /f package-lock.json

echo Clearing npm cache...
call npm cache clean --force

echo Installing dependencies...
call npm install --no-fund --legacy-peer-deps

echo Running Next.js setup...
call npx next telemetry disable
call npx next info

echo Installation completed successfully!
echo.

:start_server
echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.
set NODE_OPTIONS=--max-old-space-size=4096
call npm run dev

IF ERRORLEVEL 1 (
    echo Primary method failed, trying alternative method...
    echo Make sure you have Node.js v20+ installed
    node --version
    echo Try running with node directly...
    node node_modules\next\dist\bin\next dev --port 3000 --hostname 0.0.0.0
)

endlocal
exit /b 0 