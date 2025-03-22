@echo off
echo Checking for dependencies...
cd /d %~dp0

IF NOT EXIST node_modules (
    echo Node modules not found. Installing dependencies...
    cmd /c "powershell -ExecutionPolicy Bypass -Command npm install"
    echo Installation complete.
)

echo Starting XLab_Web development server...
start cmd /c "powershell -ExecutionPolicy Bypass -Command npm run dev"

echo If the server fails to start, press any key to try alternative method...
timeout /t 5
IF ERRORLEVEL 1 (
    echo Trying alternative method...
    start cmd /c "node node_modules/next/dist/bin/next dev"
) 