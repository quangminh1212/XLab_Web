@echo off
echo Checking for dependencies...
cd /d %~dp0

echo Checking for node version...
node --version

echo Cleaning old cache files...
if exist .next-dev rd /s /q .next-dev
if exist node_modules\.cache rd /s /q node_modules\.cache

IF NOT EXIST node_modules (
    echo Node modules not found. Installing dependencies...
    call npm install --no-fund --loglevel=error --legacy-peer-deps
    echo Installation complete.
) ELSE (
    echo Checking for updates...
    call npm update --no-fund --loglevel=error
)

echo Cleaning Next.js cache...
call npx next clean

echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.
set NODE_OPTIONS=--max-old-space-size=4096
call npm run dev

IF ERRORLEVEL 1 (
    echo Primary method failed, trying alternative method...
    echo Make sure you have Node.js v20+ installed
    node --version
    echo Try running with node directly...
    node node_modules/next/dist/bin/next dev --port 3000 --hostname 0.0.0.0
) 