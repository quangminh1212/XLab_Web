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
echo [1/11] Dừng tất cả các tiến trình Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo.

REM Xóa cache Next.js
echo [2/11] Xóa thư mục .next...
if exist ".next" (
    rmdir /S /Q .next 2>nul
)
echo.

REM Đảm bảo file env được tạo đúng
echo [3/11] Tạo file .env.local...
echo NODE_OPTIONS=--max-old-space-size=4096 > .env.local
echo NEXT_TELEMETRY_DISABLED=1 >> .env.local 
echo NODE_ENV=development >> .env.local
echo NEXT_DEVELOPMENT_MODE=1 >> .env.local
echo NEXT_WEBPACK_ERROR_HANDLING=1 >> .env.local
echo.

REM Xóa thư mục node_modules
echo [4/11] Xóa thư mục node_modules...
if exist "node_modules" (
    rmdir /S /Q node_modules 2>nul
)
echo.

REM Xóa file cache 
echo [5/11] Xóa các file cache khác...
del /F /Q ".npmrc" 2>nul
del /F /Q ".module-cache" 2>nul
if exist ".next-cache" (
    rmdir /S /Q .next-cache 2>nul
)
echo.

REM Xóa tệp package-lock.json
echo [6/11] Xóa tệp package-lock.json...
if exist "package-lock.json" (
    del /F /Q package-lock.json 2>nul
)
echo.

REM Thiết lập .npmrc
echo [7/11] Thiết lập .npmrc...
echo registry=https://registry.npmjs.org/ > .npmrc
echo legacy-peer-deps=true >> .npmrc
echo progress=true >> .npmrc
echo fund=false >> .npmrc
echo engine-strict=false >> .npmrc
echo ignore-engines=true >> .npmrc
timeout /t 1 >nul
echo.

REM Làm sạch cache npm
echo [8/11] Làm sạch cache npm...
call npm cache clean --force
echo.

REM Cài đặt lại các dependencies
echo [9/11] Cài đặt lại các dependencies...
call npm install --legacy-peer-deps --no-fund
echo.

REM Kiểm tra cài đặt
echo [10/11] Kiểm tra cài đặt...
if not exist "node_modules" (
    echo FAILED: Cài đặt thất bại!
    echo Thử sửa phiên bản trong package.json và chạy lại.
    goto end
)

REM Kiểm tra phiên bản Next.js
echo [11/11] Kiểm tra phiên bản Next.js...
call npx next --version
echo.

REM Thiết lập biến môi trường
echo Thiết lập biến môi trường...
set NODE_OPTIONS=--max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=development
set NEXT_DEVELOPMENT_MODE=1
set NEXT_WEBPACK_ERROR_HANDLING=1
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