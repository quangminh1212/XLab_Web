@echo off
echo Checking for dependencies...
call npm install
echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.
call npm run dev

IF ERRORLEVEL 1 (
    echo Primary method failed, trying alternative method...
    node node_modules/next/dist/bin/next dev
) 