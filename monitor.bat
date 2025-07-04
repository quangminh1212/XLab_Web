@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Server Monitor
REM ========================================
REM Script monitor server xlab.id.vn

title XLab Web - Server Monitor

echo.
echo ================================================================
echo                    XLab Web Server Monitor                         
echo                   Monitor xlab.id.vn Status                        
echo ================================================================
echo.

color 0E

:monitor_loop

REM Lay thoi gian hien tai
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

cls
echo.
echo ================================================================
echo                    XLab Web Server Monitor                         
echo                   Monitor xlab.id.vn Status                        
echo ================================================================
echo.
echo [%timestamp%] Checking server status...
echo.

REM Kiem tra port 3000
echo [INFO] Checking port 3000...
netstat -an | find ":3000" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Port 3000 is NOT listening
    echo [ERROR] Server may be down!
    echo.
    echo [ACTION] Attempting to restart server...
    echo [INFO] Starting start.bat...
    start "" /min start.bat
    echo [INFO] Server restart initiated
) else (
    echo [SUCCESS] Port 3000 is listening
)

REM Kiem tra process Node.js
echo [INFO] Checking Node.js processes...
tasklist /fi "imagename eq node.exe" 2>nul | find "node.exe" >nul
if errorlevel 1 (
    echo [WARNING] No Node.js processes found
) else (
    echo [SUCCESS] Node.js processes are running
)

REM Kiem tra ket noi localhost
echo [INFO] Testing localhost connection...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 >temp_status.txt 2>nul
if exist temp_status.txt (
    set /p status_code=<temp_status.txt
    del temp_status.txt >nul 2>&1
    if "!status_code!"=="200" (
        echo [SUCCESS] Server responding with HTTP 200
    ) else if "!status_code!"=="000" (
        echo [ERROR] Server not responding
    ) else (
        echo [WARNING] Server responding with HTTP !status_code!
    )
) else (
    echo [WARNING] Could not test connection (curl not available)
)

REM Hien thi thong tin server
echo.
echo ================================================================
echo                        SERVER STATUS                        
echo ================================================================
echo   Domain: xlab.id.vn
echo   Local: http://localhost:3000
echo   Environment: Production
echo   Timestamp: %timestamp%
echo ================================================================
echo.

REM Hien thi log files gan nhat
echo [INFO] Recent log files:
if exist "logs\*.log" (
    for /f %%i in ('dir /b /o-d logs\*.log 2^>nul') do (
        echo   - logs\%%i
        goto :show_one_log
    )
    :show_one_log
) else (
    echo   - No log files found
)

echo.
echo [INFO] Press Ctrl+C to stop monitoring
echo [INFO] Next check in 30 seconds...
echo.

REM Cho 30 giay truoc khi check tiep
timeout /t 30 >nul

goto monitor_loop
