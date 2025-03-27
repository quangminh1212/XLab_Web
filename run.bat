@echo off
echo Checking for dependencies...
cd /d %~dp0

echo Cleaning old cache files...
if exist .next rd /s /q .next
if exist .next-dev rd /s /q .next-dev
if exist node_modules\.cache rd /s /q node_modules\.cache

IF NOT EXIST node_modules (
    echo Node modules not found. Installing dependencies...
    powershell -ExecutionPolicy Bypass -Command "npm install --no-fund --loglevel=error"
    echo Installation complete.
) ELSE (
    echo Checking for updates...
    powershell -ExecutionPolicy Bypass -Command "npm update --no-fund --loglevel=error"
)

echo Cleaning Next.js cache...
powershell -ExecutionPolicy Bypass -Command "npx next clean"

echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.
powershell -ExecutionPolicy Bypass -Command "npm run dev"

IF ERRORLEVEL 1 (
    echo Primary method failed, trying alternative method...
    echo Make sure you have Node.js v20+ installed
    powershell -ExecutionPolicy Bypass -Command "node --version"
    node node_modules/next/dist/bin/next dev
) 