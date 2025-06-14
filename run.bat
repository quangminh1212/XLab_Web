@echo off
echo === XLab Web Server ===
echo Cleaning up .next directory...
if exist .next (
  rmdir /s /q .next
)

echo Running fix-next script...
node fix-next.js

echo Installing dependencies...
npm install

echo Starting production server...
npm start

pause 