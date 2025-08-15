@echo off
chcp 65001 >nul 2>&1
setlocal EnableExtensions EnableDelayedExpansion

title XLab Web - Quick Start
echo.
echo ==========================================
echo    XLab Web - Quick Start
echo ==========================================
echo.

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
)
echo.

echo Preparing i18n directories...
if not exist "src\i18n\eng\product" (
    mkdir "src\i18n\eng\product"
    echo Created directory: src\i18n\eng\product
)

echo Copying product files from Vietnamese to English...
if exist "src\i18n\vie\product\chatgpt.json" (
    copy /y "src\i18n\vie\product\chatgpt.json" "src\i18n\eng\product\chatgpt.json" >nul
    echo Copied: chatgpt.json
)
if exist "src\i18n\vie\product\grok.json" (
    copy /y "src\i18n\vie\product\grok.json" "src\i18n\eng\product\grok.json" >nul
    echo Copied: grok.json
)
if exist "src\i18n\vie\product\index.ts" (
    copy /y "src\i18n\vie\product\index.ts" "src\i18n\eng\product\index.ts" >nul
    echo Copied: index.ts
)

echo Fixing language comparison issues...
node scripts/fix-language-issues.js
if errorlevel 1 echo (non-fatal) Language fix script returned error.
echo.

echo Clearing Next.js cache...
if exist ".next" (
    rd /s /q ".next"
)
echo.

REM === Detect free port starting from 3000 ===
set "PORT=3000"
for /L %%P in (3000,1,3010) do (
  powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort %%P -State Listen -ErrorAction SilentlyContinue) { exit 1 } else { exit 0 }"
  if not errorlevel 1 (
    set "PORT=%%P"
    goto :PORT_FOUND
  )
)
:PORT_FOUND
echo Using PORT %PORT%

echo Starting development server (no timestamps)...
cd /d "%~dp0"
node scripts/start-with-logger.js dev -p %PORT%

REM Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo Error occurred. Press any key to exit...
    pause >nul
)
endlocal