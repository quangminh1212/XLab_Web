@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Nginx Reverse Proxy Setup
REM ========================================
REM Script tu dong cai dat va cau hinh Nginx cho xlab.id.vn

title XLab Web - Nginx Setup

echo.
echo ================================================================
echo                    XLab Web Nginx Setup
echo                   Reverse Proxy cho xlab.id.vn
echo ================================================================
echo.

REM Kiem tra quyen Administrator
net session >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Script nay can quyen Administrator!
    echo [INFO] Vui long chay "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo [SUCCESS] Dang chay voi quyen Administrator

REM Tao thu muc nginx
set NGINX_DIR=C:\nginx
if not exist "%NGINX_DIR%" (
    echo [INFO] Tao thu muc nginx...
    mkdir "%NGINX_DIR%" 2>nul
)

REM Kiem tra xem nginx da duoc cai dat chua
if exist "%NGINX_DIR%\nginx.exe" (
    echo [SUCCESS] Nginx da duoc cai dat
    goto :configure
)

echo [INFO] Dang tai va cai dat Nginx...
echo [INFO] Qua trinh nay co the mat vai phut...

REM Tai nginx (phien ban stable)
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'http://nginx.org/download/nginx-1.24.0.zip' -OutFile 'nginx.zip'}"

if not exist "nginx.zip" (
    echo [ERROR] Khong the tai Nginx!
    echo [INFO] Vui long kiem tra ket noi internet
    pause
    exit /b 1
)

echo [SUCCESS] Da tai Nginx

REM Giai nen nginx
echo [INFO] Giai nen Nginx...
powershell -Command "Expand-Archive -Path 'nginx.zip' -DestinationPath '.' -Force"

REM Di chuyen file nginx
if exist "nginx-1.24.0" (
    xcopy "nginx-1.24.0\*" "%NGINX_DIR%\" /E /I /Y >nul 2>&1
    rmdir /s /q "nginx-1.24.0" >nul 2>&1
)

del "nginx.zip" >nul 2>&1

if not exist "%NGINX_DIR%\nginx.exe" (
    echo [ERROR] Cai dat Nginx that bai!
    pause
    exit /b 1
)

echo [SUCCESS] Da cai dat Nginx

:configure
echo [INFO] Cau hinh Nginx cho xlab.id.vn...

REM Backup file config cu
if exist "%NGINX_DIR%\conf\nginx.conf" (
    copy "%NGINX_DIR%\conf\nginx.conf" "%NGINX_DIR%\conf\nginx.conf.backup" >nul 2>&1
)

REM Tao file config moi
echo [INFO] Tao file cau hinh nginx.conf...
(
echo worker_processes  1;
echo.
echo events {
echo     worker_connections  1024;
echo }
echo.
echo http {
echo     include       mime.types;
echo     default_type  application/octet-stream;
echo     sendfile        on;
echo     keepalive_timeout  65;
echo.
echo     # Upstream cho XLab Web
echo     upstream xlab_backend {
echo         server 127.0.0.1:3000;
echo     }
echo.
echo     # HTTP Server - Redirect to HTTPS
echo     server {
echo         listen       80;
echo         server_name  xlab.id.vn www.xlab.id.vn;
echo.
echo         # Temporary: Allow HTTP for testing
echo         location / {
echo             proxy_pass http://xlab_backend;
echo             proxy_http_version 1.1;
echo             proxy_set_header Upgrade $http_upgrade;
echo             proxy_set_header Connection 'upgrade';
echo             proxy_set_header Host $host;
echo             proxy_set_header X-Real-IP $remote_addr;
echo             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
echo             proxy_set_header X-Forwarded-Proto $scheme;
echo             proxy_cache_bypass $http_upgrade;
echo             proxy_read_timeout 86400;
echo         }
echo     }
echo.
echo     # HTTPS Server ^(will be configured later^)
echo     # server {
echo     #     listen       443 ssl;
echo     #     server_name  xlab.id.vn www.xlab.id.vn;
echo     #     
echo     #     ssl_certificate      cert.pem;
echo     #     ssl_certificate_key  cert.key;
echo     #     
echo     #     location / {
echo     #         proxy_pass http://xlab_backend;
echo     #         proxy_http_version 1.1;
echo     #         proxy_set_header Upgrade $http_upgrade;
echo     #         proxy_set_header Connection 'upgrade';
echo     #         proxy_set_header Host $host;
echo     #         proxy_set_header X-Real-IP $remote_addr;
echo     #         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
echo     #         proxy_set_header X-Forwarded-Proto https;
echo     #         proxy_cache_bypass $http_upgrade;
echo     #     }
echo     # }
echo }
) > "%NGINX_DIR%\conf\nginx.conf"

echo [SUCCESS] Da tao file cau hinh nginx.conf

REM Tao script khoi dong nginx
echo [INFO] Tao script khoi dong nginx...
(
echo @echo off
echo title Nginx for XLab Web
echo echo Starting Nginx for xlab.id.vn...
echo cd /d "%NGINX_DIR%"
echo nginx.exe
echo if errorlevel 1 ^(
echo     echo [ERROR] Nginx khong the khoi dong!
echo     pause
echo ^)
) > "%NGINX_DIR%\start-nginx.bat"

REM Tao script dung nginx
(
echo @echo off
echo title Stop Nginx
echo echo Stopping Nginx...
echo cd /d "%NGINX_DIR%"
echo nginx.exe -s quit
echo echo Nginx stopped.
echo timeout /t 2 >nul
) > "%NGINX_DIR%\stop-nginx.bat"

echo [SUCCESS] Da tao cac script quan ly

echo.
echo ================================================================
echo                    NGINX SETUP COMPLETE
echo ================================================================
echo   Location: %NGINX_DIR%
echo   Config:   %NGINX_DIR%\conf\nginx.conf
echo   Start:    %NGINX_DIR%\start-nginx.bat
echo   Stop:     %NGINX_DIR%\stop-nginx.bat
echo   Domain:   xlab.id.vn ^(HTTP port 80^)
echo   Backend:  localhost:3000
echo ================================================================
echo.

echo [SUCCESS] Nginx da duoc cai dat va cau hinh cho xlab.id.vn!
echo [INFO] De khoi dong Nginx, chay: %NGINX_DIR%\start-nginx.bat
echo [INFO] De dung Nginx, chay: %NGINX_DIR%\stop-nginx.bat
echo.
pause
