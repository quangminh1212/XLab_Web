@echo off
echo ==== Next.js Version Checker ====
echo.

echo Checking installed Next.js version...
call npx next --version

echo.
echo Checking installed React version...
call node -e "try { console.log('React: ' + require('react').version) } catch (e) { console.log('React not installed') }"

echo.
echo Checking for latest versions available...
call npm view next version
call npm view react version
call npm view react-dom version
call npm view @swc/helpers version

echo.
echo To update to the latest versions, run:
echo    .\update-nextjs.bat
echo. 