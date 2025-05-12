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

REM ===== SUA LOI BANG SCRIPT FIXALL.JS =====
echo ======================================
echo       Sua loi tu dong
echo ======================================
echo.
node fixall.js

echo.
echo ======================================
echo         Dang khoi chay du an...
echo ======================================
echo.
echo Ctrl+C de huy qua trinh chay

REM --- Khoi chay binh thuong ---
echo Khoi chay Next.js binh thuong...
SET NODE_OPTIONS=
npm run dev:clean

pause 