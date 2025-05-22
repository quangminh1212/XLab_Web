@echo off
echo.
echo ==========================================
echo   XLab Web - Quick Setup and Run
echo ==========================================
echo.

:: Kiểm tra Node.js
echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

:: Kiểm tra npm
echo.
echo [2/4] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found! Please install npm
    pause
    exit /b 1
)
echo ✅ npm is installed

:: Cài đặt dependencies nếu chưa có node_modules
echo.
echo [3/4] Installing dependencies...
if not exist "node_modules" (
    echo Installing packages for the first time...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

:: Khởi động server
echo.
echo [4/4] Starting development server...
echo.
echo 🚀 XLab Web is starting at http://localhost:3000
echo 📝 Press Ctrl+C to stop the server
echo.
npm run dev

pause
