@echo off
echo Checking for dependencies...
cd /d %~dp0

echo Clearing Next.js cache to prevent version staleness issues...
if exist ".next" (
  rmdir /s /q ".next"
)
if exist ".next-dev" (
  rmdir /s /q ".next-dev"
)

IF NOT EXIST node_modules (
    echo Node modules not found. Installing dependencies...
    powershell -ExecutionPolicy Bypass -Command "npm install"
    echo Installation complete.
)

echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.
powershell -ExecutionPolicy Bypass -Command "npm run dev"

IF ERRORLEVEL 1 (
    echo Error starting development server.
    pause
    exit /b 1
) 