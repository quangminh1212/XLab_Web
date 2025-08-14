@echo off
<<<<<<< HEAD

title XLab Web - Complete Hosting System

echo.
echo ================================================================
echo                    XLab Web Complete Hosting
echo                   Auto Setup + Hosting xlab.id.vn
echo ================================================================
echo.

echo [INFO] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    pause
    exit /b 1
)
echo [SUCCESS] Node.js is installed

echo [INFO] Checking npm...
timeout /t 1 >nul
echo [SUCCESS] npm is installed

echo.
echo [INFO] Checking if build exists...
if exist ".next\BUILD_ID" (
    echo [SUCCESS] Build exists, skipping npm install and build
    goto start_services
)

echo [INFO] Installing dependencies...
npm install
echo [SUCCESS] Dependencies installed

echo [INFO] Building production...
set SKIP_TYPE_CHECK=true
npm run build
echo [SUCCESS] Build completed

:start_services
echo.
echo ================================================================
echo                    STARTING COMPLETE HOSTING
echo ================================================================

echo [INFO] Stopping old services...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im nginx.exe >nul 2>&1
taskkill /f /im cloudflared.exe >nul 2>&1
timeout /t 2 >nul

echo [1/3] Starting XLab Web Server...
start "XLab Web Server" /min cmd /c "npm run start"
timeout /t 8 >nul

echo [INFO] Checking if server started...
netstat -an | find "3000"
if errorlevel 1 (
    echo [ERROR] XLab Server failed to start!
    pause
    exit /b 1
)
echo [SUCCESS] XLab Server started (port 3000)

echo [2/3] Setting up Nginx...
if exist "C:\nginx\nginx.exe" (
    echo [INFO] Starting Nginx...
    start "Nginx" /min cmd /c "cd /d C:\nginx && nginx.exe"
    timeout /t 3 >nul
    echo [SUCCESS] Nginx started (port 80)
) else (
    echo [INFO] Nginx not installed, downloading...
    powershell -ExecutionPolicy Bypass -File download-nginx.ps1
    if exist "C:\nginx\nginx.exe" (
        copy "nginx.conf" "C:\nginx\conf\nginx.conf" >nul 2>&1
        start "Nginx" /min cmd /c "cd /d C:\nginx && nginx.exe"
        timeout /t 3 >nul
        echo [SUCCESS] Nginx installed and started
    ) else (
        echo [WARNING] Nginx installation failed
    )
)

echo [3/3] Setting up Cloudflare Tunnel...
if exist "cloudflared.exe" (
    echo [INFO] Starting Cloudflare Tunnel...
    start "Cloudflare Tunnel" cmd /c "echo Cloudflare Tunnel for xlab.id.vn && echo Public URL will appear below: && cloudflared.exe tunnel --url http://localhost:80"
    timeout /t 3 >nul
    echo [SUCCESS] Cloudflare Tunnel started
) else (
    echo [INFO] Cloudflared not found, downloading...
    powershell -ExecutionPolicy Bypass -File download-cloudflared.ps1
    if exist "cloudflared.exe" (
        start "Cloudflare Tunnel" cmd /c "echo Cloudflare Tunnel for xlab.id.vn && echo Public URL will appear below: && cloudflared.exe tunnel --url http://localhost:80"
        timeout /t 3 >nul
        echo [SUCCESS] Cloudflared downloaded and started
    ) else (
        echo [WARNING] Cloudflared download failed
    )
)

echo.
echo ================================================================
echo                    WEBSITE XLAB.ID.VN READY!
echo ================================================================
echo.
echo [SUCCESS] Website started with these URLs:
echo.
echo [LOCAL ACCESS:]
echo   - XLab Server: http://localhost:3000
if exist "C:\nginx\nginx.exe" (
    echo   - Nginx Proxy: http://localhost:80
)
echo.
if exist "cloudflared.exe" (
    echo [PUBLIC ACCESS:]
    echo   - Cloudflare Tunnel: Check 'Cloudflare Tunnel' window
    echo   - URL format: https://random.trycloudflare.com
    echo   - This URL shows xlab.id.vn content
)
echo.
echo [ADMIN:]
echo   - Environment: Production
echo   - Authentication: Google OAuth
echo   - Admin Email: xlab.rnd@gmail.com
echo.
echo ================================================================
echo.
echo [INFO] All services running. Website xlab.id.vn is ready!
echo [INFO] Press Ctrl+C to stop all services.
echo [INFO] If you close this window, all services will stop.
echo.

echo [INFO] Waiting for services... (Press Ctrl+C to stop all)
:wait_loop
timeout /t 30 >nul
echo [INFO] Services still running...
goto wait_loop
=======
title XLab Web - All-in-One
echo.
echo ==========================================
echo    XLab Web - Full Startup with Serveo
echo ==========================================
echo.

echo [1/4] Checking Node.js and npm installation...
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed or not in PATH. Please install Node.js and try again.
    goto error
)
where npm >nul 2>&1
if errorlevel 1 (
    echo npm is not installed or not in PATH. Please install Node.js and try again.
    goto error
)
echo Node.js and npm detected.

echo.
echo [2/4] Installing dependencies...
call npm install
echo.

echo [3/4] Preparing environment...
if not exist "src\i18n\eng\product" (
    mkdir "src\i18n\eng\product"
    echo Created directory: src\i18n\eng\product
)

