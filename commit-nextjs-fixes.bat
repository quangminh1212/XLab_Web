@echo off
echo ============================================================
echo Committing Next.js fixes to Git repository
echo ============================================================

REM Check if git is available
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Git is not installed or not in the PATH!
  echo Please add the new files to your repository manually:
  echo - fix-nextjs.js
  echo - fix-nextjs.bat
  echo - Updated .gitignore
  pause
  exit /b 1
)

REM Add files to git
git add fix-nextjs.js fix-nextjs.bat .gitignore

REM Commit changes
git commit -m "feat: integrated Next.js fix script with log file gitignore handling"

if %ERRORLEVEL% NEQ 0 (
  echo Error committing changes!
  pause
  exit /b 1
)

echo ============================================================
echo Changes committed successfully
echo ============================================================
pause 