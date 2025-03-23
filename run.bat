@echo off
echo Checking for dependencies...
cd /d %~dp0

IF NOT EXIST node_modules (
    echo Node modules not found. Installing dependencies...
    powershell -ExecutionPolicy Bypass -Command "npm install"
    echo Installation complete.
)

echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.
powershell -ExecutionPolicy Bypass -Command "npm run dev"

IF ERRORLEVEL 1 (
    echo Primary method failed, trying alternative method...
    node node_modules/next/dist/bin/next dev
) 