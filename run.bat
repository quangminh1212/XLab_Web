@echo off
title XLab Web - Production Mode (HTTPS)
echo.
echo ==========================================
echo    XLab Web - Production Mode
echo    Domain: https://xlab.id.vn
echo    Server: 1.52.110.251
echo ==========================================
echo.
echo 🚀 Khoi dong Production Mode tu dong...
echo 🔒 HTTPS: Enabled
echo 🌐 Domain: xlab.id.vn
echo.

goto prod_setup

:prod_setup
echo.
echo ==========================================
echo    Production Setup for xlab.id.vn
echo ==========================================
echo.
echo [1] Kiem tra Node.js version...
node --version
if errorlevel 1 (
    echo ❌ Node.js chua duoc cai dat!
    echo Vui long cai dat Node.js 18+ tu https://nodejs.org
    pause
    goto end
)
echo ✅ Node.js OK

echo [2] Sua loi SWC version mismatch...
call npm install @next/swc-win32-x64-msvc@15.2.4
echo ✅ SWC version fixed

echo [3] Kiem tra environment production...
if not exist ".env.production" (
    echo ❌ File .env.production khong ton tai!
    echo Vui long tao file .env.production voi cac bien moi truong can thiet.
    pause
    goto end
)
echo ✅ Environment production file found

echo [4] Copy environment cho production...
copy ".env.production" ".env.local" >nul
echo ✅ Da copy .env.production -> .env.local

echo [5] Cai dat dependencies (bao gom dev dependencies cho build)...
call npm ci
if errorlevel 1 (
    echo ❌ Loi khi cai dat dependencies!
    pause
    goto end
)
echo ✅ Dependencies installed

echo [6] Chuan bi i18n directories...
if not exist "src\i18n\eng\product" (
    mkdir "src\i18n\eng\product"
    echo Created directory: src\i18n\eng\product
)

echo [7] Copy product files...
if exist "src\i18n\vie\product\chatgpt.json" (
    copy "src\i18n\vie\product\chatgpt.json" "src\i18n\eng\product\chatgpt.json" >nul
)
if exist "src\i18n\vie\product\grok.json" (
    copy "src\i18n\vie\product\grok.json" "src\i18n\eng\product\grok.json" >nul
)
if exist "src\i18n\vie\product\index.ts" (
    copy "src\i18n\vie\product\index.ts" "src\i18n\eng\product\index.ts" >nul
)
echo ✅ Product files copied

echo [8] Fix common issues...
call node scripts/simple-fix.js 2>nul || (
    echo ⚠️  Simple fix script co loi, bo qua...
)
echo ✅ Common issues processed

echo [9] Fix ESLint errors...
call node scripts/fix-specific-errors.js 2>nul || (
    echo ⚠️  ESLint fix script co loi, bo qua...
)
echo ✅ ESLint errors processed

echo [10] Clear Next.js cache...
if exist ".next" (
    rd /s /q ".next"
)
echo ✅ Cache cleared

echo [11] Chay type checking...
tsc --version >nul 2>&1 || (
    echo ⚠️  TypeScript chua duoc cai dat globally, cai dat...
    call npm install -g typescript >nul 2>&1
)
call npm run type-check 2>nul || (
    echo ⚠️  Type checking co loi, tiep tuc build...
)
echo ✅ Type checking completed

echo [12] Chay linting...
call npm run lint 2>nul || (
    echo ⚠️  Linting co loi, tiep tuc build...
)
echo ✅ Linting completed

echo [13] Build ung dung cho production...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed!
    pause
    goto end
)
echo ✅ Build completed successfully

echo.
echo ==========================================
echo    🎉 PRODUCTION BUILD HOAN TAT!
echo ==========================================
echo.
echo 🌐 Domain: https://xlab.id.vn
echo 🔒 SSL: Required (HTTPS only)
echo 📦 Build: .next/ directory
echo ⚙️  Mode: Production
echo.
echo 📋 Cac buoc tiep theo:
echo 1. Upload source code len server (1.52.110.251)
echo 2. Chay script: sudo ./scripts/setup-xlab-id-vn.sh
echo 3. Cap nhat Google OAuth credentials cho domain moi
echo 4. Test website tai https://xlab.id.vn
echo.
echo 🚀 Khoi dong production server local de test...
echo 🌐 Local HTTPS simulation: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

cd %~dp0
npm run start
goto end





:end
echo.
echo Cam on ban da su dung XLab Web Tool!
pause