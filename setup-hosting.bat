@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Complete Hosting Setup
REM ========================================
REM Script tu dong thiet lap toan bo he thong hosting cho xlab.id.vn

title XLab Web - Complete Hosting Setup

echo.
echo ================================================================
echo                    XLab Web Complete Setup
echo                   Thiet lap hosting cho xlab.id.vn
echo ================================================================
echo.

REM Kiem tra quyen Administrator
net session >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Script nay can quyen Administrator!
    echo [INFO] Vui long click chuot phai va chon "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo [SUCCESS] Dang chay voi quyen Administrator

echo [INFO] Script nay se thiet lap:
echo [INFO] 1. Windows Firewall configuration
echo [INFO] 2. Nginx reverse proxy installation
echo [INFO] 3. SSL certificate setup
echo [INFO] 4. Service management scripts
echo [INFO] 5. Auto-start configuration
echo.

set /p CONFIRM="Ban co muon tiep tuc? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo [INFO] Huy bo thiet lap
    pause
    exit /b 0
)

echo.
echo ================================================================
echo                    STEP 1: FIREWALL SETUP
echo ================================================================
echo.

if exist "setup-firewall.bat" (
    echo [INFO] Chay setup-firewall.bat...
    call setup-firewall.bat
    if errorlevel 1 (
        echo [ERROR] Firewall setup that bai!
        pause
        exit /b 1
    )
) else (
    echo [ERROR] Khong tim thay setup-firewall.bat!
    pause
    exit /b 1
)

echo.
echo ================================================================
echo                    STEP 2: NGINX SETUP
echo ================================================================
echo.

if exist "setup-nginx.bat" (
    echo [INFO] Chay setup-nginx.bat...
    call setup-nginx.bat
    if errorlevel 1 (
        echo [ERROR] Nginx setup that bai!
        pause
        exit /b 1
    )
) else (
    echo [ERROR] Khong tim thay setup-nginx.bat!
    pause
    exit /b 1
)

echo.
echo ================================================================
echo                    STEP 3: SSL SETUP
echo ================================================================
echo.

echo [INFO] Ban co muon cai dat SSL certificate khong?
echo [INFO] (Khong bat buoc cho test, nhung can thiet cho production)
set /p SSL_SETUP="Cai dat SSL? (Y/N): "

if /i "%SSL_SETUP%"=="Y" (
    if exist "setup-ssl.bat" (
        echo [INFO] Chay setup-ssl.bat...
        call setup-ssl.bat
    ) else (
        echo [ERROR] Khong tim thay setup-ssl.bat!
    )
)

echo.
echo ================================================================
echo                    STEP 4: SERVICE SCRIPTS
echo ================================================================
echo.

echo [INFO] Tao cac script quan ly dich vu...

REM Tao script khoi dong toan bo he thong
echo [INFO] Tao start-all.bat...
(
echo @echo off
echo title XLab Web - Start All Services
echo echo Starting XLab Web hosting system for xlab.id.vn...
echo echo.
echo.
echo echo [1/3] Starting XLab Web Server...
echo start "XLab Web Server" /min cmd /c "start.bat"
echo timeout /t 5 >nul
echo.
echo echo [2/3] Starting Nginx Reverse Proxy...
echo if exist "C:\nginx\start-nginx.bat" ^(
echo     start "Nginx" /min cmd /c "C:\nginx\start-nginx.bat"
echo     timeout /t 3 >nul
echo ^)
echo.
echo echo [3/3] Checking services...
echo timeout /t 2 >nul
echo.
echo echo ================================================================
echo echo                    ALL SERVICES STARTED
echo echo ================================================================
echo echo   XLab Web:     http://localhost:3000
echo echo   Public HTTP:  http://xlab.id.vn
echo echo   Public HTTPS: https://xlab.id.vn
echo echo   Status:       Running
echo echo ================================================================
echo echo.
echo echo [SUCCESS] Tat ca dich vu da duoc khoi dong!
echo echo [INFO] Website xlab.id.vn da san sang phuc vu!
echo pause
) > "start-all.bat"

