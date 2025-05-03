@echo off
setlocal enabledelayedexpansion

echo XLab Web - Next.js 15.2.4 Startup Tool
echo ------------------------------

:: Dừng tất cả các tiến trình Node đang chạy
echo Stopping any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

:: Xóa thư mục .next
echo Cleaning .next directory...
if exist .next rmdir /s /q .next 2>nul

:: Xóa file .babelrc nếu tồn tại
echo Removing .babelrc if it exists...
if exist .babelrc del /f /q .babelrc >nul 2>&1

:: Đặt biến môi trường
set NODE_ENV=development
set NEXT_TELEMETRY_DISABLED=1

:: Chạy ứng dụng Next.js
echo Starting Next.js 15.2.4 development server...
echo [Press Ctrl+C to stop the server]

:: Chạy ứng dụng với npx
npx next dev

endlocal 