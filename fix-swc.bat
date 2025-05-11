@echo off
echo ===== FIX SWC ERRORS =====
echo Updating .npmrc...
echo next_use_wasm=1 > .npmrc
echo next-swc-wasm=true >> .npmrc

echo Installing SWC WASM package...
call npm install --save-dev @next/swc-wasm-nodejs

echo Removing SWC native package...
call npm uninstall @next/swc-win32-x64-msvc

echo Clearing Next.js cache...
if exist .next\cache\ rmdir /s /q .next\cache
if exist node_modules\.cache\ rmdir /s /q node_modules\.cache

echo Creating required directories...
mkdir .next\cache

echo Creating .gitkeep files...
echo. > .next\cache\.gitkeep

echo Running fix-swc-errors.js script...
node fix-swc-errors.js

echo ===== SWC FIX COMPLETED =====
echo Please restart your Next.js development server with "npm run dev"
pause 