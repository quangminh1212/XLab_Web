@echo off
chcp 65001 >nul
title XLab Web - Quick Start
echo.
echo ==========================================
echo    ⚡ XLab Web - Quick Start
echo ==========================================
echo.

rem Create logs directory if not exists
if not exist "logs" mkdir logs

rem Check if .env.local exists, if not create it
if not exist ".env.local" (
    echo 📝 Creating .env.local file...
    echo # NextAuth Configuration > .env.local
    echo NEXTAUTH_URL=http://localhost:3000 >> .env.local
    echo NEXTAUTH_SECRET=K2P5fgz9WJdLsY7mXn4A6BcRtVxZqH8DbE3NpQuT >> .env.local
    echo. >> .env.local
    echo # Google OAuth credentials >> .env.local
    echo GOOGLE_CLIENT_ID=placeholder >> .env.local
    echo GOOGLE_CLIENT_SECRET=placeholder >> .env.local
    echo. >> .env.local
    echo # Development Environment >> .env.local
    echo NODE_ENV=development >> .env.local
    echo NEXT_PUBLIC_SITE_URL=http://localhost:3000 >> .env.local
    echo ✅ .env.local created!
    echo.
)

rem Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

rem Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not available
    echo Please reinstall Node.js
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available
echo.

rem Check if node_modules exists
if not exist "node_modules" (
    echo 📦 node_modules not found. Installing dependencies...
    echo This may take a few minutes, please wait...
    echo.
    
    echo [%time%] Starting npm install... >> logs\install.log
    npm install --no-audit --no-fund --progress=true
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install dependencies. Check logs\install.log for details
        echo [%time%] npm install failed with exit code %errorlevel% >> logs\install.log
        pause
        exit /b 1
    )
    echo [%time%] npm install completed successfully >> logs\install.log
) else (
    echo ✅ node_modules found. Updating dependencies...
    echo This may take a moment...
    echo.
    
    echo [%time%] Starting npm install update... >> logs\install.log
    npm install --no-audit --no-fund --progress=true
    if errorlevel 1 (
        echo.
        echo ❌ Failed to update dependencies. Check logs\install.log for details
        echo [%time%] npm install update failed with exit code %errorlevel% >> logs\install.log
        pause
        exit /b 1
    )
    echo [%time%] npm install update completed successfully >> logs\install.log
)

echo.
echo ✅ Dependencies ready!
echo.

rem Clear any previous server logs
if exist "logs\server.log" del "logs\server.log"

echo 🚀 Starting development server...
echo Server will start at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
echo Note: If you see auth errors, run setup-env.bat to configure Google OAuth
echo.

rem Create a marker file to know server started
echo server_starting > logs\server_status.tmp

echo [%time%] Starting npm run dev... >> logs\server.log

rem Start development server
npm run dev

rem Clean up marker file
if exist "logs\server_status.tmp" del "logs\server_status.tmp"

rem Server stopped
echo.
echo 🛑 Server stopped
echo [%time%] Server stopped >> logs\server.log

rem Keep window open for a moment to see any final messages
timeout /t 3 /nobreak >nul 