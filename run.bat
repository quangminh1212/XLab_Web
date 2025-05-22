@echo off
chcp 65001 >nul
cls
echo.
echo ======================================
echo   XLab Web - Quick Setup and Run
echo ======================================
echo.

:: Check Node.js
echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js not found! Please install from https://nodejs.org/
    pause
    exit /b 1
)
for /f "delims=" %%i in ('node --version') do set NODE_VER=%%i
echo + Node.js %NODE_VER% is installed

:: Check npm
echo.
echo [2/4] Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo X npm not found!
    pause
    exit /b 1
)
for /f "delims=" %%i in ('npm --version') do set NPM_VER=%%i
echo + npm %NPM_VER% is installed

:: Install missing packages
echo.
echo [3/4] Installing dependencies...
if exist "node_modules\@radix-ui\react-slot\package.json" (
    echo + @radix-ui/react-slot already installed
) else (
    echo Installing @radix-ui/react-slot...
    npm install @radix-ui/react-slot --no-fund --no-audit --silent
    if errorlevel 1 (
        echo X Failed to install package
        pause
        exit /b 1
    )
    echo + Package installed successfully
)

:: Clean cache and start server
echo.
echo [4/4] Starting server...
if exist ".next" (
    echo Cleaning cache...
    rmdir /s /q .next >nul 2>&1
    echo + Cache cleared
)

echo.
echo Starting development server...
echo + URL: http://localhost:3000
echo + Press Ctrl+C to stop
echo.

npm run dev:simple
