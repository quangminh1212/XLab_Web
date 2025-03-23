@echo off
echo ==== Next.js Updater Tool ====
echo.

echo This script will update Next.js and React to the latest versions.
echo It is recommended to commit your changes before updating.
echo.

set /p CONFIRM=Do you want to continue? (Y/N): 
if /i "%CONFIRM%" NEQ "Y" (
  echo Update cancelled.
  exit /b
)

echo.
echo 1. Cleaning npm cache...
call npm cache clean --force

echo.
echo 2. Backing up package.json...
copy package.json package.json.bak
echo Backup created: package.json.bak

echo.
echo 3. Installing latest Next.js, React, and related packages...
call npm install next@latest react@latest react-dom@latest eslint-config-next@latest --save

echo.
echo 4. Checking for @swc/helpers compatibility...
call npm install @swc/helpers@latest --save

echo.
echo 5. Installed versions:
call npx next --version
call node -e "console.log('React: ' + require('react').version)"
call node -e "console.log('@swc/helpers: ' + require('@swc/helpers/package.json').version)"

echo.
echo 6. Cleaning up Next.js cache...
if exist .next (
  rmdir /s /q .next
  echo .next directory cleaned
)

echo.
echo Update completed successfully!
echo If you encounter any issues, you can restore the backup with:
echo    copy package.json.bak package.json
echo    npm install
echo.
echo To run the application with the updated version:
echo    .\run.bat 