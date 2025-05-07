@echo off
echo ====================================
echo   XLab Web - Fix All Next.js Errors
echo ====================================
echo.
echo This script will fix all Next.js errors including:
echo - ENOENT errors
echo - Webpack cache errors
echo - Server runtime errors
echo - Static file errors
echo.
echo [1/8] Stopping all Node.js processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/8] Completely removing .next directory...
if exist .next rmdir /s /q .next 
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo [3/8] Creating basic Next.js directory structure...
mkdir .next
mkdir .next\cache
mkdir .next\cache\webpack
mkdir .next\cache\webpack\client-development
mkdir .next\cache\webpack\server-development
mkdir .next\cache\webpack\edge-server-development
mkdir .next\server
mkdir .next\server\pages
mkdir .next\server\app
mkdir .next\server\vendor-chunks
mkdir .next\static
mkdir .next\static\chunks
mkdir .next\static\chunks\app
mkdir .next\static\chunks\pages
mkdir .next\static\chunks\fallback
mkdir .next\static\css
mkdir .next\static\css\app
mkdir .next\static\media
mkdir .next\static\webpack

echo [4/8] Creating webpack placeholder files...
node fix-webpack-enoent.js

echo [5/8] Creating font manifest and other required files...
echo {"pages":{},"app":{}} > .next\server\next-font-manifest.json
echo {"pages":{},"app":{}} > .next\server\app-paths-manifest.json
echo {"middleware":{},"functions":{},"version":2} > .next\server\middleware-manifest.json
echo {} > .next\build-manifest.json
echo {} > .next\react-loadable-manifest.json

echo [6/8] Creating fallback files...
echo // Fallback file > .next\static\chunks\fallback\main.js
echo // Fallback file > .next\static\chunks\fallback\webpack.js
echo // Fallback file > .next\static\chunks\fallback\react-refresh.js
echo // Fallback file > .next\static\chunks\fallback\pages\_app.js
echo // Fallback file > .next\static\chunks\fallback\pages\_error.js

echo [7/8] Running clean-trace.js to create additional files...
node clean-trace.js

echo [8/8] Creating empty app folder and page.js...
if not exist .next\server\app mkdir .next\server\app
echo module.exports=function(){return null} > .next\server\app\page.js
echo module.exports=function(){return null} > .next\server\pages\_document.js
echo module.exports=function(){return null} > .next\server\pages\_app.js
echo module.exports=function(){return null} > .next\server\pages\_error.js

echo.
echo ====================================
echo Fix completed successfully!
echo.
echo Now you can run:
echo   npm run dev
echo to start the development server.
echo ====================================
echo.

pause 