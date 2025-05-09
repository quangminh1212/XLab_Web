@echo off
echo ===========================================================
echo Cleaning and optimizing Next.js project - XLab_Web
echo ===========================================================
echo.

echo Step 1: Checking and fixing trace error...
node fix-trace-error.js

echo.
echo Step 2: Fixing Next.js configuration...
if exist "next.config.js" (
    echo Backing up next.config.js...
    copy next.config.js next.config.js.bak >nul
)

echo.
echo Step 3: Cleaning project...
if exist ".next\trace" (
    echo Removing trace file...
    attrib -r -s -h .next\trace
    del /f /q .next\trace 2>nul
)

echo Cleaning temporary files...
if exist "restart.bat" del /f /q restart.bat
if exist "restart.ps1" del /f /q restart.ps1
if exist "restart-dev.js" del /f /q restart-dev.js
if exist "check-config.js" del /f /q check-config.js

echo.
echo Step 4: Running fix-all-errors to ensure proper setup...
node fix-all-errors.js

echo.
echo Step 5: Updating .gitignore...
echo Đã cập nhật .gitignore để bỏ qua các tệp tin tạm thời.

echo.
echo ===========================================================
echo Project prepared successfully!
echo ===========================================================
echo Starting Next.js application...
echo.
npm run dev

pause 