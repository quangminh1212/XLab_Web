@echo off
echo ==== XLab Web Application Runner ====
echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.
echo.

echo Checking dependencies...
npm install

echo.
echo Verifying installed versions:
echo Next.js v13.5.6
echo React: 18.2.0

echo.
echo Cleaning Next.js cache...
npm run clear-next

echo.
echo Starting development server...
npm run dev

pause 