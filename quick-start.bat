@echo off
title XLab Web - Quick Start
echo.
echo ==========================================
echo    XLab Web - Quick Development Start
echo    Domain: xlab.id.vn
echo ==========================================
echo.

echo [1] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js chua duoc cai dat!
    echo Vui long cai dat Node.js 18+ tu https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js OK

echo [2] Installing dependencies...
call npm install >nul 2>&1
if errorlevel 1 (
    echo ❌ Loi khi cai dat dependencies!
    pause
    exit /b 1
)
echo ✅ Dependencies OK

echo [3] Fixing SWC version...
call npm install @next/swc-win32-x64-msvc@15.2.4 >nul 2>&1
echo ✅ SWC version fixed

echo [4] Preparing environment...
if not exist ".env.local" (
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
        echo ✅ Created .env.local from example
    )
)

echo [5] Clearing cache...
if exist ".next" (
    rd /s /q ".next" >nul 2>&1
)
echo ✅ Cache cleared

echo [6] Starting development server...
echo.
echo 🌐 Local: http://localhost:3000
echo 🌐 Domain: https://xlab.id.vn (production)
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
