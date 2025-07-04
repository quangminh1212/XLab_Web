@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Deployment Script
REM ========================================
REM Script deploy len xlab.id.vn

title XLab Web - Deploy to xlab.id.vn

echo.
echo ================================================================
echo                    XLab Web - Deployment                         
echo                   Deploy to xlab.id.vn                        
echo ================================================================
echo.

color 0C

echo [INFO] Bat dau quy trinh deployment...
echo.

REM Kiem tra Node.js
echo [INFO] Kiem tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js chua duoc cai dat!
    pause
    exit /b 1
)

REM Kiem tra package.json
if not exist "package.json" (
    echo [ERROR] Khong tim thay package.json!
    pause
    exit /b 1
)

echo [INFO] Deployment Options:
echo.
echo ================================================================
echo                       DEPLOYMENT MENU                        
echo ================================================================
echo   1. Build va tao file deployment                     
echo   2. Tao file .env.production                             
echo   3. Export static files (next export)                     
echo   4. Tao archive deployment                     
echo   5. Huong dan upload len server                             
echo   0. Quay lai menu chinh                                                 
echo ================================================================
echo.

set /p deploy_choice="Nhap lua chon deployment (0-5): "

if "%deploy_choice%"=="1" (
    echo [INFO] Building production va tao file deployment...
    echo.
    
    REM Xoa build cu
    if exist ".next" (
        echo [INFO] Xoa build cu...
        rmdir /s /q ".next" 2>nul
    )
    
    REM Build production
    echo [INFO] Building production...
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Build that bai!
        pause
        exit /b 1
    )
    
    echo [SUCCESS] Build thanh cong!
    echo [INFO] Files da san sang trong thu muc .next
    
) else if "%deploy_choice%"=="2" (
    echo [INFO] Tao file .env.production...
    (
        echo NEXTAUTH_SECRET=Cmjb/lPYHoCnsiaEh0KwFkGG7POh6v3S3DXm169y8+U=
        echo NEXTAUTH_URL=https://xlab.id.vn
        echo GOOGLE_CLIENT_ID=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com
        echo GOOGLE_CLIENT_SECRET=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
        echo ADMIN_EMAILS=xlab.rnd@gmail.com
        echo NODE_ENV=production
    ) > .env.production
    echo [SUCCESS] Da tao file .env.production
    echo [INFO] File nay can duoc upload len server
    
) else if "%deploy_choice%"=="3" (
    echo [INFO] Export static files...
    echo [WARNING] Next.js app nay su dung server-side features
    echo [WARNING] Static export co the khong hoat dong day du
    echo.
    set /p confirm="Ban co muon tiep tuc? (y/n): "
    if /i "!confirm!"=="y" (
        call npm run build
        if errorlevel 1 (
            echo [ERROR] Build that bai!
            pause
            exit /b 1
        )
        echo [SUCCESS] Static export hoan tat
        echo [INFO] Files trong thu muc out/
    )
    
) else if "%deploy_choice%"=="4" (
    echo [INFO] Tao archive deployment...
    
    REM Tao thu muc deployment
    if not exist "deployment" mkdir "deployment"
    
    REM Copy cac file can thiet
    echo [INFO] Copy files can thiet...
    if exist ".next" (
        xcopy ".next" "deployment\.next" /E /I /Y >nul 2>&1
    )
    if exist "public" (
        xcopy "public" "deployment\public" /E /I /Y >nul 2>&1
    )
    copy "package.json" "deployment\" >nul 2>&1
    copy "next.config.js" "deployment\" >nul 2>&1
    if exist ".env.production" (
        copy ".env.production" "deployment\.env.local" >nul 2>&1
    )
    
    echo [SUCCESS] Da tao thu muc deployment
    echo [INFO] Thu muc deployment chua tat ca file can thiet
    echo [INFO] Ban co the nen thanh file zip va upload len server
    
) else if "%deploy_choice%"=="5" (
    echo [INFO] Huong dan upload len server:
    echo.
    echo ================================================================
    echo                    HUONG DAN DEPLOYMENT                        
    echo ================================================================
    echo.
    echo 1. Build production:
    echo    - Chay option 1 de build
    echo.
    echo 2. Tao file environment:
    echo    - Chay option 2 de tao .env.production
    echo.
    echo 3. Upload len server:
    echo    - Upload thu muc .next/
    echo    - Upload thu muc public/
    echo    - Upload package.json
    echo    - Upload next.config.js
    echo    - Upload .env.production thanh .env.local
    echo.
    echo 4. Tren server chay:
    echo    - npm install --production
    echo    - npm run start
    echo.
    echo 5. Cau hinh web server (Nginx/Apache):
    echo    - Proxy den http://localhost:3000
    echo    - Cau hinh SSL cho https://xlab.id.vn
    echo.
    echo 6. Domain xlab.id.vn:
    echo    - Da duoc cau hinh trong next.config.js
    echo    - NEXTAUTH_URL da duoc set thanh https://xlab.id.vn
    echo.
    echo ================================================================
    
) else if "%deploy_choice%"=="0" (
    echo [INFO] Quay lai menu chinh...
    exit /b 0
) else (
    echo [ERROR] Lua chon khong hop le!
    pause
    goto :eof
)

echo.
echo [INFO] Deployment script hoan tat. Nhan phim bat ky de thoat...
pause >nul