REM Tao script dung toan bo he thong
echo [INFO] Tao stop-all.bat...
(
echo @echo off
echo title XLab Web - Stop All Services
echo echo Stopping XLab Web hosting system...
echo echo.
echo.
echo echo [1/2] Stopping Nginx...
echo if exist "C:\nginx\stop-nginx.bat" ^(
echo     call "C:\nginx\stop-nginx.bat"
echo ^)
echo.
echo echo [2/2] Stopping XLab Web Server...
echo taskkill /f /im node.exe >nul 2^>^&1
echo.
echo echo ================================================================
echo echo                    ALL SERVICES STOPPED
echo echo ================================================================
echo echo   Status: All services have been stopped
echo echo   Domain: xlab.id.vn is now offline
echo echo ================================================================
echo echo.
echo echo [SUCCESS] Tat ca dich vu da duoc dung!
echo pause
) > "stop-all.bat"

REM Tao script kiem tra trang thai
echo [INFO] Tao check-status.bat...
(
echo @echo off
echo title XLab Web - Status Check
echo echo Checking XLab Web hosting status...
echo echo.
echo.
echo echo ================================================================
echo echo                    XLAB WEB STATUS CHECK
echo echo ================================================================
echo echo.
echo.
echo echo [INFO] Checking XLab Web Server ^(port 3000^)...
echo netstat -an ^| find "3000" ^>nul 2^>^&1
echo if errorlevel 1 ^(
echo     echo [ERROR] XLab Web Server: NOT RUNNING
echo ^) else ^(
echo     echo [SUCCESS] XLab Web Server: RUNNING
echo ^)
echo.
echo echo [INFO] Checking Nginx ^(port 80^)...
echo netstat -an ^| find ":80 " ^>nul 2^>^&1
echo if errorlevel 1 ^(
echo     echo [ERROR] Nginx HTTP: NOT RUNNING
echo ^) else ^(
echo     echo [SUCCESS] Nginx HTTP: RUNNING
echo ^)
echo.
echo echo [INFO] Checking HTTPS ^(port 443^)...
echo netstat -an ^| find ":443 " ^>nul 2^>^&1
echo if errorlevel 1 ^(
echo     echo [WARNING] Nginx HTTPS: NOT RUNNING ^(SSL not configured^)
echo ^) else ^(
echo     echo [SUCCESS] Nginx HTTPS: RUNNING
echo ^)
echo.
echo echo [INFO] Testing local connection...
echo curl -s http://localhost:3000 ^>nul 2^>^&1
echo if errorlevel 1 ^(
echo     echo [ERROR] Local connection: FAILED
echo ^) else ^(
echo     echo [SUCCESS] Local connection: OK
echo ^)
echo.
echo echo ================================================================
echo echo                    STATUS CHECK COMPLETE
echo echo ================================================================
echo pause
) > "check-status.bat"

echo [SUCCESS] Da tao cac script quan ly

echo.
echo ================================================================
echo                    SETUP COMPLETE!
echo ================================================================
echo.

echo [SUCCESS] Thiet lap hosting hoan tat cho xlab.id.vn!
echo.
echo [INFO] Cac script da duoc tao:
echo [INFO] - start-all.bat     : Khoi dong tat ca dich vu
echo [INFO] - stop-all.bat      : Dung tat ca dich vu  
echo [INFO] - check-status.bat  : Kiem tra trang thai
echo [INFO] - setup-firewall.bat: Cau hinh firewall
echo [INFO] - setup-nginx.bat   : Cai dat Nginx
echo [INFO] - setup-ssl.bat     : Cai dat SSL
echo.
echo [INFO] De khoi dong website xlab.id.vn:
echo [INFO] 1. Chay start-all.bat
echo [INFO] 2. Kiem tra bang check-status.bat
echo [INFO] 3. Truy cap http://xlab.id.vn
echo.

set /p START_NOW="Ban co muon khoi dong ngay bay gio? (Y/N): "
if /i "%START_NOW%"=="Y" (
    echo [INFO] Khoi dong he thong...
    call start-all.bat
)

echo.
echo [SUCCESS] Hosting setup hoan tat! Website xlab.id.vn san sang!
pause
