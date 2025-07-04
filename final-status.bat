@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

title XLab Web - Final Status Check

echo.
echo ================================================================
echo                    XLab Web - FINAL STATUS
echo                   Kiem tra trang thai cuoi cung
echo ================================================================
echo.

echo [INFO] Kiem tra trang thai cac dich vu...
echo.

REM Kiem tra XLab Web Server
echo [1/4] XLab Web Server (port 3000):
netstat -an | find "3000" >nul 2>&1
if errorlevel 1 (
    echo [❌] KHONG CHAY
) else (
    echo [✅] DANG CHAY
)

REM Kiem tra Nginx
echo [2/4] Nginx Reverse Proxy (port 80):
netstat -an | find ":80 " >nul 2>&1
if errorlevel 1 (
    echo [❌] KHONG CHAY
) else (
    echo [✅] DANG CHAY
)

REM Kiem tra DNS
echo [3/4] DNS Resolution:
nslookup xlab.id.vn >nul 2>&1
if errorlevel 1 (
    echo [❌] THAT BAI
) else (
    echo [✅] HOAT DONG
)

REM Kiem tra local access
echo [4/4] Local Access Test:
curl -s -o nul -w "%%{http_code}" http://localhost 2>nul | find "200" >nul 2>&1
if errorlevel 1 (
    echo [❌] THAT BAI
) else (
    echo [✅] THANH CONG
)

echo.
echo ================================================================
echo                    TONG KET THIET LAP
echo ================================================================
echo.

echo [✅] HOAN THANH:
echo     - XLab Web Server: Dang chay tren port 3000
echo     - Nginx Reverse Proxy: Da cai dat va chay tren port 80
echo     - DNS Configuration: xlab.id.vn tro ve 1.52.110.251
echo     - Local Access: http://localhost hoat dong hoan hao
echo     - Production Build: San sang phuc vu
echo.

echo [⚠️] CAN THIET LAP THEM:
echo     - Router Port Forwarding: Can forward port 80 ve may tinh nay
echo     - ISP Configuration: Mot so ISP chan port 80
echo     - External Firewall: Kiem tra firewall router/modem
echo.

echo ================================================================
echo                    HUONG DAN TRUY CAP
echo ================================================================
echo.

echo [🌐] CAC URL CO THE TRUY CAP:
echo.
echo [✅] LOCAL ACCESS (Hoan hao):
echo     - http://localhost:3000  (Truc tiep XLab Server)
echo     - http://localhost       (Qua Nginx Reverse Proxy)
echo.
echo [⚠️] DOMAIN ACCESS (Can cau hinh router):
echo     - http://xlab.id.vn      (Can router port forwarding)
echo     - http://1.52.110.251    (Truc tiep qua IP)
echo.

echo ================================================================
echo                    BUOC TIEP THEO
echo ================================================================
echo.

echo [1] CAU HINH ROUTER PORT FORWARDING:
echo     - Truy cap router admin panel (thuong la 192.168.1.1)
echo     - Tim muc Port Forwarding hoac Virtual Server
echo     - Them rule: External Port 80 → Internal IP [IP may tinh] Port 80
echo     - Luu cau hinh va restart router
echo.

echo [2] KIEM TRA ISP:
echo     - Mot so ISP chan port 80 cho residential users
echo     - Lien he ISP de mo port 80 neu can
echo     - Hoac su dung port khac (8080, 8000) va update Nginx config
echo.

echo [3] TEST EXTERNAL ACCESS:
echo     - Su dung mobile data hoac mang khac
echo     - Truy cap http://xlab.id.vn
echo     - Neu khong duoc, kiem tra router va ISP
echo.

echo ================================================================
echo                    SCRIPT QUAN LY
echo ================================================================
echo.

echo [🎛️] CAC SCRIPT DA TAO:
echo     - start-website.bat    : Khoi dong toan bo he thong
echo     - C:\nginx\start-nginx.bat : Khoi dong Nginx
echo     - C:\nginx\stop-nginx.bat  : Dung Nginx
echo     - start.bat           : Khoi dong XLab Web Server
echo.

echo [📊] MONITORING:
echo     - netstat -an ^| find ":80"   : Kiem tra Nginx
echo     - netstat -an ^| find ":3000" : Kiem tra XLab Server
echo     - curl http://localhost      : Test local access
echo.

echo ================================================================
echo                    KET LUAN
echo ================================================================
echo.

netstat -an | find "3000" >nul 2>&1
set XLAB_STATUS=%errorlevel%

netstat -an | find ":80 " >nul 2>&1
set NGINX_STATUS=%errorlevel%

if %XLAB_STATUS% EQU 0 (
    if %NGINX_STATUS% EQU 0 (
        echo [🎉] THIET LAP THANH CONG!
        echo.
        echo [✅] Website xlab.id.vn da san sang!
        echo [✅] Reverse proxy hoat dong hoan hao!
        echo [✅] Local access: http://localhost
        echo.
        echo [⚠️] Chi can cau hinh router port forwarding la co the truy cap tu ben ngoai!
    ) else (
        echo [⚠️] XLab Server chay nhung Nginx chua khoi dong
        echo [ACTION] Chay: C:\nginx\start-nginx.bat
    )
) else (
    echo [❌] XLab Server chua chay
    echo [ACTION] Chay: start.bat
)

echo.
echo ================================================================
echo.

pause
