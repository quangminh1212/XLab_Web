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
    
    echo Killing all Node.js processes and freeing ports...
    call node scripts/kill-port.js --kill-all
    timeout /t 2 > NUL
    call node scripts/kill-port.js 3000 --with-all
    call node scripts/kill-port.js 3001
    call node scripts/kill-port.js 3002
    call node scripts/kill-port.js 3003
    call node scripts/kill-port.js 3004
    call node scripts/kill-port.js 3005
    call node scripts/kill-port.js 3006
    call node scripts/kill-port.js 3007
    call node scripts/kill-port.js 3008
    call node scripts/kill-port.js 3009
    
    echo Cleaning .next directory...
    if exist .next rmdir /s /q .next
    
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
    
    echo Killing all Node.js processes and freeing ports...
    call node scripts/kill-port.js --kill-all
    timeout /t 2 > NUL
    call node scripts/kill-port.js 3000 --with-all
    call node scripts/kill-port.js 3001
    call node scripts/kill-port.js 3002
    call node scripts/kill-port.js 3003
    call node scripts/kill-port.js 3004
    call node scripts/kill-port.js 3005
    call node scripts/kill-port.js 3006
    call node scripts/kill-port.js 3007
    call node scripts/kill-port.js 3008
    call node scripts/kill-port.js 3009
    
    echo Cleaning .next directory...
    if exist .next rmdir /s /q .next
    
    echo Running comprehensive fixes and build...
    call node scripts/fix-all-issues.js
    
    echo Creating required directories and files...
    if not exist .next mkdir .next
    if not exist .next\server mkdir .next\server
    if not exist .next\server\pages mkdir .next\server\pages
    if not exist .next\standalone mkdir .next\standalone
    
    echo Creating manifest files...
    echo {"pages":{},"app":{}} > .next\server\font-manifest.json
    echo {"pages":{},"app":{}} > .next\server\next-font-manifest.json
    echo {} > .next\server\app-paths-manifest.json
    echo {"version":1,"sortedMiddleware":[],"middleware":{},"functions":{},"staticAssets":[],"rsc":{"module":"","css":[],"function":{}}} > .next\server\middleware-manifest.json
    echo Font manifest files created successfully.
    
    echo Preparing standalone server...
    echo Applying fixes for warnings...
    if exist scripts\fix-image-domains-warning.js (
        call node scripts\fix-image-domains-warning.js
    )
    
    echo Creating pages-manifest.json file...
    echo {} > .next\server\pages-manifest.json
    echo Created pages-manifest.json file.
    
    echo Starting production server in standalone mode...
    echo This uses node .next/standalone/server.js under the hood
    echo.
    call npm run start:prod
    
    if ERRORLEVEL 1 (
        echo.
        echo ======================================================
        echo ERROR: Server failed to start in standalone mode
        echo ======================================================
        echo Checking port 3000 availability...
        netstat -ano | findstr :3000
        echo.
        echo Killing all processes one more time before direct start...
        call node scripts/kill-port.js --kill-all
        timeout /t 2 > NUL
        
        echo Attempting direct start with node...
        if exist .next\standalone\server.js (
            echo Trying: node .next\standalone\server.js
            node .next\standalone\server.js
        ) else (
            echo ERROR: standalone/server.js not found
        )
    )
) ELSE IF "%MODE%"=="build" (
    echo ===========================================
    echo    XLab Web - Build Mode
    echo ===========================================
    echo Installing dependencies...
    call npm install
    
    echo Killing all Node.js processes and freeing ports...
    call node scripts/kill-port.js --kill-all
    timeout /t 2 > NUL
    call node scripts/kill-port.js 3000 --with-all
    call node scripts/kill-port.js 3001
    call node scripts/kill-port.js 3002
    call node scripts/kill-port.js 3003
    call node scripts/kill-port.js 3004
    call node scripts/kill-port.js 3005
    call node scripts/kill-port.js 3006
    call node scripts/kill-port.js 3007
    call node scripts/kill-port.js 3008
    call node scripts/kill-port.js 3009
    
    echo Cleaning .next directory...
    if exist .next rmdir /s /q .next
    
    echo Running comprehensive fixes...
    call node scripts/fix-all-issues.js
    echo Building for production...
    call npm run build
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
    echo   prod  - Production mode ^(using standalone server^)
    echo   build - Build mode
    echo   fix   - Fix issues only
)

ENDLOCAL 