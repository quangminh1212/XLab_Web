@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Windows Clean Script
REM ========================================
REM Script để dọn dẹp cache và files tạm

title XLab Web - Clean Cache

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    XLab Web - Clean                         ║
echo ║                   Cache Cleaner                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

color 0E

echo [INFO] Bắt đầu dọn dẹp cache...
echo.

REM Xóa .next directory
if exist ".next" (
    echo [INFO] Xóa .next directory...
    rmdir /s /q ".next" 2>nul
    echo [SUCCESS] ✅ Đã xóa .next
) else (
    echo [INFO] .next directory không tồn tại
)

REM Xóa node_modules cache
if exist "node_modules\.cache" (
    echo [INFO] Xóa node_modules cache...
    rmdir /s /q "node_modules\.cache" 2>nul
    echo [SUCCESS] ✅ Đã xóa node_modules cache
)

REM Xóa npm cache
echo [INFO] Xóa npm cache...
call npm cache clean --force >nul 2>&1
echo [SUCCESS] ✅ Đã xóa npm cache

REM Xóa TypeScript cache
if exist "*.tsbuildinfo" (
    echo [INFO] Xóa TypeScript cache...
    del "*.tsbuildinfo" /q 2>nul
    echo [SUCCESS] ✅ Đã xóa TypeScript cache
)

REM Xóa ESLint cache
if exist ".eslintcache" (
    echo [INFO] Xóa ESLint cache...
    del ".eslintcache" /q 2>nul
    echo [SUCCESS] ✅ Đã xóa ESLint cache
)

REM Xóa logs
if exist "*.log" (
    echo [INFO] Xóa log files...
    del "*.log" /q 2>nul
    echo [SUCCESS] ✅ Đã xóa log files
)

REM Xóa temp files
if exist "*.tmp" (
    echo [INFO] Xóa temp files...
    del "*.tmp" /q 2>nul
    echo [SUCCESS] ✅ Đã xóa temp files
)

echo.
echo [SUCCESS] 🎉 Dọn dẹp hoàn tất!
echo.
echo [INFO] Các thư mục/files đã được dọn dẹp:
echo [INFO] - .next directory
echo [INFO] - node_modules cache
echo [INFO] - npm cache
echo [INFO] - TypeScript cache
echo [INFO] - ESLint cache
echo [INFO] - Log files
echo [INFO] - Temp files
echo.
echo [INFO] Để cài đặt lại dependencies: npm install
echo [INFO] Để build lại: npm run build

echo.
echo [INFO] Nhấn phím bất kỳ để thoát...
pause >nul
