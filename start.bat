@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Windows Development Starter
REM ========================================
REM Script tich hop de khoi dong moi truong development tren Windows

title XLab Web - Development Environment

echo.
echo ================================================================
echo                    XLab Web Development
echo                   Windows Starter Script
echo ================================================================
echo.

REM Mau sac cho Windows
color 0A

REM Kiem tra Node.js
echo [INFO] Kiem tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js chua duoc cai dat!
    echo [INFO] Vui long tai va cai dat Node.js tu: https://nodejs.org/
    pause
    exit /b 1
)
echo [SUCCESS] Node.js da duoc cai dat

REM Kiem tra npm
echo [INFO] Kiem tra npm...
call npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm chua duoc cai dat!
    pause
    exit /b 1
)
echo [SUCCESS] npm da duoc cai dat

REM Hien thi thong tin he thong
echo [INFO] Thong tin he thong:
for /f "tokens=*" %%i in ('node --version 2^>nul') do echo - Node.js: %%i
for /f "tokens=1" %%i in ('npm --version 2^>nul') do echo - npm: %%i
echo - OS: Windows
echo - Mode: Development
echo.

REM Kiem tra thu muc du an
if not exist "package.json" (
    echo [ERROR] Khong tim thay package.json!
    echo [INFO] Vui long chay script nay trong thu muc goc cua du an.
    pause
    exit /b 1
)
echo [SUCCESS] Tim thay package.json

REM Tao thu muc can thiet
echo [INFO] Tao thu muc can thiet...
if not exist "src\i18n\eng\product" mkdir "src\i18n\eng\product" 2>nul
if not exist "src\i18n\vie\product" mkdir "src\i18n\vie\product" 2>nul
if not exist ".next\cache" mkdir ".next\cache" 2>nul
echo [SUCCESS] Da tao thu muc can thiet

REM Sao chep file i18n neu can
echo [INFO] Kiem tra file i18n...
if exist "src\i18n\vie\product\index.ts" (
    if not exist "src\i18n\eng\product\index.ts" (
        copy "src\i18n\vie\product\index.ts" "src\i18n\eng\product\index.ts" >nul 2>&1
        echo [SUCCESS] Da sao chep file i18n
    )
)

REM Kiem tra file .env.local
echo [INFO] Kiem tra file environment...
if not exist ".env.local" (
    echo [INFO] Tao file .env.local...
    (
        echo NEXTAUTH_SECRET=Cmjb/lPYHoCnsiaEh0KwFkGG7POh6v3S3DXm169y8+U=
        echo NEXTAUTH_URL=http://localhost:3000
        echo GOOGLE_CLIENT_ID=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com
        echo GOOGLE_CLIENT_SECRET=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
        echo ADMIN_EMAILS=xlab.rnd@gmail.com
        echo NODE_ENV=development
    ) > .env.local
    echo [SUCCESS] Da tao file .env.local
) else (
    echo [SUCCESS] File .env.local da ton tai
)

REM Kiem tra node_modules
if not exist "node_modules" (
    echo [INFO] Cai dat dependencies...
    echo [INFO] Dieu nay co the mat vai phut...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Loi khi cai dat dependencies!
        echo [INFO] Thu chay: npm cache clean --force
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies da duoc cai dat
) else (
    echo [SUCCESS] Dependencies da ton tai
)

REM Chay fix scripts
echo [INFO] Chay fix scripts...
if exist "scripts\fix-next-errors.js" (
    call node scripts\fix-next-errors.js
    echo [SUCCESS] Da chay fix-next-errors.js
)

if exist "scripts\fix-language-issues.js" (
    call node scripts\fix-language-issues.js
    echo [SUCCESS] Da chay fix-language-issues.js
)

REM Xoa cache Next.js
echo [INFO] Xoa cache Next.js...
if exist ".next" (
    rmdir /s /q ".next" 2>nul
    echo [SUCCESS] Da xoa cache Next.js
)

REM Hien thi menu lua chon
echo.
echo ================================================================
echo                        MENU LUA CHON
echo ================================================================
echo   1. Development Server (npm run dev)
echo   2. Development voi Logger (npm run dev:log)
echo   3. Build Production (npm run build)
echo   4. Start Production (npm run start)
echo   5. Lint Code (npm run lint)
echo   6. Type Check (npm run type-check)
echo   7. Clean Cache (clean.bat)
echo   8. Project Info
echo   9. Quick Build (build.bat)
echo   0. Thoat
echo ================================================================
echo.

set /p choice="Nhap lua chon cua ban (0-9): "

if "%choice%"=="1" (
    echo [INFO] Khoi dong Development Server...
    echo [INFO] Ung dung se chay tai: http://localhost:3000
    echo [INFO] Nhan Ctrl+C de dung server
    echo.
    call npm run dev
) else if "%choice%"=="2" (
    echo [INFO] Khoi dong Development Server voi Logger...
    echo [INFO] Ung dung se chay tai: http://localhost:3000
    echo [INFO] Nhan Ctrl+C de dung server
    echo.
    call npm run dev:log
) else if "%choice%"=="3" (
    echo [INFO] Build Production...
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Build that bai!
    ) else (
        echo [SUCCESS] Build thanh cong!
    )
) else if "%choice%"=="4" (
    echo [INFO] Start Production...
    echo [INFO] Ung dung se chay tai: http://localhost:3000
    echo [INFO] Nhan Ctrl+C de dung server
    echo.
    call npm run start
) else if "%choice%"=="5" (
    echo [INFO] Lint Code...
    call npm run lint
) else if "%choice%"=="6" (
    echo [INFO] Type Check...
    call npm run type-check
) else if "%choice%"=="7" (
    echo [INFO] Clean Cache...
    call clean.bat
) else if "%choice%"=="8" (
    echo [INFO] Project Information:
    echo.
    echo Project: XLab Web
    echo Platform: Windows Development
    echo Framework: Next.js 15.2.4
    echo Language: TypeScript 5.3.3
    echo Styling: Tailwind CSS 3.4.0
    echo.
    echo Available Scripts:
    echo - start.bat: Main development script
    echo - build.bat: Quick production build
    echo - clean.bat: Clean cache and temp files
    echo.
    echo Repository: https://github.com/quangminh1212/XLab_Web
    echo.
) else if "%choice%"=="9" (
    echo [INFO] Quick Build...
    call build.bat
) else if "%choice%"=="0" (
    echo [INFO] Thoat...
    exit /b 0
) else (
    echo [ERROR] Lua chon khong hop le!
    pause
    goto :eof
)

REM Giu cua so mo neu co loi
if errorlevel 1 (
    echo.
    echo [ERROR] Co loi xay ra. Nhan phim bat ky de thoat...
    pause >nul
)

echo.
echo [INFO] Script hoan tat. Nhan phim bat ky de thoat...
pause >nul