@echo off
title XLab Web - Connection Test

echo.
echo ================================================================
echo                    XLab Web - Connection Test
echo                   Test ket noi sau khi cau hinh router
echo ================================================================
echo.

echo [INFO] Thong tin he thong:
echo     - IP noi bo: 192.168.1.113
echo     - Router IP: 192.168.1.1
echo     - IP cong cong: 1.52.110.251
echo     - Domain: xlab.id.vn
echo.

echo [1/6] Kiem tra XLab Web Server:
netstat -an | find "3000" >nul 2>&1
if errorlevel 1 (
    echo [❌] XLab Server KHONG CHAY
) else (
    echo [✅] XLab Server DANG CHAY (port 3000)
)

echo [2/6] Kiem tra Nginx:
netstat -an | find ":80 " >nul 2>&1
if errorlevel 1 (
    echo [❌] Nginx KHONG CHAY
) else (
    echo [✅] Nginx DANG CHAY (port 80)
)

echo [3/6] Kiem tra DNS:
nslookup xlab.id.vn | find "1.52.110.251" >nul 2>&1
if errorlevel 1 (
    echo [❌] DNS CHUA CAP NHAT
) else (
    echo [✅] DNS DA DUNG (1.52.110.251)
)

echo [4/6] Test local access:
curl -s -o nul -w "HTTP %%{http_code}" http://localhost 2>nul
echo.

echo [5/6] Test IP truc tiep:
curl -s -o nul -w "HTTP %%{http_code}" http://1.52.110.251 2>nul
echo.

echo [6/6] Test domain:
curl -s -o nul -w "HTTP %%{http_code}" http://xlab.id.vn 2>nul
echo.

echo ================================================================
echo                    KET QUA TEST
echo ================================================================
echo.

REM Test chi tiet
curl -s -o nul -w "Local (localhost): HTTP %%{http_code}\n" http://localhost 2>nul
curl -s -o nul -w "IP truc tiep (1.52.110.251): HTTP %%{http_code}\n" http://1.52.110.251 2>nul
curl -s -o nul -w "Domain (xlab.id.vn): HTTP %%{http_code}\n" http://xlab.id.vn 2>nul

echo.
echo [INFO] HTTP 200 = Thanh cong
echo [INFO] HTTP 000 = Khong ket noi duoc
echo.

echo ================================================================
echo                    HUONG DAN
echo ================================================================
echo.

echo [NEU CHUA CAU HINH ROUTER:]
echo 1. Truy cap: http://192.168.1.1
echo 2. Dang nhap router (admin/admin)
echo 3. Tim muc "Port Forwarding"
echo 4. Them rule: Port 80 → 192.168.1.113:80
echo 5. Luu va restart router
echo 6. Doi 5-10 phut roi chay lai script nay
echo.

echo [NEU DA CAU HINH ROUTER NHUNG VAN LOI:]
echo 1. Kiem tra ISP co chan port 80 khong
echo 2. Thu port khac (8080, 8000)
echo 3. Lien he ISP de mo port 80
echo.

pause
