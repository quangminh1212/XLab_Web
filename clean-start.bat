@echo off
setlocal enabledelayedexpansion

title XLab Web Clean Start
color 0A

echo ========================================================
echo          XLab Web - Clean Start
echo ========================================================
echo.

REM Xác định đường dẫn hiện tại
cd /d "%~dp0"
echo Thư mục hiện tại: %CD%
echo.

REM Dừng các tiến trình Node.js
echo [1/8] Dừng tất cả các tiến trình Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo.

REM Xóa thư mục .next
echo [2/8] Xóa thư mục .next...
if exist ".next" (
    rmdir /S /Q .next 2>nul
)
echo.

REM Xóa thư mục node_modules
echo [3/8] Xóa thư mục node_modules...
if exist "node_modules" (
    rmdir /S /Q node_modules 2>nul
)
echo.

REM Xóa tệp package-lock.json
echo [4/8] Xóa tệp package-lock.json...
if exist "package-lock.json" (
    del /F /Q package-lock.json 2>nul
)
echo.

REM Cài đặt lại các dependencies
echo [5/8] Cài đặt lại các dependencies...
echo registry=https://registry.npmjs.org/ > .npmrc
echo legacy-peer-deps=true >> .npmrc
timeout /t 1 >nul
call npm install --legacy-peer-deps
echo.

REM Kiểm tra cài đặt
echo [6/8] Kiểm tra cài đặt...
if not exist "node_modules" (
    echo FAILED: Cài đặt thất bại!
    echo Thử sửa phiên bản trong package.json và chạy lại.
    goto end
)
echo.

REM Kiểm tra phiên bản Next.js
echo [7/8] Kiểm tra phiên bản Next.js...
call npx next --version
echo.

REM Thiết lập biến môi trường
echo [8/8] Thiết lập biến môi trường...
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