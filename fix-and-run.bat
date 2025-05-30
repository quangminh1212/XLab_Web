@echo off
title XLab Web - Fix and Run
echo ==========================================
echo    XLab Web - Fix and Run
echo ==========================================
echo.

echo Step 1: Cleaning cache and temporary files...
if exist ".next" (
    echo Removing .next folder...
    rmdir /s /q ".next"
)

if exist "node_modules\.cache" (
    echo Removing node_modules cache...
    rmdir /s /q "node_modules\.cache"
)

echo.
echo Step 2: Clearing npm cache...
npm cache clean --force

echo.
echo Step 3: Installing dependencies from scratch...
if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q "node_modules"
)

echo Installing fresh dependencies...
npm install

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo Trying with different approach...
    npm install --legacy-peer-deps
    if errorlevel 1 (
        echo FAILED: Cannot install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Step 4: Starting development server...
echo Server will be available at http://localhost:3000
echo.

npm run dev 