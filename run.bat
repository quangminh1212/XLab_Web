@echo off
echo ==== XLab Web Application Runner ====
echo.

if "%1"=="--update" (
  echo Auto-updating Next.js to the latest version before starting...
  call .\auto-update-nextjs.bat
  goto :start_app
)

if "%1"=="--check" (
  call .\check-nextjs-version.bat
  exit /b
)

echo Checking and updating dependencies...
call npm install

:start_app
echo.
echo Verifying installed versions:
call npx next --version
call node -e "console.log('React: ' + require('react').version)"

echo.
echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.

if "%1"=="--debug" (
  echo Debug mode: capturing all output to debug.log
  call npm run dev:debug > debug.log 2>&1
) else if "%1"=="--update" (
  echo Running with updated Next.js version...
  call npm run dev
) else (
  echo Normal mode: redirecting errors to app.log
  call npm run dev 2> app.log
)

IF ERRORLEVEL 1 (
  echo.
  echo Primary method failed, trying alternative method...
  call npm run dev
  
  IF ERRORLEVEL 1 (
    echo.
    echo Error: Failed to start the development server.
    echo Checking for common issues...
    
    echo 1. Verifying node_modules directory...
    if not exist node_modules (
      echo node_modules not found. Reinstalling dependencies...
      call npm install
      echo Trying to start server again...
      call npm run dev
    ) else (
      echo Cleaning cache and trying again...
      call npm cache clean --force
      call npm run dev
    )
  )
)

echo.
echo To run with different options:
echo   run.bat --update  : Update Next.js to latest version and run
echo   run.bat --debug   : Run with detailed logging
echo   run.bat --check   : Check installed and available versions
echo. 