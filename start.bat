@echo off
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


REM Allow overriding PORT and HOST via args: start.bat [PORT] [HOST]
if not "%~1"=="" set PORT=%~1
if not "%~2"=="" set HOST=%~2

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
echo Logs: logs\app.log, logs\app.err
echo ===================================================

REM Build once if .next missing
if not exist .next (
  echo Running production build...
  call npm run build 1>>"logs\build.log" 2>>"logs\build.err"

REM Simple size-based log rotation (app.log and app.err)
for %%F in ("%LOG_DIR%\app.log" "%LOG_DIR%\app.err") do (
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
)

:loop
  echo Starting Next.js server...
  REM Pass flags to next start via npm script
  call npm run start -- -p %PORT% -H %HOST% 1>>"logs\app.log" 2>>"logs\app.err"
  set "EXITCODE=%ERRORLEVEL%"
  echo [%DATE% %TIME%] Next.js exited with code %EXITCODE% >> "logs\restart.log"
  echo Restarting in 5 seconds... Press Ctrl+C to stop.
  timeout /t 5 /nobreak >nul
  goto loop

endlocal

