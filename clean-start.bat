@echo off
setlocal enabledelayedexpansion

title XLab Web Clean Start (Next.js 15.2.4)
color 0A

echo ========================================================
echo      XLab Web - Clean Start (Next.js 15.2.4)
echo ========================================================
echo.

REM Xác định đường dẫn hiện tại
cd /d "%~dp0"
echo Thư mục hiện tại: %CD%
echo.

REM Dừng các tiến trình Node.js
echo [1/9] Dừng tất cả các tiến trình Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo.

REM Xóa thư mục .next
echo [2/9] Xóa thư mục .next...
if exist ".next" (
    rmdir /S /Q .next 2>nul
)
echo.

REM Đảm bảo file env được tạo đúng
echo [3/9] Tạo file .env.local...
echo NODE_OPTIONS=--max-old-space-size=4096 > .env.local
echo NEXT_TELEMETRY_DISABLED=1 >> .env.local 
echo NODE_ENV=development >> .env.local
echo.

REM Xóa thư mục node_modules
echo [4/9] Xóa thư mục node_modules...
if exist "node_modules" (
    rmdir /S /Q node_modules 2>nul
)
echo.

REM Xóa tệp package-lock.json
echo [5/9] Xóa tệp package-lock.json...
if exist "package-lock.json" (
    del /F /Q package-lock.json 2>nul
)
echo.

REM Thiết lập .npmrc
echo [6/9] Thiết lập .npmrc...
echo registry=https://registry.npmjs.org/ > .npmrc
echo legacy-peer-deps=true >> .npmrc
echo progress=true >> .npmrc
echo fund=false >> .npmrc
timeout /t 1 >nul
echo.

REM Cài đặt lại các dependencies
echo [7/9] Cài đặt lại các dependencies...
call npm install --legacy-peer-deps
echo.

REM Kiểm tra cài đặt
echo [8/9] Kiểm tra cài đặt...
if not exist "node_modules" (
    echo FAILED: Cài đặt thất bại!
    echo Thử sửa phiên bản trong package.json và chạy lại.
    goto end
)

REM Kiểm tra phiên bản Next.js
echo [9/9] Kiểm tra phiên bản Next.js...
call npx next --version
echo.

REM Thiết lập biến môi trường
echo Thiết lập biến môi trường...
set NODE_OPTIONS=--max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=development
echo.

echo ========================================================
echo       Khởi động ứng dụng...
echo       Có thể truy cập tại http://localhost:3000
echo ========================================================
echo.

REM Khởi động ứng dụng
call npm run dev

:end
echo.
echo ========================================================
echo       Ứng dụng đã dừng
echo ========================================================
pause
endlocal 