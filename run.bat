@echo off
chcp 65001 >nul
cls

:start
echo.
echo ==========================================
echo   XLab Web - All-in-One Launcher
echo ==========================================
echo.
echo Choose an option:
echo   [1] Quick Start (Fast startup)
echo   [2] Full Check + Start (Recommended)
echo   [3] Optimize Only
echo   [4] Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto :quick_start
if "%choice%"=="2" goto :full_check
if "%choice%"=="3" goto :optimize_only
if "%choice%"=="4" exit /b 0
echo Invalid choice. Please try again.
pause
goto :start

:quick_start
cls
echo ==========================================
echo   XLab Web - Quick Start
echo ==========================================
echo.
call :check_node_npm
call :install_deps
call :start_server
goto :end

:full_check
cls
echo ==========================================
echo   XLab Web - Full Check + Start
echo ==========================================
echo.
call :clean_cache
call :type_check
call :lint_check
call :check_node_npm
call :install_deps
call :start_server
goto :end

:optimize_only
cls
echo ==========================================
echo   XLab Web - Project Optimization
echo ==========================================
echo.
call :clean_cache
call :type_check
call :lint_check
call :test_build
echo.
echo Optimization Complete!
pause
goto :start

:check_node_npm
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js not found! Install from https://nodejs.org/
    pause
    exit /b 1
)
echo + Node.js is installed

echo Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo X npm not found!
    pause
    exit /b 1
)
echo + npm is installed
echo.
goto :eof

:install_deps
echo Installing dependencies...
if exist "node_modules\@radix-ui\react-slot\package.json" (
    echo + @radix-ui/react-slot already installed
) else (
    echo Installing @radix-ui/react-slot...
    npm install @radix-ui/react-slot --no-fund --no-audit --silent
    if errorlevel 1 (
        echo X Failed to install package
        pause
        exit /b 1
    )
    echo + Package installed
)
echo.
goto :eof

:start_server
echo Starting development server...
if exist ".next" rmdir /s /q .next >nul 2>&1
echo + URL: http://localhost:3000
echo + Press Ctrl+C to stop
echo.
npm run dev:simple
goto :eof

:clean_cache
echo Cleaning cache and temporary files...
if exist ".next" rmdir /s /q .next >nul 2>&1
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache >nul 2>&1
if exist "*.temp" del /q *.temp >nul 2>&1
if exist "*.tmp" del /q *.tmp >nul 2>&1
echo + Cache cleaned
echo.
goto :eof

:type_check
echo Running TypeScript check...
call npx tsc --noEmit
if errorlevel 1 (
    echo X TypeScript errors found
) else (
    echo + TypeScript check passed
)
echo.
goto :eof

:lint_check
echo Running ESLint check...
call npx next lint --quiet
if errorlevel 1 (
    echo X ESLint issues found
) else (
    echo + ESLint check passed
)
echo.
goto :eof

:test_build
echo Testing build...
call npm run build
if errorlevel 1 (
    echo X Build failed
) else (
    echo + Build successful
)
echo.
goto :eof

:end
pause
