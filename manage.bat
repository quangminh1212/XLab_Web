@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Server Management Console
REM ========================================
REM Script quan ly tong hop server xlab.id.vn

title XLab Web - Management Console

:main_menu
cls
echo.
echo ================================================================
echo                    XLab Web Management Console                         
echo                   Server Management for xlab.id.vn                        
echo ================================================================
echo.

color 0F

REM Lay thoi gian hien tai
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

echo [%timestamp%] XLab Web Server Management
echo.

REM Kiem tra trang thai server nhanh
netstat -an | find ":3000" >nul 2>&1
if errorlevel 1 (
    set "server_status=OFFLINE"
    set "status_color=0C"
) else (
    set "server_status=ONLINE"
    set "status_color=0A"
)

echo ================================================================
echo                        SERVER STATUS                        
echo ================================================================
echo   Domain:         xlab.id.vn
echo   Local URL:      http://localhost:3000
echo   Status:         %server_status%
echo   Timestamp:      %timestamp%
echo ================================================================
echo.

echo ================================================================
echo                        MANAGEMENT MENU                        
echo ================================================================
echo.
echo   HOSTING OPERATIONS:
echo   1. Start Production Server (start.bat)
echo   2. Restart Server (restart.bat)
echo   3. Stop Server (kill all Node.js)
echo   4. Server Status Check (status.bat)
echo   5. Monitor Server (monitor.bat)
echo.
echo   MAINTENANCE:
echo   6. Clean Cache and Rebuild (clean.bat)
echo   7. Update Dependencies (npm install)
echo   8. Build Production (npm run build)
echo   9. View Recent Logs
echo.
echo   DEVELOPMENT:
echo  10. Development Mode (start-dev.bat)
echo  11. Deploy Tools (deploy.bat)
echo  12. Type Check (npm run type-check)
echo  13. Lint Code (npm run lint)
echo.
echo   SYSTEM:
echo  14. Install Windows Service (setup-service.bat)
echo  15. Open Project in Explorer
echo  16. Open Logs Folder
echo.
echo   0. Exit
echo.
echo ================================================================
echo.

set /p choice="Select option (0-16): "

if "%choice%"=="1" (
    echo [INFO] Starting production server...
    start "XLab Production Server" start.bat
    echo [SUCCESS] Server started in new window
    timeout /t 3 >nul
    goto main_menu
    
) else if "%choice%"=="2" (
    echo [INFO] Restarting server...
    call restart.bat
    timeout /t 3 >nul
    goto main_menu
    
) else if "%choice%"=="3" (
    echo [INFO] Stopping all Node.js processes...
    taskkill /f /im node.exe >nul 2>&1
    if errorlevel 1 (
        echo [INFO] No Node.js processes to stop
    ) else (
        echo [SUCCESS] Stopped all Node.js processes
    )
    timeout /t 2 >nul
    goto main_menu
    
) else if "%choice%"=="4" (
    echo [INFO] Checking server status...
    call status.bat
    goto main_menu
    
) else if "%choice%"=="5" (
    echo [INFO] Starting server monitor...
    start "XLab Server Monitor" monitor.bat
    echo [SUCCESS] Monitor started in new window
    timeout /t 2 >nul
    goto main_menu
    
) else if "%choice%"=="6" (
    echo [INFO] Cleaning cache and rebuilding...
    call clean.bat
    timeout /t 3 >nul
    goto main_menu
    
) else if "%choice%"=="7" (
    echo [INFO] Updating dependencies...
    call npm install
    echo [INFO] Dependencies update completed
    timeout /t 3 >nul
    goto main_menu
    
) else if "%choice%"=="8" (
    echo [INFO] Building production...
    set SKIP_TYPE_CHECK=true
    call npm run build
    echo [INFO] Production build completed
    timeout /t 3 >nul
    goto main_menu
    
) else if "%choice%"=="9" (
    echo [INFO] Recent log files:
    echo.
    if exist "logs\*.log" (
        for /f %%i in ('dir /b /o-d logs\*.log 2^>nul') do (
            echo   - logs\%%i
            echo     Size: 
            for %%j in ("logs\%%i") do echo     %%~zj bytes
            echo     Modified: 
            for %%j in ("logs\%%i") do echo     %%~tj
            echo.
            goto :show_one_log
        )
        :show_one_log
        echo [INFO] Open logs folder? (y/n)
        set /p open_logs=
        if /i "!open_logs!"=="y" (
            start explorer logs
        )
    ) else (
        echo   - No log files found
    )
    echo.
    pause
    goto main_menu
    
) else if "%choice%"=="10" (
    echo [INFO] Starting development mode...
    start "XLab Development" start-dev.bat
    echo [SUCCESS] Development mode started in new window
    timeout /t 2 >nul
    goto main_menu
    
) else if "%choice%"=="11" (
    echo [INFO] Opening deployment tools...
    call deploy.bat
    goto main_menu
    
) else if "%choice%"=="12" (
    echo [INFO] Running type check...
    call npm run type-check
    echo [INFO] Type check completed
    timeout /t 3 >nul
    goto main_menu
    
) else if "%choice%"=="13" (
    echo [INFO] Running lint...
    call npm run lint
    echo [INFO] Lint completed
    timeout /t 3 >nul
    goto main_menu
    
) else if "%choice%"=="14" (
    echo [INFO] Installing Windows Service...
    echo [WARNING] This requires Administrator privileges
    pause
    call setup-service.bat
    goto main_menu
    
) else if "%choice%"=="15" (
    echo [INFO] Opening project folder...
    start explorer .
    timeout /t 1 >nul
    goto main_menu
    
) else if "%choice%"=="16" (
    echo [INFO] Opening logs folder...
    if not exist "logs" mkdir "logs"
    start explorer logs
    timeout /t 1 >nul
    goto main_menu
    
) else if "%choice%"=="0" (
    echo [INFO] Exiting management console...
    exit /b 0
    
) else (
    echo [ERROR] Invalid option!
    timeout /t 2 >nul
    goto main_menu
)
