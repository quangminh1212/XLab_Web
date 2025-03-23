@echo off
echo Checking for dependencies...
npm install

echo Ensuring latest Next.js version...
call npm install next@latest react@latest react-dom@latest --save

echo Starting XLab_Web development server...
echo Press Ctrl+C to stop the server when finished.
if "%1"=="--debug" (
  echo Debug mode: capturing all output to debug.log
  npm run dev:debug > debug.log 2>&1
) else (
  echo Normal mode: redirecting errors to app.log
  npm run dev 2> app.log
)

IF ERRORLEVEL 1 (
  echo.
  echo Primary method failed, trying alternative method...
  npm run dev
) 