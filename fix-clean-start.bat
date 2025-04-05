@echo off
echo Full clean restart of Next.js project
echo ===============================
echo.

REM Kill all running Node.js processes
echo Stopping all Node.js processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

REM Ensure we have admin privileges
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

REM Backup current next.config.js
if exist "next.config.js" (
    echo Backing up current next.config.js...
    copy "next.config.js" "next.config.js.backup-%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%" >nul
)

REM Replace with clean version if available
if exist "next.config.js.clean" (
    echo Replacing next.config.js with clean version...
    copy "next.config.js.clean" "next.config.js" /y >nul
)

REM Clean .next directory completely
echo Cleaning build artifacts...
if exist ".next" (
    echo Removing .next directory...
    attrib -r -s -h ".next\*.*" /s /d >nul 2>&1
    rd /s /q ".next" >nul 2>&1
)

REM Clean node_modules cache and reinstall 
echo Setting up clean environment...

REM Clear npm cache
echo Clearing npm cache...
call npm cache clean --force >nul 2>&1

REM Set environment variables
echo Setting environment variables...
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--max-old-space-size=4096 --no-warnings

REM Start development server
echo Starting Next.js development server...
call npm run dev

exit /B 0 