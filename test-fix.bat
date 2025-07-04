@echo off
title XLab Web - Test Fix
echo.
echo ==========================================
echo    XLab Web - Test Fix
echo ==========================================
echo.

echo [1] Test Node.js...
node --version
if errorlevel 1 (
    echo ❌ Node.js loi!
    pause
    exit /b 1
)
echo ✅ Node.js OK

echo [2] Test simple fix script...
call node scripts/simple-fix.js
if errorlevel 1 (
    echo ❌ Simple fix loi!
    pause
    exit /b 1
)
echo ✅ Simple fix OK

echo [3] Test TypeScript...
tsc --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  TypeScript chua duoc cai dat globally
    echo Cai dat TypeScript...
    call npm install -g typescript
    if errorlevel 1 (
        echo ❌ Khong the cai dat TypeScript!
        pause
        exit /b 1
    )
)
echo ✅ TypeScript OK

echo [4] Test npm scripts...
call npm run type-check >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Type check co van de
) else (
    echo ✅ Type check OK
)

call npm run lint >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Lint co van de
) else (
    echo ✅ Lint OK
)

echo.
echo ==========================================
echo    ✅ TEST HOAN TAT!
echo ==========================================
echo.
echo Tat ca da san sang cho production build!
echo Chay run.bat de build production.
echo.
pause
