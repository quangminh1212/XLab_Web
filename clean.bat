@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Windows Clean Script
REM ========================================
REM Script de don dep cache va files tam

title XLab Web - Clean Cache

echo.
echo ================================================================
echo                    XLab Web - Clean
echo                   Cache Cleaner
echo ================================================================
echo.

color 0E

echo [INFO] Bat dau don dep cache...
echo.

REM Xoa .next directory
if exist ".next" (
    echo [INFO] Xoa .next directory...
    rmdir /s /q ".next" 2>nul
    echo [SUCCESS] Da xoa .next
) else (
    echo [INFO] .next directory khong ton tai
)

REM Xoa node_modules cache
if exist "node_modules\.cache" (
    echo [INFO] Xoa node_modules cache...
    rmdir /s /q "node_modules\.cache" 2>nul
    echo [SUCCESS] Da xoa node_modules cache
)

REM Xoa npm cache
echo [INFO] Xoa npm cache...
call npm cache clean --force >nul 2>&1
echo [SUCCESS] Da xoa npm cache

REM Xoa TypeScript cache
if exist "*.tsbuildinfo" (
    echo [INFO] Xoa TypeScript cache...
    del "*.tsbuildinfo" /q 2>nul
    echo [SUCCESS] Da xoa TypeScript cache
)

REM Xoa ESLint cache
if exist ".eslintcache" (
    echo [INFO] Xoa ESLint cache...
    del ".eslintcache" /q 2>nul
    echo [SUCCESS] Da xoa ESLint cache
)

REM Xoa logs
if exist "*.log" (
    echo [INFO] Xoa log files...
    del "*.log" /q 2>nul
    echo [SUCCESS] Da xoa log files
)

REM Xoa temp files
if exist "*.tmp" (
    echo [INFO] Xoa temp files...
    del "*.tmp" /q 2>nul
    echo [SUCCESS] Da xoa temp files
)

echo.
echo [SUCCESS] Don dep hoan tat!
echo.
echo [INFO] Cac thu muc/files da duoc don dep:
echo [INFO] - .next directory
echo [INFO] - node_modules cache
echo [INFO] - npm cache
echo [INFO] - TypeScript cache
echo [INFO] - ESLint cache
echo [INFO] - Log files
echo [INFO] - Temp files
echo.
echo [INFO] De cai dat lai dependencies: npm install
echo [INFO] De build lai: npm run build

echo.
echo [INFO] Nhan phim bat ky de thoat...
pause >nul
