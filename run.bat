@echo off
echo ==== XLab Web Application Runner ====
echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.
echo.

echo Checking dependencies...
npm install --force

echo.
echo Verifying installed versions:
echo Next.js v%npm_package_dependencies_next%
echo React: %npm_package_dependencies_react%

echo.
echo Cleaning Next.js cache...
npm run clear-next

echo.
echo Starting development server...
npm run dev

pause 