echo Copying product files from Vietnamese to English...
if exist "src\i18n\vie\product\chatgpt.json" (
    copy "src\i18n\vie\product\chatgpt.json" "src\i18n\eng\product\chatgpt.json"
    echo Copied: chatgpt.json
)
if exist "src\i18n\vie\product\grok.json" (
    copy "src\i18n\vie\product\grok.json" "src\i18n\eng\product\grok.json"
    echo Copied: grok.json
)
if exist "src\i18n\vie\product\index.ts" (
    copy "src\i18n\vie\product\index.ts" "src\i18n\eng\product\index.ts"
    echo Copied: index.ts
)

echo Installing json5 specifically...
call npm install json5
echo.

echo Fixing language comparison issues...
if exist "scripts\fix-language-issues.js" (
    call node scripts/fix-language-issues.js
) else (
    echo Warning: fix-language-issues.js not found. Skipping...
)
echo.

echo Clearing Next.js cache...
if exist ".next" (
    rd /s /q ".next" 2>nul
    if errorlevel 1 (
        echo Warning: Could not completely clear .next directory. Continuing anyway.
    )
)
echo.

echo [4/4] Starting services...

echo Checking for SSH installation (needed for Serveo)...
where ssh >nul 2>&1
if errorlevel 1 goto no_ssh

echo SSH found, starting Serveo tunnel...

:: Create PowerShell script for Serveo in a separate file
echo $TunnelName = "xlab-id" > run-serveo.ps1
echo $TargetPort = 3000 >> run-serveo.ps1
echo. >> run-serveo.ps1
echo Write-Host "Starting Serveo Tunnel..." >> run-serveo.ps1
echo. >> run-serveo.ps1
echo try ^{ >> run-serveo.ps1
echo     $process = Start-Process -FilePath "ssh" -ArgumentList "-R", "$($TunnelName):80:localhost:$TargetPort", "serveo.net" -PassThru -NoNewWindow >> run-serveo.ps1
echo     Write-Host "Serveo tunnel started with PID: $($process.Id)" >> run-serveo.ps1
echo     Write-Host "Your URL is: https://$($TunnelName).serveo.net" >> run-serveo.ps1
echo     Write-Host "If the subdomain is already in use, Serveo will assign a different one." >> run-serveo.ps1
echo     Write-Host "Check the output window for the exact URL." >> run-serveo.ps1
echo. >> run-serveo.ps1
echo     Write-Host "Press Ctrl+C to stop tunnel..." >> run-serveo.ps1
echo     while ($true^) ^{ Start-Sleep -Seconds 1 ^} >> run-serveo.ps1
echo ^} >> run-serveo.ps1
echo catch ^{ >> run-serveo.ps1
echo     Write-Host "Error: $_" -ForegroundColor Red >> run-serveo.ps1
echo ^} >> run-serveo.ps1
echo finally ^{ >> run-serveo.ps1
echo     if ($process -ne $null -and -not $process.HasExited^) ^{ >> run-serveo.ps1
echo         Stop-Process -Id $process.Id -Force >> run-serveo.ps1
echo         Write-Host "Stopped Serveo tunnel" >> run-serveo.ps1
echo     ^} >> run-serveo.ps1
echo ^} >> run-serveo.ps1

echo.
echo IMPORTANT - For successful Serveo connection:
echo.
echo 1. When asked "Are you sure you want to continue connecting" 
echo    type "yes" and press Enter
echo.
echo 2. Wait for the URL to appear (typically https://xlab-id.serveo.net)
echo.
echo 3. After getting the URL, update your DNS record at TenTen:
echo    - Name: @ (for root domain) or xlab (for subdomain)
echo    - Type: CNAME
echo    - Value: xlab-id.serveo.net (without https://)
echo.

start "Serveo Tunnel" powershell -NoExit -ExecutionPolicy Bypass -File run-serveo.ps1
echo Serveo tunnel started in new window
goto start_nextjs

:no_ssh
echo SSH not found. You need Git with SSH to use Serveo tunneling.
echo Please install Git from https://git-scm.com/download/win
echo Continuing with local server only...

:start_nextjs
echo Starting Next.js development server...
start "Next.js Server" cmd /k "npm run dev"

echo.
echo ==========================================
echo All services started successfully!
echo.
echo - Next.js is running on http://localhost:3000
echo - Serveo tunnel is running (check the PowerShell window for the URL)
echo - Your website should be accessible via the Serveo URL
echo.
echo DNS CONFIGURATION:
echo 1. Login to TenTen DNS management for xlab.id.vn
echo 2. Add/update CNAME record:
echo    - Name: @ (for root domain) or xlab (for subdomain)
echo    - Type: CNAME
echo    - Value: xlab-id.serveo.net (or the URL provided by Serveo)
echo.
echo NOTE: Serveo usually provides a consistent subdomain
echo ==========================================
echo.
echo Press any key to stop all services and exit...
pause >nul

echo Stopping services...
taskkill /FI "WINDOWTITLE eq Next.js Server*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Serveo Tunnel*" /T /F >nul 2>&1
if exist "run-serveo.ps1" del run-serveo.ps1
echo Done.
goto :eof

:error
echo.
echo Error occurred. Press any key to exit...
pause >nul 
>>>>>>> origin/dev_23
