@echo off
<<<<<<< HEAD
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
=======
setlocal EnableExtensions EnableDelayedExpansion

REM XLab Production Start Script (non-interactive)
REM - Loads .env.production if present
REM - Ensures production build exists
REM - Starts Next.js on HOST:PORT and auto-restarts on crash
REM - Logs to logs\app.log and logs\app.err

REM Change to script directory
cd /d "%~dp0"

REM Create logs directory if needed
if not exist logs mkdir logs

REM Log settings
set "LOG_DIR=logs"
set "MAX_LOG_SIZE=5242880"  REM 5 MB


REM Allow overriding PORT and HOST via args: start.bat [PORT] [HOST] [build]
set "FORCE_BUILD="
if /I "%~1"=="build" (
  set "FORCE_BUILD=1"
) else if not "%~1"=="" (
  set PORT=%~1
)
if /I "%~2"=="build" (
  set "FORCE_BUILD=1"
) else if not "%~2"=="" (
  set HOST=%~2
)
if /I "%~3"=="build" set "FORCE_BUILD=1"

REM Load environment from .env.production (simple KEY=VALUE parser)
if exist .env.production (
  for /f "usebackq tokens=1,* delims==" %%A in (".env.production") do (
    set "_k=%%A"
    set "_v=%%B"
    if not "!_k!"=="" (
      set "_first=!_k:~0,1!"
      if not "!_first!"=="#" if not "!_first!"==";" (
        set "!_k!=!_v!"
      )
    )
  )
)

if "%NODE_ENV%"=="" set NODE_ENV=production
if "%NEXT_TELEMETRY_DISABLED%"=="" set NEXT_TELEMETRY_DISABLED=1
if "%PORT%"=="" set PORT=3000
if "%HOST%"=="" set HOST=127.0.0.1

REM Echo summary
echo ================= XLab Production =================
echo NODE_ENV=%NODE_ENV%
echo HOST=%HOST% PORT=%PORT%
echo Working Dir: %cd%

REM Build a date stamp for daily log files (YYYY-MM-DD)
set "DATESTR=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%"
set "DATESTR=!DATESTR: =0!"
set "APP_LOG=%LOG_DIR%\app_!DATESTR!.log"
set "APP_ERR=%LOG_DIR%\app_!DATESTR!.err"

echo Logs: !APP_LOG!, !APP_ERR!
echo ===================================================

REM Build once if .next missing or FORCE_BUILD specified
if not exist .next if not defined FORCE_BUILD goto :skip_build

if defined FORCE_BUILD (
  echo Force rebuilding production bundle...
) else (
  echo Running production build (bundle missing)...
)
call npm run build 1>>"logs\build.log" 2>>"logs\build.err"

REM Simple size-based log rotation for today's logs
for %%F in ("!APP_LOG!" "!APP_ERR!") do (
  if exist %%F (
    for %%S in (%%~zF) do (
      if %%S GEQ %MAX_LOG_SIZE% (
        set "TS=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%_%TIME:~0,2%-%TIME:~3,2%-%TIME:~6,2%"
        set "TS=!TS: =0!"
        copy /y "%%F" "%LOG_DIR%\archive_!TS!_%%~nxF" >nul
        break > "%%F"
      )
    )
  )
)

if errorlevel 1 (
  echo Build failed. Check logs\build.err
  exit /b 1
)

:skip_build

:loop
  echo Starting Next.js server...
  REM Pass flags to next start via npm script
  call npm run start -- -p %PORT% -H %HOST% 1>>"!APP_LOG!" 2>>"!APP_ERR!"
  set "EXITCODE=%ERRORLEVEL%"
  echo [%DATE% %TIME%] Next.js exited with code %EXITCODE% >> "logs\restart.log"
  echo Restarting in 5 seconds... Press Ctrl+C to stop.
  timeout /t 5 /nobreak >nul
  goto loop

endlocal

>>>>>>> 836aa46eb38ed92fc8b3c0b605a38bcf8e44abea
