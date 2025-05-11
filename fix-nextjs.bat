@echo off
echo ============================================================
echo Running integrated Next.js fix script
echo ============================================================
node fix-nextjs.js
if %ERRORLEVEL% NEQ 0 (
  echo Error running fix script!
  pause
  exit /b 1
)
echo ============================================================
echo Fixes completed! Restart the Next.js application to apply changes.
echo ============================================================
pause 