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
(
echo // next.config.js
echo const nextConfig = {
echo   reactStrictMode: true,
echo   webpack: function(config) {
echo     // Fix for "Cannot read properties of undefined (reading 'call')" error
echo     if (config.resolve ^&^& config.resolve.alias) {
echo       // Remove problematic aliases
echo       delete config.resolve.alias["react"];
echo       delete config.resolve.alias["react-dom"];
echo     }
echo     // Make webpack more tolerant
echo     config.module = {
echo       ...config.module,
echo       exprContextCritical: false
echo     };
echo     return config;
echo   },
echo   compiler: {
echo     styledComponents: true
echo   }
echo };
echo.
echo module.exports = nextConfig;
) > next.config.js

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
