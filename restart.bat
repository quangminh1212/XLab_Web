@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Server Restart
REM ========================================
REM Script restart server xlab.id.vn

title XLab Web - Server Restart

echo.
echo ================================================================
echo                    XLab Web Server Restart                         
echo                   Restart xlab.id.vn Server                        
echo ================================================================
echo.

color 0C

REM Lay thoi gian hien tai
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

echo [%timestamp%] Starting server restart process...
echo.

REM Dung tat ca Node.js processes
echo [INFO] Stopping all Node.js processes...
taskkill /f /im node.exe >nul 2>&1
if errorlevel 1 (
    echo [INFO] No Node.js processes to stop
) else (
    echo [SUCCESS] Stopped Node.js processes
)

REM Cho 3 giay
echo [INFO] Waiting 3 seconds...
timeout /t 3 >nul

REM Kiem tra port 3000 co con bi chiem khong
echo [INFO] Checking if port 3000 is free...
netstat -an | find ":3000" >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Port 3000 still in use, waiting...
    timeout /t 5 >nul
)

REM Xoa cache Next.js
echo [INFO] Clearing Next.js cache...
if exist ".next" (
    rmdir /s /q ".next" 2>nul
    echo [SUCCESS] Cleared Next.js cache
)

REM Tao log entry
if not exist "logs" mkdir "logs"
set LOG_FILE=logs\restart-%YYYY%%MM%%DD%-%HH%%Min%%Sec%.log
echo [%timestamp%] Server restart initiated > "%LOG_FILE%"
echo [%timestamp%] Stopped Node.js processes >> "%LOG_FILE%"
echo [%timestamp%] Cleared cache >> "%LOG_FILE%"

echo.
echo [INFO] ========================================
echo [INFO] RESTARTING XLAB.ID.VN SERVER
echo [INFO] ========================================
echo [INFO] Timestamp: %timestamp%
echo [INFO] Log file: %LOG_FILE%
echo [INFO] ========================================
echo.

REM Khoi dong lai server
echo [INFO] Starting production server...
echo [%timestamp%] Starting production server >> "%LOG_FILE%"

REM Chay start.bat trong cua so moi
start "XLab Production Server" start.bat

echo [SUCCESS] Server restart initiated
echo [INFO] New server window should open
echo [INFO] Check the new window for server status
echo.

echo [INFO] Restart process completed
echo [INFO] Log saved to: %LOG_FILE%
echo.
echo [INFO] Press any key to exit...
pause >nul
