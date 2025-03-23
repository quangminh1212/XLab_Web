@echo off
echo ==== XLab Web Application Runner ====
echo.

echo Checking and updating dependencies...
call npm install

echo.
echo Ensuring latest Next.js version...
call npm install next@latest react@latest react-dom@latest eslint-config-next@latest --save

echo.
echo Verifying installed versions:
call npx next --version
call node -e "console.log('React: ' + require('react').version)"

echo.
echo Starting XLab_Web development server with the latest Next.js...
echo Press Ctrl+C to stop the server when finished.

if "%1"=="--debug" (
  echo Debug mode: capturing all output to debug.log
  call npm run dev:debug > debug.log 2>&1
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