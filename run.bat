@echo off
chcp 65001 >nul
cls

REM Check parameters for specific modes
if "%1"=="quick" goto :quick_mode
if "%1"=="dev" goto :dev_mode
if "%1"=="auto" goto :auto_run
if "%1"=="menu" goto :show_menu

REM Default: Run option 2 directly (no menu)
goto :full_check

:show_menu
echo.
echo ==========================================
echo   XLab Web - All-in-One Launcher
echo ==========================================
echo.
echo Choose an option:
echo   [1] Quick Start (Fast startup)
echo   [2] Full Check + Start (Recommended) [DEFAULT]
echo   [3] Optimize Only
echo   [4] Exit
echo   [0] Auto Run (No menu, direct to option 2)
echo.
echo Or use direct commands:
echo   run.bat quick  - Ultra fast (no checks)
echo   run.bat dev    - Safe with checks
echo   run.bat auto   - Full check mode
echo   run.bat        - Direct to option 2 (default)
echo   run.bat menu   - Show this menu
echo.
set /p choice="Enter your choice (0-4) or press Enter for default [2]: "

if "%choice%"=="" set choice=2
if "%choice%"=="0" goto :auto_run
if "%choice%"=="1" goto :quick_start
if "%choice%"=="2" goto :full_check
if "%choice%"=="3" goto :optimize_only
if "%choice%"=="4" exit /b 0
echo Invalid choice. Using default option 2.
set choice=2
goto :full_check

:quick_mode
echo ==========================================
echo   XLab Web - Ultra Fast Mode
echo ==========================================
echo.
echo 🚀 Starting server immediately...
echo.

REM Kill existing processes and clean cache
taskkill /f /im node.exe >nul 2>&1
timeout /t 1 /nobreak >nul 2>&1
if exist ".next" rmdir /s /q .next >nul 2>&1

echo 🌐 Server will start at: http://localhost:3000
echo 🛑 Press Ctrl+C to stop
echo.
call npm run dev:simple
goto :end_no_pause

:dev_mode
echo ==========================================
echo   XLab Web - Development Mode
echo ==========================================
echo.
echo 🚀 Starting with environment checks...
echo.

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install from https://nodejs.org/
    pause
    exit /b 1
)

call npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found!
    pause
    exit /b 1
)

echo ✅ Environment OK

REM Kill existing processes and clean cache
echo 🛑 Stopping existing processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 1 /nobreak >nul 2>&1

echo 🧹 Cleaning cache...
if exist ".next" rmdir /s /q .next >nul 2>&1

echo 📦 Installing dependencies...
if not exist "node_modules\@radix-ui\react-slot\package.json" (
    call npm install @radix-ui/react-slot --silent >nul 2>&1
)

echo.
echo 🌐 Server will start at: http://localhost:3000
echo 🛑 Press Ctrl+C to stop
echo.
call npm run dev:simple
goto :end_no_pause

:auto_run
cls
echo ==========================================
echo   XLab Web - Auto Run Mode
echo ==========================================
echo.
echo Starting automatic setup and launch...
echo.
call :clean_cache
call :check_node_npm
call :install_deps
call :start_server
goto :end_no_pause

:quick_start
cls
echo ==========================================
echo   XLab Web - Quick Start
echo ==========================================
echo.
call :check_node_npm
call :install_deps
call :start_server
goto :end_no_pause

:full_check
cls
echo ==========================================
echo   XLab Web - Full Check + Start
echo ==========================================
echo.
call :clean_cache
call :check_node_npm
call :install_deps
call :start_server
goto :end_no_pause

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
goto :show_menu

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
call npm --version >nul 2>&1
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
    call npm install @radix-ui/react-slot --no-fund --no-audit --silent
    if errorlevel 1 (
        echo X Failed to install package
        pause
        exit /b 1
    )
    echo + Package installed
)
echo.
goto :eof

:kill_processes
echo Stopping any running development servers...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im "Next.js" >nul 2>&1

REM Kill processes using port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>&1
)

REM Wait for processes to fully terminate
timeout /t 2 /nobreak >nul 2>&1
goto :eof

:start_server
echo Starting development server...

REM Kill any existing processes first
call :kill_processes

REM Clean .next directory
if exist ".next" (
    rmdir /s /q .next >nul 2>&1
    if exist ".next" rd /s /q .next >nul 2>&1
)

echo + URL: http://localhost:3000
echo + Press Ctrl+C to stop
echo.
call npm run dev:simple
goto :eof

:clean_cache
echo Cleaning cache and temporary files...

REM Kill any existing Node.js processes
echo Stopping existing Node.js processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im "Next.js" >nul 2>&1

REM Wait a moment for processes to fully terminate
timeout /t 2 /nobreak >nul 2>&1

REM Force remove .next directory
if exist ".next" (
    echo Removing .next directory...
    rmdir /s /q .next >nul 2>&1
    if exist ".next" (
        echo Forcing removal of .next directory...
        rd /s /q .next >nul 2>&1
    )
)

REM Clean other cache directories
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache >nul 2>&1
if exist "*.temp" del /q *.temp >nul 2>&1
if exist "*.tmp" del /q *.tmp >nul 2>&1

echo + Cache cleaned
echo.
goto :eof

:type_check
echo Running TypeScript check...
call npx tsc --noEmit --skipLibCheck
if errorlevel 1 (
    echo ! TypeScript issues found - continuing anyway
) else (
    echo + TypeScript check passed
)
echo.
goto :eof

:lint_check
echo Running ESLint check...
call npx next lint --quiet --fix
if errorlevel 1 (
    echo ! ESLint issues found - continuing anyway
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

:end_no_pause
