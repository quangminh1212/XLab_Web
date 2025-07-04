@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Windows Build Script
REM ========================================
REM Script nhanh để build production trên Windows

title XLab Web - Build Production

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    XLab Web - Build                         ║
echo ║                   Production Builder                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

color 0B

echo [INFO] Bắt đầu build production...
echo.

REM Kiểm tra Node.js
echo [INFO] Kiểm tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js chưa được cài đặt!
    pause
    exit /b 1
)

REM Hiển thị thông tin
for /f "tokens=*" %%i in ('node --version') do echo [INFO] Node.js: %%i
for /f "tokens=*" %%i in ('npm --version') do echo [INFO] npm: %%i
echo.

REM Kiểm tra package.json
if not exist "package.json" (
    echo [ERROR] Không tìm thấy package.json!
    pause
    exit /b 1
)

REM Cài đặt dependencies nếu cần
if not exist "node_modules" (
    echo [INFO] Cài đặt dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Lỗi khi cài đặt dependencies!
        pause
        exit /b 1
    )
)

REM Chạy fix scripts
echo [INFO] Chạy fix scripts...
if exist "scripts\fix-next-errors.js" (
    call node scripts\fix-next-errors.js
)

REM Xóa build cũ
echo [INFO] Xóa build cũ...
if exist ".next" (
    rmdir /s /q ".next" 2>nul
    echo [SUCCESS] Đã xóa build cũ
)

REM Build production
echo [INFO] Building production...
echo [INFO] Điều này có thể mất vài phút...
echo.

call npm run build

if errorlevel 1 (
    echo.
    echo [ERROR] Build thất bại!
    echo [INFO] Kiểm tra lỗi ở trên và thử lại.
    pause
    exit /b 1
) else (
    echo.
    echo [SUCCESS] ✅ Build thành công!
    echo.
    echo [INFO] Để chạy production server:
    echo [INFO] npm run start
    echo.
    echo [INFO] Hoặc chạy: start.bat và chọn option 4
)

echo.
echo [INFO] Nhấn phím bất kỳ để thoát...
pause >nul
