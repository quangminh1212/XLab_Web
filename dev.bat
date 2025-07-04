@echo off
title XLab Web - Development Mode
echo.
echo ==========================================
echo    XLab Web - Development Mode
echo    Local: http://localhost:3000
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
call npm install @next/swc-win32-x64-msvc@15.2.4 --no-audit --no-fund --silent
echo ✅ SWC version fixed

echo [3] Cai dat dependencies...
call npm install --no-audit --no-fund --silent
if errorlevel 1 (
    echo ❌ Loi khi cai dat dependencies!
    pause
    goto end
)
echo ✅ Dependencies installed

echo [4] Chuan bi i18n directories...
if not exist "src\i18n\eng\product" (
    mkdir "src\i18n\eng\product"
    echo Created directory: src\i18n\eng\product
)

echo [5] Copy product files...
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

echo [6] Fix language issues...
call node scripts/fix-language-issues.js
echo ✅ Language issues fixed

echo [7] Clear Next.js cache...
if exist ".next" (
    rd /s /q ".next"
)
echo ✅ Cache cleared

echo [8] Kiem tra environment variables...
if not exist ".env.local" (
    echo ⚠️  File .env.local khong ton tai!
    if exist ".env.example" (
        copy ".env.example" ".env.local"
        echo ✅ Da tao .env.local tu .env.example
        echo ⚠️  Vui long cap nhat cac bien moi truong trong .env.local
    )
)
echo ✅ Environment checked

echo.
echo ==========================================
echo    🚀 KHOI DONG DEVELOPMENT SERVER
echo ==========================================
echo.
echo 🌐 Local: http://localhost:3000
echo 🌐 Network: http://192.168.1.x:3000
echo ⚙️  Mode: Development
echo 🔄 Hot Reload: Enabled
echo.
echo Press Ctrl+C to stop the server
echo.

cd %~dp0
.\node_modules\.bin\next dev -p 3000

:end
echo.
echo Cam on ban da su dung XLab Web Development!
pause
