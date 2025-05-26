@echo off
title XLab Web - Quick Start
echo.
echo ==========================================
echo    ⚡ XLab Web - Quick Start
echo ==========================================
echo.
echo 🚀 Starting development server...
echo.

rem Start development server directly
npm run dev

rem Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo ❌ Error occurred. Press any key to exit...
    pause >nul
) 