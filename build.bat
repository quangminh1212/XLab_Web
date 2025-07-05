@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Windows Build Script
REM ========================================
REM Script nhanh de build production tren Windows

title XLab Web - Build Production

echo.
echo ================================================================
echo                    XLab Web - Build
echo                   Production Builder
echo ================================================================
echo.

color 0B

echo [INFO] Bat dau build production...
echo.

REM Kiem tra Node.js
echo [INFO] Kiem tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js chua duoc cai dat!
    pause
    exit /b 1
)

REM Hien thi thong tin
for /f "tokens=*" %%i in ('node --version') do echo [INFO] Node.js: %%i
for /f "tokens=*" %%i in ('npm --version') do echo [INFO] npm: %%i
echo.

REM Kiem tra package.json
if not exist "package.json" (
    echo [ERROR] Khong tim thay package.json!
    pause
    exit /b 1
)

REM Cai dat dependencies neu can
if not exist "node_modules" (
    echo [INFO] Cai dat dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Loi khi cai dat dependencies!
        pause
        exit /b 1
    )
)

REM Chay fix scripts
echo [INFO] Chay fix scripts...
if exist "scripts\fix-next-errors.js" (
    call node scripts\fix-next-errors.js
)

REM Xoa build cu
echo [INFO] Xoa build cu...
if exist ".next" (
    rmdir /s /q ".next" 2>nul
    echo [SUCCESS] Da xoa build cu
)

REM Build production
echo [INFO] Building production...
echo [INFO] Dieu nay co the mat vai phut...
echo.

call npm run build

if errorlevel 1 (
    echo.
    echo [ERROR] Build that bai!
    echo [INFO] Kiem tra loi o tren va thu lai.
    pause
    exit /b 1
) else (
    echo.
    echo [SUCCESS] Build thanh cong!
    echo.
    echo [INFO] De chay production server:
    echo [INFO] npm run start
    echo.
    echo [INFO] Hoac chay: start.bat va chon option 4
)

echo.
echo [INFO] Nhan phim bat ky de thoat...
pause >nul
