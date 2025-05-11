@echo off
echo === FIXING SWC ERRORS ===
node fix-swc-errors.js
echo.
echo === SCRIPT COMPLETED ===
echo Now starting the application...
echo.
npm run dev 