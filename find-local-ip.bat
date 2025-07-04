@echo off
title XLab Web - Find Local IP

echo.
echo ================================================================
echo                    XLab Web - Find Local IP
echo                   Tim IP noi bo cho router config
echo ================================================================
echo.

echo [INFO] Tim IP noi bo cua may tinh...
echo.

echo [1] Tat ca cac IP interface:
ipconfig | findstr "IPv4"
echo.

echo [2] IP chi tiet:
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr "IPv4"') do (
    set ip=%%i
    set ip=!ip: =!
    echo     - !ip!
)
echo.

echo [3] Gateway (Router IP):
for /f "tokens=3" %%i in ('route print ^| findstr "0.0.0.0.*0.0.0.0"') do (
    echo     - %%i
    set ROUTER_IP=%%i
)
echo.

echo ================================================================
echo                    HUONG DAN CAU HINH ROUTER
echo ================================================================
echo.

echo [STEP 1] Truy cap router admin panel:
if defined ROUTER_IP (
    echo     - Mo browser va truy cap: http://%ROUTER_IP%
) else (
    echo     - Thu cac dia chi: 192.168.1.1, 192.168.0.1, 10.0.0.1
)
echo.

echo [STEP 2] Dang nhap router:
echo     - Username: admin, Password: admin
echo     - Hoac xem nhan dan sau router
echo.

echo [STEP 3] Tim muc Port Forwarding:
echo     - Co the la: "Port Forwarding", "Virtual Server", "NAT"
echo.

echo [STEP 4] Them rule moi:
echo     - Service Name: XLab Web HTTP
echo     - External Port: 80
echo     - Internal IP: [Chon IP tu danh sach tren]
echo     - Internal Port: 80
echo     - Protocol: TCP
echo     - Status: Enabled
echo.

echo [STEP 5] Luu va restart router
echo.

echo ================================================================
echo                    TEST SAU KHI CAU HINH
echo ================================================================
echo.

echo [INFO] Sau khi cau hinh router, test bang:
echo     1. check-dns.bat
echo     2. Mobile data: http://xlab.id.vn
echo     3. IP truc tiep: http://1.52.110.251
echo.

pause
