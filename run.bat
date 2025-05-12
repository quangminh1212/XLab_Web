@echo off
setlocal enabledelayedexpansion

echo ======================================
echo       XLab_Web - Khoi chay du an
echo ======================================
echo.

REM Kiem tra xem node_modules co ton tai khong
if not exist "node_modules\" (
    echo Cai dat cac goi npm...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo Loi: Khong the cai dat cac goi npm. Kiem tra ket noi mang hoac package.json.
        pause
        exit /b 1
    )
    echo Cai dat hoan tat!
) else (
    echo Node modules da duoc cai dat.
)

REM ===== SUA LOI BANG SCRIPT FIXALL.JS =====echo ======================================echo       Sua loi tu dongecho ======================================echo.node fixall.js

echo.
echo ======================================
echo         Dang khoi chay du an...
echo ======================================
echo.
echo Ctrl+C de huy qua trinh chay

REM --- Chọn phương thức khởi chạy ---
echo Chon cach khoi chay:
echo 1. Khoi chay binh thuong (dev:clean)
echo 2. Khoi chay khong co tracing (--no-trace)
echo 3. Khoi chay voi tuy chon an toan (--no-warnings)
echo.
set /p option=Nhap lua chon (1-3, mac dinh: 1): 

if "%option%"=="2" (
    echo Khoi chay Next.js khong co tracing...
    SET NODE_OPTIONS=
    npx next dev
) else if "%option%"=="3" (
    echo Khoi chay Next.js voi tuy chon an toan...
    SET NODE_OPTIONS=--no-warnings
    node --no-warnings --trace-warnings node_modules/next/dist/bin/next dev
) else (
    echo Khoi chay Next.js binh thuong...
    SET NODE_OPTIONS=
    npm run dev:clean
)

pause 