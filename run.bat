@echo off
SETLOCAL EnableDelayedExpansion

echo ===========================================
echo    XLab Web - Quick Start
echo ===========================================

SET MODE=%1
IF "%MODE%"=="" SET MODE=dev

IF "%MODE%"=="dev" (
    echo ===========================================
    echo    XLab Web - Development Mode
    echo ===========================================
    echo Installing dependencies...
    call npm install
    echo Fixing issues before development...
    call node scripts/fix-all-issues.js
    echo Starting development server...
    call npm run dev
) ELSE IF "%MODE%"=="prod" (
    echo ===========================================
    echo    XLab Web - Production Mode
    echo ===========================================
    echo Installing dependencies...
    call npm install
    
    echo Cleaning up any existing processes...
    powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
    powershell -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
    timeout /t 2 > NUL
    
    echo Killing any processes using port 3000...
    call node scripts/kill-port.js 3000
    
    echo Creating required directories and files...
    if not exist .next mkdir .next
    if not exist .next\server mkdir .next\server
    if not exist .next\server\pages mkdir .next\server\pages
    
    echo Creating font-manifest.json file...
    echo {"pages":{},"app":{}} > .next\server\font-manifest.json
    echo Font manifest file created successfully.
    
    echo Preparing direct production server...
    echo Applying fixes for warnings...
    if exist scripts\fix-image-domains-warning.js (
        call node scripts\fix-image-domains-warning.js
    )
    call npm run start:prod
) ELSE IF "%MODE%"=="build" (
    echo ===========================================
    echo    XLab Web - Build Mode
    echo ===========================================
    echo Installing dependencies...
    call npm install
    echo Running comprehensive fixes...
    call node scripts/fix-all-issues.js
    echo Build complete! You can start the server with 'npm run start:direct'
) ELSE IF "%MODE%"=="fix" (
    echo ===========================================
    echo    XLab Web - Fix Mode
    echo ===========================================
    echo Installing dependencies...
    call npm install
    echo Running comprehensive fixes...
    call node scripts/fix-all-issues.js
    echo All fixes applied successfully!
) ELSE (
    echo ===========================================
    echo    XLab Web - Unknown Mode: %MODE%
    echo ===========================================
    echo Available modes:
    echo   dev   - Development mode
    echo   prod  - Production mode ^(using direct start method^)
    echo   build - Build mode
    echo   fix   - Fix issues only
)

ENDLOCAL 