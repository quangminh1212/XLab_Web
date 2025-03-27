@echo off
echo Cleaning temporary and cache files...
cd /d %~dp0

echo Stopping any running Node.js processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Removing build and cache files...
if exist .next rd /s /q .next
if exist .next-dev rd /s /q .next-dev
if exist node_modules\.cache rd /s /q node_modules\.cache

echo Removing debug logs...
if exist *.log del /f *.log
if exist npm-debug.log* del /f npm-debug.log*

echo All temporary files have been cleaned.
echo.
echo Run 'run.bat' to start the development server.
exit /b 0 