@echo off
setlocal

echo ===========================================
echo    XLab Web - Quick Start
echo ===========================================

if "%1"=="" (
    goto dev
) else if "%1"=="dev" (
    goto dev
) else if "%1"=="prod" (
    goto prod
) else if "%1"=="start" (
    goto start
) else if "%1"=="build" (
    goto build
) else if "%1"=="fix" (
    goto fix
) else (
    echo Invalid parameter. Use one of: dev, prod, start, build, fix
    exit /b 1
)

:dev
echo ===========================================
echo    XLab Web - Development Mode
echo ===========================================
call npm run dev
goto :EOF

:prod
echo ===========================================
echo    XLab Web - Production Mode
echo ===========================================
echo Installing dependencies...
call npm run fix:all
call npm run start
goto :EOF

:start
echo ===========================================
echo    XLab Web - Starting Server
echo ===========================================
call node scripts/fix-prerender-manifest.js
call npm run start
goto :EOF

:build
echo ===========================================
echo    XLab Web - Building
echo ===========================================
call npm run build:clean
goto :EOF

:fix
echo ===========================================
echo    XLab Web - Fixing Issues
echo ===========================================
call npm run fix:all
goto :EOF 