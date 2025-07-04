@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - SSL Certificate Setup
REM ========================================
REM Script tu dong cai dat SSL certificate cho xlab.id.vn

title XLab Web - SSL Setup

echo.
echo ================================================================
echo                    XLab Web SSL Setup
echo                   SSL Certificate cho xlab.id.vn
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

set NGINX_DIR=C:\nginx
set SSL_DIR=%NGINX_DIR%\ssl

REM Kiem tra nginx
if not exist "%NGINX_DIR%\nginx.exe" (
    echo [ERROR] Nginx chua duoc cai dat!
    echo [INFO] Vui long chay setup-nginx.bat truoc
    pause
    exit /b 1
)

REM Tao thu muc SSL
if not exist "%SSL_DIR%" (
    mkdir "%SSL_DIR%" 2>nul
)

echo [INFO] Lua chon phuong thuc SSL:
echo [INFO] 1. Self-signed certificate (de test)
echo [INFO] 2. Let's Encrypt certificate (production)
echo [INFO] 3. Import existing certificate
echo.
set /p SSL_CHOICE="Chon lua chon (1-3): "

if "%SSL_CHOICE%"=="1" goto :self_signed
if "%SSL_CHOICE%"=="2" goto :lets_encrypt
if "%SSL_CHOICE%"=="3" goto :import_cert

echo [ERROR] Lua chon khong hop le!
pause
exit /b 1

:self_signed
echo [INFO] Tao self-signed certificate...

REM Tai OpenSSL neu chua co
if not exist "openssl.exe" (
    echo [INFO] Tai OpenSSL...
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://slproweb.com/download/Win64OpenSSL_Light-3_1_1.exe' -OutFile 'openssl-installer.exe'}"
    
    if exist "openssl-installer.exe" (
        echo [INFO] Vui long cai dat OpenSSL va chay lai script nay
        start openssl-installer.exe
        pause
        exit /b 1
    )
)

REM Tao private key
openssl genrsa -out "%SSL_DIR%\xlab.key" 2048

REM Tao certificate signing request
(
echo VN
echo Ha Noi
echo Ha Noi
echo XLab Technologies
echo IT Department
echo xlab.id.vn
echo xlab.rnd@gmail.com
echo.
echo.
) | openssl req -new -key "%SSL_DIR%\xlab.key" -out "%SSL_DIR%\xlab.csr"

REM Tao self-signed certificate
openssl x509 -req -days 365 -in "%SSL_DIR%\xlab.csr" -signkey "%SSL_DIR%\xlab.key" -out "%SSL_DIR%\xlab.crt"

echo [SUCCESS] Da tao self-signed certificate
goto :configure_nginx

:lets_encrypt
echo [INFO] Cai dat Let's Encrypt certificate...
echo [WARNING] Tinh nang nay can domain da tro ve IP cong cong
echo [INFO] Dang tai Certbot...

REM Tai certbot
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://dl.eff.org/certbot-beta-installer-win32.exe' -OutFile 'certbot-installer.exe'}"

if exist "certbot-installer.exe" (
    echo [INFO] Vui long cai dat Certbot va chay lenh sau:
    echo certbot certonly --standalone -d xlab.id.vn -d www.xlab.id.vn
    start certbot-installer.exe
    pause
    exit /b 1
)

goto :configure_nginx

:import_cert
echo [INFO] Import existing certificate...
echo [INFO] Vui long copy cac file certificate vao thu muc: %SSL_DIR%
echo [INFO] Ten file can thiet:
echo [INFO] - xlab.crt (certificate file)
echo [INFO] - xlab.key (private key file)
pause
goto :configure_nginx

:configure_nginx
echo [INFO] Cau hinh Nginx voi SSL...

REM Backup config cu
copy "%NGINX_DIR%\conf\nginx.conf" "%NGINX_DIR%\conf\nginx.conf.backup" >nul 2>&1

REM Tao config moi voi SSL
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
echo         location / {
echo             return 301 https://$server_name$request_uri;
echo         }
echo     }
echo.
echo     # HTTPS Server
echo     server {
echo         listen       443 ssl;
echo         server_name  xlab.id.vn www.xlab.id.vn;
echo.
echo         ssl_certificate      ssl/xlab.crt;
echo         ssl_certificate_key  ssl/xlab.key;
echo         ssl_session_cache    shared:SSL:1m;
echo         ssl_session_timeout  5m;
echo         ssl_ciphers  HIGH:!aNULL:!MD5;
echo         ssl_prefer_server_ciphers  on;
echo.
echo         location / {
echo             proxy_pass http://xlab_backend;
echo             proxy_http_version 1.1;
echo             proxy_set_header Upgrade $http_upgrade;
echo             proxy_set_header Connection 'upgrade';
echo             proxy_set_header Host $host;
echo             proxy_set_header X-Real-IP $remote_addr;
echo             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
echo             proxy_set_header X-Forwarded-Proto https;
echo             proxy_cache_bypass $http_upgrade;
echo             proxy_read_timeout 86400;
echo         }
echo     }
echo }
) > "%NGINX_DIR%\conf\nginx.conf"

echo [SUCCESS] Da cau hinh Nginx voi SSL

echo.
echo ================================================================
echo                    SSL SETUP COMPLETE
echo ================================================================
echo   SSL Directory: %SSL_DIR%
echo   Certificate:   %SSL_DIR%\xlab.crt
echo   Private Key:   %SSL_DIR%\xlab.key
echo   Domain:        https://xlab.id.vn
echo   HTTP Redirect: Enabled
echo ================================================================
echo.

echo [SUCCESS] SSL certificate da duoc cau hinh cho xlab.id.vn!
echo [INFO] Restart Nginx de ap dung cau hinh moi
echo.
pause
