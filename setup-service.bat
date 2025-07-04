@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Windows Service Setup
REM ========================================
REM Script cai dat Windows Service cho xlab.id.vn

title XLab Web - Service Setup

echo.
echo ================================================================
echo                    XLab Web Service Setup                         
echo                   Setup Windows Service                        
echo ================================================================
echo.

color 0D

REM Kiem tra admin privileges
net session >nul 2>&1
if errorlevel 1 (
    echo [ERROR] This script requires Administrator privileges!
    echo [INFO] Please run as Administrator
    echo.
    pause
    exit /b 1
)

echo [INFO] Administrator privileges confirmed
echo.

REM Lay duong dan hien tai
set "CURRENT_DIR=%~dp0"
set "SERVICE_NAME=XLabWebServer"
set "SERVICE_DISPLAY=XLab Web Server (xlab.id.vn)"
set "SERVICE_DESC=Production server for xlab.id.vn domain"

echo [INFO] Setting up Windows Service...
echo [INFO] Service Name: %SERVICE_NAME%
echo [INFO] Display Name: %SERVICE_DISPLAY%
echo [INFO] Description: %SERVICE_DESC%
echo [INFO] Working Directory: %CURRENT_DIR%
echo.

REM Kiem tra xem service da ton tai chua
sc query "%SERVICE_NAME%" >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Service already exists!
    echo [INFO] Stopping existing service...
    sc stop "%SERVICE_NAME%" >nul 2>&1
    timeout /t 3 >nul
    echo [INFO] Deleting existing service...
    sc delete "%SERVICE_NAME%" >nul 2>&1
    timeout /t 2 >nul
)

REM Tao service wrapper script
echo [INFO] Creating service wrapper script...
(
    echo @echo off
    echo cd /d "%CURRENT_DIR%"
    echo start.bat
) > service-wrapper.bat

REM Tao service voi sc command
echo [INFO] Creating Windows Service...
sc create "%SERVICE_NAME%" ^
    binPath= "\"%CURRENT_DIR%service-wrapper.bat\"" ^
    DisplayName= "%SERVICE_DISPLAY%" ^
    start= auto ^
    type= own

if errorlevel 1 (
    echo [ERROR] Failed to create service!
    pause
    exit /b 1
)

REM Set service description
sc description "%SERVICE_NAME%" "%SERVICE_DESC%"

REM Cau hinh service recovery
echo [INFO] Configuring service recovery options...
sc failure "%SERVICE_NAME%" reset= 86400 actions= restart/5000/restart/10000/restart/30000

echo [SUCCESS] Windows Service created successfully!
echo.

echo ================================================================
echo                        SERVICE INFORMATION                        
echo ================================================================
echo   Service Name:    %SERVICE_NAME%
echo   Display Name:    %SERVICE_DISPLAY%
echo   Description:     %SERVICE_DESC%
echo   Start Type:      Automatic
echo   Recovery:        Auto-restart on failure
echo   Working Dir:     %CURRENT_DIR%
echo ================================================================
echo.

echo [INFO] Service Management Commands:
echo.
echo   Start Service:   sc start "%SERVICE_NAME%"
echo   Stop Service:    sc stop "%SERVICE_NAME%"
echo   Delete Service:  sc delete "%SERVICE_NAME%"
echo   Query Service:   sc query "%SERVICE_NAME%"
echo.

set /p start_now="Do you want to start the service now? (y/n): "
if /i "%start_now%"=="y" (
    echo [INFO] Starting service...
    sc start "%SERVICE_NAME%"
    if errorlevel 1 (
        echo [ERROR] Failed to start service!
        echo [INFO] Check Windows Event Viewer for details
    ) else (
        echo [SUCCESS] Service started successfully!
        echo [INFO] Server should be running at http://localhost:3000
        echo [INFO] Domain: https://xlab.id.vn
    )
) else (
    echo [INFO] Service created but not started
    echo [INFO] You can start it later with: sc start "%SERVICE_NAME%"
)

echo.
echo [INFO] Service setup completed
echo [INFO] Check Windows Services (services.msc) to manage the service
echo.
echo [INFO] Press any key to exit...
pause >nul
