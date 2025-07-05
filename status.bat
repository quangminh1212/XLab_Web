@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Server Status Check
REM ========================================
REM Script kiem tra trang thai server xlab.id.vn

title XLab Web - Server Status

echo.
echo ================================================================
echo                    XLab Web Server Status                         
echo                   Check xlab.id.vn Status                        
echo ================================================================
echo.

color 0A

REM Lay thoi gian hien tai
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

echo [%timestamp%] Checking server status...
echo.

REM Kiem tra Node.js
echo [CHECK 1/7] Node.js Installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not installed
    set "node_status=ERROR"
) else (
    for /f "tokens=*" %%i in ('node --version') do set "node_version=%%i"
    echo [SUCCESS] Node.js !node_version! installed
    set "node_status=OK"
)

REM Kiem tra npm
echo [CHECK 2/7] npm Installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm not installed
    set "npm_status=ERROR"
) else (
    for /f "tokens=1" %%i in ('npm --version') do set "npm_version=%%i"
    echo [SUCCESS] npm !npm_version! installed
    set "npm_status=OK"
)

REM Kiem tra project files
echo [CHECK 3/7] Project Files...
if not exist "package.json" (
    echo [ERROR] package.json not found
    set "project_status=ERROR"
) else if not exist "next.config.js" (
    echo [ERROR] next.config.js not found
    set "project_status=ERROR"
) else (
    echo [SUCCESS] Project files found
    set "project_status=OK"
)

REM Kiem tra dependencies
echo [CHECK 4/7] Dependencies...
if not exist "node_modules" (
    echo [ERROR] node_modules not found
    set "deps_status=ERROR"
) else (
    echo [SUCCESS] Dependencies installed
    set "deps_status=OK"
)

REM Kiem tra build
echo [CHECK 5/7] Production Build...
if not exist ".next\BUILD_ID" (
    echo [WARNING] Production build not found
    set "build_status=WARNING"
) else (
    echo [SUCCESS] Production build exists
    set "build_status=OK"
)

REM Kiem tra port 3000
echo [CHECK 6/7] Port 3000 Status...
netstat -an | find ":3000" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Port 3000 not listening
    set "port_status=WARNING"
) else (
    echo [SUCCESS] Port 3000 is listening
    set "port_status=OK"
)

REM Kiem tra server response
echo [CHECK 7/7] Server Response...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 >temp_status.txt 2>nul
if exist temp_status.txt (
    set /p status_code=<temp_status.txt
    del temp_status.txt >nul 2>&1
    if "!status_code!"=="200" (
        echo [SUCCESS] Server responding with HTTP 200
        set "server_status=OK"
    ) else if "!status_code!"=="000" (
        echo [ERROR] Server not responding
        set "server_status=ERROR"
    ) else (
        echo [WARNING] Server responding with HTTP !status_code!
        set "server_status=WARNING"
    )
) else (
    echo [INFO] Cannot test (curl not available)
    set "server_status=UNKNOWN"
)

echo.
echo ================================================================
echo                        STATUS SUMMARY                        
echo ================================================================
echo   Node.js:        %node_status%
echo   npm:            %npm_status%
echo   Project Files:  %project_status%
echo   Dependencies:   %deps_status%
echo   Build:          %build_status%
echo   Port 3000:      %port_status%
echo   Server:         %server_status%
echo ================================================================
echo   Domain:         xlab.id.vn
echo   Local URL:      http://localhost:3000
echo   Environment:    Production
echo   Timestamp:      %timestamp%
echo ================================================================
echo.

REM Hien thi log files
echo [INFO] Recent log files:
if exist "logs\*.log" (
    echo.
    for /f %%i in ('dir /b /o-d logs\*.log 2^>nul ^| head -5') do (
        echo   - logs\%%i
    )
) else (
    echo   - No log files found
)

echo.
echo [INFO] Running processes:
tasklist /fi "imagename eq node.exe" 2>nul | find "node.exe" >nul
if errorlevel 1 (
    echo   - No Node.js processes running
) else (
    echo   - Node.js processes found:
    tasklist /fi "imagename eq node.exe" | findstr "node.exe"
)

echo.
echo ================================================================
echo                        QUICK ACTIONS                        
echo ================================================================
echo   start.bat    - Start production server
echo   restart.bat  - Restart server
echo   monitor.bat  - Monitor server continuously
echo   clean.bat    - Clean cache and rebuild
echo ================================================================
echo.
echo [INFO] Status check completed
echo [INFO] Press any key to exit...
pause >nul
