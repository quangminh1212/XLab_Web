@echo off
chcp 65001 >nul 2>&1

echo [DEBUG] Testing npm command...
echo [DEBUG] Running: npm --version

timeout /t 1 >nul

npm --version

echo [DEBUG] npm command completed with exit code: %errorlevel%

if errorlevel 1 (
    echo [ERROR] npm failed
) else (
    echo [SUCCESS] npm worked
)

echo [DEBUG] Testing node command...
node --version

echo [DEBUG] node command completed with exit code: %errorlevel%

pause
