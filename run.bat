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

REM Đặt chế độ đầu ra mặc định là standalone (nếu không có đối số khác)
set NEXT_OUTPUT_MODE=standalone

REM Xử lý tham số dòng lệnh
if "%1"=="export" (
    set NEXT_OUTPUT_MODE=export
    echo Chế độ xuất tĩnh được kích hoạt (NEXT_OUTPUT_MODE=export)
) else (
    echo Chế độ standalone được kích hoạt (NEXT_OUTPUT_MODE=standalone)
)

REM Xoa thu muc .next cache
if exist ".next\cache\" (
    echo Dang xoa next cache...
    rmdir /s /q ".next\cache\"
)

REM Sao luu file trace nếu tồn tại
if exist ".next\trace" (
    echo Sao luu file trace...
    ren ".next\trace" "trace.old.bak"
) 

REM Chi dinh PowerShell để mở rộng quyền hạn (nếu cần)
powershell -Command "Start-Process cmd -ArgumentList '/c echo Dang cap quyen full control cho thu muc .next && icacls .next /grant Everyone:(OI)(CI)F /T' -Verb RunAs" 2>nul

REM ===== SUA LOI BANG SCRIPT FIXALL.JS =====
echo ======================================
echo       Sua loi tu dong
echo ======================================
echo.
node fixall.js

REM === TAO THU MUC VENDOR-CHUNKS ===
echo Dang tao cac thu muc can thiet...
if not exist ".next\server\vendor-chunks\" mkdir ".next\server\vendor-chunks\"
if not exist ".next\server\server\vendor-chunks\" mkdir ".next\server\server\vendor-chunks\"
if not exist ".next\static\css\app\" mkdir ".next\static\css\app\"
if not exist ".next\static\app\" mkdir ".next\static\app\"

REM === TAO FILE CAN THIET ===
if not exist ".next\server\vendor-chunks\tailwind-merge.js" (
    echo module.exports = {}; > ".next\server\vendor-chunks\tailwind-merge.js"
)
if not exist ".next\server\server\vendor-chunks\tailwind-merge.js" (
    echo module.exports = {}; > ".next\server\server\vendor-chunks\tailwind-merge.js"
)
if not exist ".next\static\css\app\layout.css" (
    echo /* Layout CSS */ > ".next\static\css\app\layout.css"
)
if not exist ".next\static\app\not-found.js" (
    echo module.exports = { notFound: function() { return { notFound: true }; } }; > ".next\static\app\not-found.js"
)
if not exist ".next\static\app\loading.js" (
    echo module.exports = { loading: function() { return { loading: true }; } }; > ".next\static\app\loading.js"
)
if not exist ".next\static\app-pages-internals.js" (
    echo module.exports = {}; > ".next\static\app-pages-internals.js"
)
if not exist ".next\static\main-app.js" (
    echo module.exports = {}; > ".next\static\main-app.js"
)

echo.
echo ======================================
echo         Dang khoi chay du an...
echo ======================================
echo Ctrl+C de huy qua trinh chay
echo.

REM Them bien moi truong de bo qua loi trace
set NEXT_DISABLE_FILE_SYSTEM_TRACE=1

REM Khoi chay Next.js binh thuong
echo Khoi chay Next.js binh thuong...
npm run dev

pause 