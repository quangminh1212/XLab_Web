@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

title XLab Web - Start Website (xlab.id.vn)

echo.
echo ================================================================
echo                    XLab Web - Start Website
echo                   Khoi dong xlab.id.vn
echo ================================================================
echo.

echo [INFO] Khoi dong website xlab.id.vn...
echo.

REM Kiem tra XLab Web Server
echo [1/3] Kiem tra XLab Web Server...
netstat -an | find "3000" >nul 2>&1
if errorlevel 1 (
    echo [INFO] XLab Web Server chua chay, dang khoi dong...
    start "XLab Web Server" /min cmd /c "start.bat"
    timeout /t 5 >nul
    
    REM Kiem tra lai
    netstat -an | find "3000" >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Khong the khoi dong XLab Web Server!
        pause
        exit /b 1
    )
    echo [SUCCESS] XLab Web Server da khoi dong
) else (
    echo [SUCCESS] XLab Web Server da dang chay
)
echo.

REM Kiem tra va khoi dong Nginx
echo [2/3] Kiem tra Nginx Reverse Proxy...
if exist "C:\nginx\nginx.exe" (
    netstat -an | find ":80 " >nul 2>&1
    if errorlevel 1 (
        echo [INFO] Nginx chua chay, dang khoi dong...
        start "Nginx" /min cmd /c "C:\nginx\start-nginx.bat"
        timeout /t 3 >nul
        
        REM Kiem tra lai
        netstat -an | find ":80 " >nul 2>&1
        if errorlevel 1 (
            echo [WARNING] Nginx khong khoi dong duoc
            echo [INFO] Website van hoat dong tren localhost:3000
        ) else (
            echo [SUCCESS] Nginx da khoi dong
        )
    ) else (
        echo [SUCCESS] Nginx da dang chay
    )
) else (
    echo [WARNING] Nginx chua duoc cai dat
    echo [INFO] Website chi hoat dong tren localhost:3000
)
echo.

REM Kiem tra ket qua
echo [3/3] Kiem tra trang thai website...
timeout /t 2 >nul

netstat -an | find "3000" >nul 2>&1
set XLAB_RUNNING=%errorlevel%

if exist "C:\nginx\nginx.exe" (
    netstat -an | find ":80 " >nul 2>&1
    set NGINX_RUNNING=%errorlevel%
) else (
    set NGINX_RUNNING=1
)

echo.
echo ================================================================
echo                    WEBSITE STATUS
echo ================================================================

if %XLAB_RUNNING% EQU 0 (
    echo [✅] XLab Web Server: RUNNING (port 3000)
) else (
    echo [❌] XLab Web Server: NOT RUNNING
)

if %NGINX_RUNNING% EQU 0 (
    echo [✅] Nginx Reverse Proxy: RUNNING (port 80)
) else (
    echo [⚠️] Nginx Reverse Proxy: NOT RUNNING
)

echo.
echo [INFO] Cac URL co the truy cap:
echo [INFO] - Local: http://localhost:3000

if %NGINX_RUNNING% EQU 0 (
    echo [INFO] - Domain: http://xlab.id.vn
    echo [INFO] - Local via Nginx: http://localhost
) else (
    echo [INFO] - Domain: http://xlab.id.vn:3000 (neu router da port forward)
)

echo.

if %XLAB_RUNNING% EQU 0 (
    if %NGINX_RUNNING% EQU 0 (
        echo [🎉] WEBSITE SAN SANG! Truy cap: http://xlab.id.vn
    ) else (
        echo [⚠️] Website hoat dong nhung can cai dat Nginx de truy cap domain
        echo [INFO] Chay install-nginx.ps1 voi quyen Administrator
    )
) else (
    echo [❌] Website khong hoat dong. Kiem tra lai XLab Web Server
)

echo ================================================================
echo.

pause
