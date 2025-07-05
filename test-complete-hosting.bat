@echo off
title XLab Web - Test Complete Hosting

echo.
echo ================================================================
echo                    XLab Web - Test Complete Hosting
echo                   Kiem tra he thong hosting hoan chinh
echo ================================================================
echo.

echo [INFO] Kiem tra cac thanh phan da duoc cai dat...
echo.

REM Kiem tra Node.js
echo [1/6] Node.js:
node --version >nul 2>&1
if errorlevel 1 (
    echo [❌] CHUA CAI DAT
) else (
    for /f "tokens=*" %%i in ('node --version 2^>nul') do echo [✅] %%i
)

REM Kiem tra npm
echo [2/6] npm:
npm --version >nul 2>&1
if errorlevel 1 (
    echo [❌] CHUA CAI DAT
) else (
    for /f "tokens=*" %%i in ('npm --version 2^>nul') do echo [✅] %%i
)

REM Kiem tra Next.js build
echo [3/6] Next.js Production Build:
if exist ".next\BUILD_ID" (
    echo [✅] DA BUILD
) else (
    echo [⚠️] CHUA BUILD (se tu dong build khi chay start.bat)
)

REM Kiem tra Nginx
echo [4/6] Nginx:
if exist "C:\nginx\nginx.exe" (
    echo [✅] DA CAI DAT
) else (
    echo [⚠️] CHUA CAI DAT (se tu dong cai dat khi chay start.bat)
)

REM Kiem tra Cloudflared
echo [5/6] Cloudflared:
if exist "cloudflared.exe" (
    echo [✅] DA TAI
) else (
    echo [⚠️] CHUA TAI (se tu dong tai khi chay start.bat)
)

REM Kiem tra DNS
echo [6/6] DNS Configuration:
nslookup xlab.id.vn | find "1.52.110.251" >nul 2>&1
if errorlevel 1 (
    echo [⚠️] DNS chua dung hoac chua cap nhat
) else (
    echo [✅] DNS DA DUNG (xlab.id.vn -> 1.52.110.251)
)

echo.
echo ================================================================
echo                    KET QUA KIEM TRA
echo ================================================================
echo.

REM Dem so thanh phan san sang
set READY_COUNT=0

node --version >nul 2>&1
if not errorlevel 1 set /a READY_COUNT+=1

npm --version >nul 2>&1
if not errorlevel 1 set /a READY_COUNT+=1

if exist ".next\BUILD_ID" set /a READY_COUNT+=1
if exist "C:\nginx\nginx.exe" set /a READY_COUNT+=1
if exist "cloudflared.exe" set /a READY_COUNT+=1

nslookup xlab.id.vn | find "1.52.110.251" >nul 2>&1
if not errorlevel 1 set /a READY_COUNT+=1

echo [INFO] Thanh phan san sang: %READY_COUNT%/6
echo.

if %READY_COUNT% GEQ 2 (
    echo [✅] HE THONG SAN SANG!
    echo [INFO] Co the chay start.bat de khoi dong website xlab.id.vn
    echo.
    echo [INFO] Cac thanh phan con thieu se duoc tu dong cai dat
    echo [INFO] khi chay start.bat lan dau tien.
) else (
    echo [❌] HE THONG CHUA SAN SANG
    echo [INFO] Can cai dat Node.js va npm truoc khi chay start.bat
    echo [INFO] Tai Node.js tu: https://nodejs.org/
)

echo.
echo ================================================================
echo                    HUONG DAN SU DUNG
echo ================================================================
echo.

echo [KHOI DONG WEBSITE:]
echo   1. Chay: start.bat
echo   2. Doi 2-5 phut de he thong tu dong cai dat va khoi dong
echo   3. Kiem tra cac URL duoc hien thi
echo.

echo [CAC URL SAU KHI KHOI DONG:]
echo   - Local XLab: http://localhost:3000
echo   - Local Nginx: http://localhost:80
echo   - Cloudflare Tunnel: https://[random].trycloudflare.com
echo   - (Tunnel URL se duoc hien thi trong cua so Cloudflare)
echo.

echo [DUNG WEBSITE:]
echo   - Nhan Ctrl+C trong cua so start.bat
echo   - Hoac dong cua so start.bat
echo.

echo [TINH NANG MOI:]
echo   ✅ Tu dong cai dat Nginx reverse proxy
echo   ✅ Tu dong cai dat Cloudflare Tunnel
echo   ✅ Tu dong tao URL public cho xlab.id.vn
echo   ✅ Khong can cau hinh router
echo   ✅ HTTPS tu dong qua Cloudflare
echo.

pause
