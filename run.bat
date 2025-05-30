@echo off
echo ==========================================
echo    XLab Web - Auto Install and Start
echo ==========================================
echo.

echo [INFO] Installing dependencies...
echo This may take a few minutes, please wait...
call npm install
echo [SUCCESS] Dependencies installed!
echo.

echo [INFO] Building application for production...
echo This may take a few minutes, please wait...
call npm run build
echo [SUCCESS] Build completed!
echo.

echo [INFO] Starting production server...
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm start

echo.
echo [INFO] Server stopped.
pause 