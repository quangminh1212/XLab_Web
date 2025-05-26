@echo off
title XLab Web Development Server
echo.
echo ==========================================
echo    🚀 XLab Web Development Server
echo ==========================================
echo.
echo 🔧 Preparing development environment...
echo.

rem Run the unified fix script and start development server
npm run dev:clean

rem Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo ❌ Error occurred. Press any key to exit...
    pause >nul
) 