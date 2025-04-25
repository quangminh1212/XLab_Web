@echo off
echo Cleaning project...
rmdir /s /q .next
rmdir /s /q node_modules
rmdir /s /q .next-dev
del /f /q yarn.lock
del /f /q package-lock.json

echo Installing dependencies...
npm install

echo Clean and reinstall completed successfully!
pause 