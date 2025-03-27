@echo off
echo Cleaning project files for fresh install...
cd /d %~dp0

echo Stopping any running Node.js processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Removing old installation files...
if exist .next rd /s /q .next
if exist .next-dev rd /s /q .next-dev
if exist node_modules rd /s /q node_modules
if exist package-lock.json del /f package-lock.json

echo Installing dependencies...
powershell -ExecutionPolicy Bypass -Command "npm cache clean --force"
powershell -ExecutionPolicy Bypass -Command "npm install --no-fund"

echo Installation complete.
echo.
echo Run 'run.bat' to start the development server.
pause 