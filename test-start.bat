@echo off

title XLab Web - Test

echo.
echo ================================================================
echo                    XLab Web Test
echo ================================================================
echo.

echo [INFO] Checking Node.js...
node -v
echo [SUCCESS] Node.js check completed

echo [INFO] Checking npm...
npm -v  
echo [SUCCESS] npm check completed

echo.
echo [INFO] Checking if build exists...
if exist ".next\BUILD_ID" (
    echo [SUCCESS] Build exists, skipping npm install and build
    goto start_services
)

echo [INFO] Installing dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed

echo [INFO] Building production...
set SKIP_TYPE_CHECK=true
npm run build
if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [SUCCESS] Build completed

:start_services
echo.
echo ================================================================
echo                    STARTING SERVICES
echo ================================================================

echo [INFO] Starting XLab Web Server...
start "XLab Web Server" /min cmd /c "npm run start"
timeout /t 8 >nul

echo [INFO] Checking if server started...
netstat -an | find "3000"
if errorlevel 1 (
    echo [ERROR] XLab Server failed to start!
    pause
    exit /b 1
)
echo [SUCCESS] XLab Server started (port 3000)

echo.
echo [SUCCESS] Test completed!
echo [INFO] Server is running on http://localhost:3000
echo.
pause
