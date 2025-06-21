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
echo Cleaning Next.js environment...

:: Stop any running Next.js server on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
  if not "%%a" == "" (
    echo Stopping process %%a using port 3000
    taskkill /f /pid %%a >nul 2>&1
  )
)

:: Clear Next.js cache thoroughly
if exist ".next" (
  echo Removing .next directory...
  rd /s /q .next
)

if exist "node_modules\.cache" (
  echo Removing node_modules\.cache...
  rd /s /q node_modules\.cache
)

:: Create required directories
mkdir .next\server\chunks 2>nul
mkdir .next\cache\webpack\client-development 2>nul
mkdir .next\cache\webpack\server-development 2>nul
mkdir .next\cache\webpack\edge-server-development 2>nul

:: Run fix script
node scripts/fix-next-errors.js

:: Start development server
echo.
echo Starting Next.js development server...
echo.

npm run dev

rem Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo Error occurred. Press any key to exit...
    pause >nul
) 