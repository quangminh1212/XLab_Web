@echo off
title XLab Web - Quick Start (Simple)
echo ==========================================
echo    Quick Start - XLab Web
echo ==========================================
echo.

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)

echo Checking npm...
npm --version
if errorlevel 1 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)

echo.
echo Installing/updating dependencies...
npm install --silent
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo Starting server...
echo Open http://localhost:3000 in your browser
echo.

npm run dev 