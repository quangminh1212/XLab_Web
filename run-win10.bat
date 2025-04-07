@echo off
setlocal enabledelayedexpansion

title XLab Web (Windows 10 Special)
color 0A

echo ========================================================
echo      XLab Web - Windows 10 Special Mode
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

REM Xóa cache Next.js
echo [2/9] Xóa thư mục .next...
if exist ".next" (
    echo Đang xóa thư mục .next...
    rmdir /S /Q .next 2>nul

    REM Kiểm tra xem thư mục đã được xóa chưa
    if exist ".next" (
        echo Không thể xóa thư mục .next bằng cách thông thường
        echo Đang dùng phương pháp xóa file cụ thể...
        if exist ".next\trace" (
            del /F /S /Q ".next\trace\*.*" >nul 2>&1
            rmdir /S /Q ".next\trace" >nul 2>&1
        )
        if exist ".next\cache" (
            del /F /S /Q ".next\cache\*.*" >nul 2>&1 
            rmdir /S /Q ".next\cache" >nul 2>&1
        )
        del /F /S /Q ".next\*.*" >nul 2>&1
        rmdir /S /Q ".next" >nul 2>&1
    )
)
echo.

REM Đặt biến môi trường cụ thể cho Windows 10
echo [3/9] Thiết lập biến môi trường cho Windows 10...
set NODE_OPTIONS=--max-old-space-size=4096 --dns-result-order=ipv4first
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=development
echo.

REM Tạo file .env.local tương thích Windows 10
echo [4/9] Tạo file .env.local cho Windows 10...
(
echo NODE_OPTIONS=--max-old-space-size=4096 --dns-result-order=ipv4first
echo NEXT_TELEMETRY_DISABLED=1
echo NODE_ENV=development
echo NEXT_DEVELOPMENT_MODE=1
echo NEXT_WEBPACK_ERROR_HANDLING=1
echo CHOKIDAR_USEPOLLING=true
echo WATCHPACK_POLLING=true
) > .env.local
echo.

REM Tạo npmrc tương thích Windows 10
echo [5/9] Cấu hình npm cho Windows 10...
(
echo registry=https://registry.npmjs.org/
echo legacy-peer-deps=true
echo engine-strict=false
echo fund=false
echo progress=false
echo loglevel=error
echo ignore-scripts=false
echo cache-min=3600
echo prefer-offline=true
) > .npmrc
echo.

REM Tạo thư mục tạm thời nếu không tồn tại
if not exist "tmp" mkdir tmp
set TEMP=%CD%\tmp
set TMP=%CD%\tmp

REM Kiểm tra phiên bản Node.js
echo [6/9] Kiểm tra phiên bản Node.js...
node node-version-check.js
if %ERRORLEVEL% neq 0 (
    echo.
    echo ========================================================
    echo     LỖI: Phiên bản Node.js không tương thích!
    echo     Vui lòng cập nhật Node.js
    echo ========================================================
    echo.
    pause
    exit /b 1
)
echo.

REM Chạy script sửa lỗi Windows
echo [7/9] Chạy script sửa lỗi Windows...
node win-fix.js
echo.

REM Chạy script sửa lỗi toán tử
echo [8/9] Chạy script sửa lỗi toán tử logic...
node fix-operators.js
echo.

echo [9/9] Khởi động ứng dụng với tùy chọn Windows 10...
echo.
echo ========================================================
echo     STARTING XLAB WEB
echo     Press Ctrl+C để dừng lại
echo ========================================================
echo.

REM Khởi động ứng dụng với lệnh win
call npm run win

echo.
echo ========================================================
echo     APPLICATION STOPPED
echo ========================================================
echo.
pause
exit /b 0 