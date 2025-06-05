@echo off
title XLab Web - Quick Start
echo.
echo ==========================================
echo    XLab Web - Quick Start
echo ==========================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Installing json5 specifically...
call npm install json5
echo.
echo Clearing Next.js cache...
if exist ".next" (
    rd /s /q ".next"
)
echo.
echo Starting development server...
echo.

rem Start development server directly
call npm run dev -- -p 3000

rem Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo Error occurred. Press any key to exit...
    pause >nul
) 