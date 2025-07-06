@echo off
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