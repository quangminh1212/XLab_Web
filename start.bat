@echo off
title XLab Web - All Features
echo.
echo ==========================================
echo    XLab Web - Full Startup
echo ==========================================
echo.

echo [1/3] Checking Node.js and npm installation...
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed or not in PATH. Please install Node.js and try again.
    goto error
)
where npm >nul 2>&1
if errorlevel 1 (
    echo npm is not installed or not in PATH. Please install Node.js and try again.
    goto error
)
echo Node.js and npm detected.

echo.
echo [2/3] Installing dependencies...
call npm install
echo.

echo [3/3] Preparing environment...
if not exist "src\i18n\eng\product" (
    mkdir "src\i18n\eng\product"
    echo Created directory: src\i18n\eng\product
)

echo Copying product files from Vietnamese to English...
if exist "src\i18n\vie\product\chatgpt.json" (
    copy "src\i18n\vie\product\chatgpt.json" "src\i18n\eng\product\chatgpt.json"
    echo Copied: chatgpt.json
)
if exist "src\i18n\vie\product\grok.json" (
    copy "src\i18n\vie\product\grok.json" "src\i18n\eng\product\grok.json"
    echo Copied: grok.json
)
if exist "src\i18n\vie\product\index.ts" (
    copy "src\i18n\vie\product\index.ts" "src\i18n\eng\product\index.ts"
    echo Copied: index.ts
)

echo Installing json5 specifically...
call npm install json5
echo.

echo Fixing language comparison issues...
if exist "scripts\fix-language-issues.js" (
    call node scripts/fix-language-issues.js
) else (
    echo Warning: fix-language-issues.js not found. Skipping...
)
echo.

echo Clearing Next.js cache...
if exist ".next" (
    rd /s /q ".next" 2>nul
    if errorlevel 1 (
        echo Warning: Could not completely clear .next directory. Continuing anyway.
    )
)
echo.

echo Starting Next.js development server...
start "Next.js Server" cmd /k "npm run dev"

echo.
echo ==========================================
echo All services started successfully!
echo.
echo - Next.js is running on http://localhost:3000
echo - To enable public access, use start-serveo.bat or auto-serveo.bat
echo.
echo ==========================================
echo.
echo Press any key to stop all services and exit...
pause >nul

echo Stopping services...
taskkill /FI "WINDOWTITLE eq Next.js Server*" /T /F >nul 2>&1
echo Done.
goto :eof

:error
echo.
echo Error occurred. Press any key to exit...
pause >nul 