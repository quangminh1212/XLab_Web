@echo off
rem Khong su dung tieng Viet co dau trong file .bat
setlocal enabledelayedexpansion

title XLab Web Setup
color 0A

echo ========================================================
echo     DANG CAI DAT XLAB WEB
echo ========================================================
echo.

REM Lưu đường dẫn hiện tại
set "CURRENT_DIR=%CD%"

echo [1/5] Dung cac tien trinh Node.js dang chay...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 >nul
echo.

REM Bỏ qua phần yêu cầu quyền admin
echo [2/5] Xoa thu muc .next de tranh loi quyen truy cap...
if exist ".next" (
    echo Dang xoa thu muc .next...
    attrib -r -s -h ".next\*.*" /s /d >nul 2>&1
    
    REM Xóa từng thư mục con trước
    if exist ".next\trace" rd /s /q ".next\trace" >nul 2>&1
    if exist ".next\cache" rd /s /q ".next\cache" >nul 2>&1
    if exist ".next\server" rd /s /q ".next\server" >nul 2>&1
    if exist ".next\static" rd /s /q ".next\static" >nul 2>&1
    
    REM Xóa toàn bộ thư mục .next
    rd /s /q ".next" >nul 2>&1
    
    if exist ".next" (
        del /f /s /q ".next\*.*" >nul 2>&1
        rd /s /q ".next" >nul 2>&1
    )
)
echo.

echo [3/5] Kiem tra thu muc node_modules...
if not exist node_modules (
    echo Thu muc node_modules khong ton tai, se cai dat moi
    set need_install=1
) else (
    echo Thu muc node_modules da ton tai, bo qua buoc cai dat
    set need_install=0
)
echo.

echo [4/5] Thiet lap bien moi truong...
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--max-old-space-size=4096 --no-warnings
echo.

REM Đảm bảo chạy lệnh npm trong thư mục dự án
cd /d "%CURRENT_DIR%"

if "%need_install%"=="1" (
    echo [5/5] Cai dat dependencies...
    call npm install
    echo.
) else (
    echo [5/5] Bo qua cai dat dependencies
    echo.
)

echo Khoi dong ung dung...
echo.
echo ========================================================
echo     STARTING XLAB WEB (NPM DEV)
echo     Press Ctrl+C to stop
echo ========================================================
echo.

if "%1"=="build" (
    call npm run build
) else (
    call npm run dev
)

echo.
echo ========================================================
echo     APPLICATION STOPPED
echo ========================================================
echo.
pause
exit /b 0
