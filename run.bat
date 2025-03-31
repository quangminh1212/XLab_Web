@echo off
rem Khong su dung tieng Viet co dau trong file .bat
setlocal enabledelayedexpansion

title XLab Web Setup
color 0A

echo ========================================================
echo     DANG CAI DAT XLAB WEB
echo ========================================================
echo.

echo [1/4] Dung cac tien trinh Node.js dang chay...
taskkill /F /IM node.exe >nul 2>&1
echo.

echo [2/4] Xoa thu muc node_modules (neu co)...
if exist node_modules (
    rd /s /q node_modules >nul 2>&1
    echo Da xoa node_modules
) else (
    echo Thu muc node_modules khong ton tai
)
echo.

echo [3/4] Cai dat dependencies...
call npm install
echo.

echo [4/4] Khoi dong ung dung...
echo.
echo ========================================================
echo     STARTING XLAB WEB (NPM START)
echo     Press Ctrl+C to stop
echo ========================================================
echo.

call npm start

echo.
echo ========================================================
echo     APPLICATION STOPPED
echo ========================================================
echo.
pause
exit /b 0
