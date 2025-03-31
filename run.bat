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

echo [2/4] Kiem tra thu muc node_modules...
if not exist node_modules (
    echo Thu muc node_modules khong ton tai, se cai dat moi
    set need_install=1
) else (
    echo Thu muc node_modules da ton tai, bo qua buoc cai dat
    set need_install=0
)
echo.

echo [3/4] Tao file next.config.js moi...
echo // next.config.js > next.config.js
echo const nextConfig = { >> next.config.js
echo   reactStrictMode: true, >> next.config.js
echo   compiler: { >> next.config.js
echo     styledComponents: true >> next.config.js
echo   } >> next.config.js
echo } >> next.config.js
echo. >> next.config.js
echo module.exports = nextConfig >> next.config.js
echo Da tao file next.config.js moi
echo.

if "%need_install%"=="1" (
    echo [4/4] Cai dat dependencies...
    call npm install
    echo.
) else (
    echo [4/4] Bo qua cai dat dependencies
    echo.
)

echo Khoi dong ung dung...
echo.
echo ========================================================
echo     STARTING XLAB WEB (NPM DEV)
echo     Press Ctrl+C to stop
echo ========================================================
echo.

call npm run dev

echo.
echo ========================================================
echo     APPLICATION STOPPED
echo ========================================================
echo.
pause
exit /b 0
