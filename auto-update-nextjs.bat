@echo off
echo ==== Next.js Automatic Updater ====
echo.

echo Auto-updating Next.js and React to the latest versions...

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
call node -e "try { console.log('@swc/helpers: ' + require('@swc/helpers/package.json').version) } catch(e) { console.log('@swc/helpers: not found') }"

echo.
echo 6. Cleaning up Next.js cache...
if exist .next (
  rmdir /s /q .next
  echo .next directory cleaned
)

echo.
echo Update completed successfully!
echo To run the application with the updated version:
echo    .\run.bat 