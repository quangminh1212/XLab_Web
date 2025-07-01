@echo off
title XLab Web - Quick Start
echo.
echo ==========================================
echo    XLab Web - Quick Start
echo ==========================================
echo.
echo Installing dependencies...
call npm install
echo.

echo Preparing i18n directories...
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
echo Clearing Next.js cache...
if exist ".next" (
    rd /s /q ".next"
)
echo.
echo Starting development server without timestamps...
echo.

cd %~dp0
npm run dev:log

rem Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo Error occurred. Press any key to exit...
    pause >nul
) 