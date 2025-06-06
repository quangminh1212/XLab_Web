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
<<<<<<< HEAD
call npm run dev -- --port 3000
=======
call npm run dev
>>>>>>> d3e78d4f978f0864382e8714f0b3ca7c2acb6cd0

rem Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo Error occurred. Press any key to exit...
    pause >nul
) 