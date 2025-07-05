@echo off
title Cloudflare Tunnel Setup - XLab.id.vn

echo.
echo ================================================================
echo              Cloudflare Tunnel Setup for xlab.id.vn
echo ================================================================
echo.

echo [INFO] This script will help you setup a permanent Cloudflare Tunnel
echo.

echo STEP 1: Create Cloudflare Zero Trust Account
echo ----------------------------------------
echo 1. Go to: https://one.dash.cloudflare.com/
echo 2. Login/Register for Cloudflare account
echo 3. Select "Zero Trust" from dashboard
echo 4. Go to Networks → Tunnels
echo 5. Click "Create a tunnel"
echo 6. Choose "Cloudflared"
echo 7. Name your tunnel: xlab-tunnel
echo.

pause

echo.
echo STEP 2: Get Tunnel Token
echo ----------------------------------------
echo After creating tunnel, Cloudflare will show you a command like:
echo cloudflared.exe service install TOKEN_HERE
echo.
echo Please copy the TOKEN (long string after 'install')
echo.

set /p TUNNEL_TOKEN="Paste your tunnel token here: "

if "%TUNNEL_TOKEN%"=="" (
    echo [ERROR] Token is required!
    pause
    exit /b 1
)

echo.
echo [INFO] Creating tunnel configuration...

echo # Cloudflare Tunnel Configuration for xlab.id.vn > config.yml
echo tunnel: %TUNNEL_TOKEN% >> config.yml
echo credentials-file: C:\Users\%USERNAME%\.cloudflared\%TUNNEL_TOKEN%.json >> config.yml
echo >> config.yml
echo ingress: >> config.yml
echo   - hostname: xlab.id.vn >> config.yml
echo     service: http://localhost:80 >> config.yml
echo   - hostname: "*.xlab.id.vn" >> config.yml
echo     service: http://localhost:80 >> config.yml
echo   - service: http_status:404 >> config.yml

echo [SUCCESS] Configuration created: config.yml

echo.
echo STEP 3: Install Tunnel Service
echo ----------------------------------------
echo [INFO] Installing Cloudflare Tunnel as Windows service...

cloudflared.exe service install %TUNNEL_TOKEN%

if errorlevel 1 (
    echo [ERROR] Failed to install tunnel service!
    echo Make sure you have administrator privileges
    pause
    exit /b 1
)

echo [SUCCESS] Tunnel service installed!

echo.
echo STEP 4: Configure DNS in Cloudflare
echo ----------------------------------------
echo Now you need to add DNS records in Cloudflare dashboard:
echo.
echo 1. Go to Cloudflare dashboard → DNS → Records
echo 2. Add CNAME record:
echo    - Name: xlab.id.vn (or @)
echo    - Target: %TUNNEL_TOKEN%.cfargotunnel.com
echo    - Proxy status: Proxied (orange cloud)
echo.

pause

echo.
echo STEP 5: Start Tunnel
echo ----------------------------------------
echo [INFO] Starting Cloudflare Tunnel service...

net start cloudflared

if errorlevel 1 (
    echo [WARNING] Service might already be running
)

echo [SUCCESS] Tunnel should now be running!

echo.
echo ================================================================
echo                    SETUP COMPLETE!
echo ================================================================
echo.
echo Your website should now be accessible at:
echo   https://xlab.id.vn
echo.
echo To manage your tunnel:
echo   - Start: net start cloudflared
echo   - Stop: net stop cloudflared
echo   - Status: sc query cloudflared
echo.
echo Configuration file: config.yml
echo.

pause
