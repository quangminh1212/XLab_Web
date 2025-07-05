@echo off
title XLab Web - DNS Check

echo.
echo ================================================================
echo                    XLab Web - DNS Check
echo                   Kiem tra DNS cho xlab.id.vn
echo ================================================================
echo.

echo [INFO] Kiem tra DNS resolution...
echo.

echo [1] Kiem tra xlab.id.vn:
nslookup xlab.id.vn
echo.

echo [2] Kiem tra www.xlab.id.vn:
nslookup www.xlab.id.vn
echo.

echo [3] Kiem tra IP hien tai cua ban:
powershell -Command "(Invoke-WebRequest -Uri 'https://ipv4.icanhazip.com' -UseBasicParsing).Content.Trim()"
echo.

echo [4] Test ket noi truc tiep:
echo [INFO] Test http://1.52.110.251...
curl -s -o nul -w "HTTP Status: %%{http_code}" http://1.52.110.251 2>nul
echo.

echo [5] Test domain:
echo [INFO] Test http://xlab.id.vn...
curl -s -o nul -w "HTTP Status: %%{http_code}" http://xlab.id.vn 2>nul
echo.

echo ================================================================
echo                    HUONG DAN
echo ================================================================
echo.
echo [INFO] Neu DNS van co 2 IP (34.71.214.76 va 1.52.110.251):
echo [ACTION] Vao panel TenTen va XOA cac record:
echo [ACTION] - @ A 34.71.214.76
echo [ACTION] - www A 34.71.214.76
echo [ACTION] Chi giu lai:
echo [ACTION] - @ A 1.52.110.251
echo [ACTION] - www A 1.52.110.251
echo.
echo [INFO] Sau khi xoa, doi 15-30 phut roi chay lai script nay
echo.

pause
