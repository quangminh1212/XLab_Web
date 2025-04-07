@echo off
rem Khong su dung tieng Viet co dau trong file .bat
setlocal enabledelayedexpansion

title XLab Web - Launcher
color 0A

echo ========================================================
echo     XLab Web - Launcher
echo ========================================================
echo.

REM Xác định đường dẫn hiện tại
cd /d "%~dp0"
echo Thư mục hiện tại: %CD%
echo.

REM Dừng các tiến trình Node.js
echo [1/5] Dừng tất cả các tiến trình Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 >nul
echo.

REM Xóa cache Next.js
echo [2/5] Xóa thư mục .next...
if exist ".next" (
    echo Đang xóa thư mục .next...
    rmdir /S /Q .next 2>nul
    if exist ".next" (
        del /F /S /Q ".next\*.*" >nul 2>&1
        rmdir /S /Q ".next" >nul 2>&1
    )
)
echo.

REM Đặt biến môi trường cụ thể cho Node.js và Next.js
echo [3/5] Thiết lập biến môi trường...
set "NODE_OPTIONS=--max-old-space-size=4096 --no-warnings --no-experimental-fetch"
set "NEXT_TELEMETRY_DISABLED=1"
set "NEXT_SWCMINIFY=false"
set "NODE_ENV=development"
set "CHOKIDAR_USEPOLLING=true"
set "WATCHPACK_POLLING=true"
echo.

REM Tạo file cấu hình môi trường
echo [4/5] Tạo file cấu hình...
(
echo NODE_OPTIONS=--max-old-space-size=4096 --no-warnings --no-experimental-fetch
echo NEXT_TELEMETRY_DISABLED=1
echo NEXT_SWCMINIFY=false
echo NODE_ENV=development
echo CHOKIDAR_USEPOLLING=true
echo WATCHPACK_POLLING=true
) > .env.local

REM Đặt cấu hình npm
(
echo registry=https://registry.npmjs.org/
echo legacy-peer-deps=true
echo fund=false
) > .npmrc
echo.

REM Sửa lỗi webpack trực tiếp
echo [5/5] Sửa lỗi Webpack...

REM Chạy script sửa lỗi webpack
if exist "fix-webpack-direct.js" (
    node fix-webpack-direct.js
) else (
    echo ⚠️ Không tìm thấy file fix-webpack-direct.js
)

echo.
echo ========================================================
echo     KHỞI ĐỘNG XLAB WEB
echo     Nhấn Ctrl+C để dừng lại
echo ========================================================
echo.

REM Khởi động dự án
call npm run dev

echo.
echo ========================================================
echo     ỨNG DỤNG ĐÃ DỪNG
echo ========================================================
echo.
pause
exit /b 0
