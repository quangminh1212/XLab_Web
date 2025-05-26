@echo off
title XLab Web Development Server
echo.
echo ==========================================
echo    🚀 XLab Web Development Server
echo ==========================================
echo.
echo 🔧 Preparing development environment...
echo.

rem Run the fix missing files script and start development server
npm run fix && node scripts/fix-missing-files.js && npm run dev

rem Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo ❌ Error occurred. Press any key to exit...
    pause >nul
) 