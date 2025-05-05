@echo off
echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------

:: Đường dẫn cài đặt Node.js và Npm
set NODE_PATH=node

:: Phát hiện chế độ chạy ứng dụng
if "%1"=="prod" (
  set MODE=production
  echo [Running in Next.js 15.2.4 PRODUCTION mode]
) else (
  set MODE=development
  echo [Running in Next.js 15.2.4 DEVELOPMENT mode]
)

echo [1/9] Checking Node.js installation...
%NODE_PATH% --version
if %ERRORLEVEL% NEQ 0 (
  echo Error: Node.js is not installed or not in PATH
  exit /b 1
)
echo Node.js version: 
%NODE_PATH% --version

echo [2/9] Stopping any running Node.js processes...
taskkill /f /im node.exe >NUL 2>&1
echo Waiting for processes to terminate...
timeout /t 2 >NUL

echo [3/9] Cleaning up environment...
echo Cleaning cache folders...
rmdir /s /q .next\cache 2>NUL
rmdir /s /q node_modules\.cache 2>NUL

echo Removing trace directory...
rmdir /s /q .next\trace 2>NUL

echo [4/9] Configuring Next.js 15.2.4...
:: Không cần thực hiện các thay đổi cấu hình

echo [5/9] Installing Next.js 15.2.4 and dependencies...
npm ci --no-audit --prefer-offline

echo [6/9] Clearing npm cache...
npm cache verify --silent

echo [7/9] Verifying Next.js installation...
npm list next

echo [8/9] Checking environment...

:: Đảm bảo các thư mục tĩnh cần thiết tồn tại
mkdir .next\static\chunks\app 2>NUL
mkdir .next\static\css\app 2>NUL
mkdir .next\server 2>NUL

:: Tạo các tệp tĩnh cần thiết
echo // Placeholder > .next\static\chunks\app\not-found.js
echo // Placeholder > .next\static\chunks\app\layout.js
echo // Placeholder > .next\static\chunks\app\loading.js
echo // Placeholder > .next\static\chunks\app-pages-internals.js
echo /* Placeholder */ > .next\static\css\app\layout.css

:: Tạo các tệp manifest
echo {"pages":{},"app":{},"appUsingSizeAdjust":false,"pagesUsingSizeAdjust":false} > .next\server\next-font-manifest.json
echo {"sortedMiddleware":[],"middleware":{},"functions":{},"version":2} > .next\server\middleware-manifest.json
echo {"pages":{},"app":{}} > .next\server\font-manifest.json

echo [9/9] Starting application in %MODE% mode...
echo Starting Next.js 15.2.4 %MODE% server...
echo [Press Ctrl+C to stop the server]

if "%MODE%"=="production" (
  npm run start
) else (
  npm run dev
) 