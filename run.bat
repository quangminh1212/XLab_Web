@echo off
title XLab Web - Quick Start
echo.
echo ==========================================
echo    ⚡ XLab Web - Quick Start
echo ==========================================
echo.

rem Check if node_modules exists
if not exist "node_modules" (
    echo 📦 node_modules not found. Installing dependencies...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install dependencies. Press any key to exit...
        pause >nul
        exit /b 1
    )
) else (
    echo ✅ node_modules found. Checking for updates...
    echo.
    
    rem Check if package-lock.json is newer than node_modules
    for %%i in (package-lock.json) do set lock_time=%%~ti
    for %%i in (node_modules) do set modules_time=%%~ti
    
    rem Install dependencies to ensure everything is up to date
    echo 🔄 Updating dependencies...
    npm install
    if errorlevel 1 (
        echo.
        echo ❌ Failed to update dependencies. Press any key to exit...
        pause >nul
        exit /b 1
    )
)

echo.
echo ✅ Dependencies ready!
echo.
echo 🚀 Starting development server...
echo.

rem Start development server
npm run dev

rem Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo ❌ Error occurred. Press any key to exit...
    pause >nul
) 