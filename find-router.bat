@echo off
title XLab Web - Find Router Admin Panel

echo.
echo ================================================================
echo                    XLab Web - Find Router Admin
echo                   Tim dia chi router admin panel
echo ================================================================
echo.

echo [INFO] Dang tim router admin panel...
echo.

echo [1] Test cac dia chi thuong gap:

echo [Testing] http://192.168.1.1...
curl -s -o nul -w "HTTP %%{http_code}" http://192.168.1.1 --connect-timeout 3 2>nul
echo.

echo [Testing] http://192.168.0.1...
curl -s -o nul -w "HTTP %%{http_code}" http://192.168.0.1 --connect-timeout 3 2>nul
echo.

echo [Testing] http://10.0.0.1...
curl -s -o nul -w "HTTP %%{http_code}" http://10.0.0.1 --connect-timeout 3 2>nul
echo.

echo [Testing] http://192.168.1.254...
curl -s -o nul -w "HTTP %%{http_code}" http://192.168.1.254 --connect-timeout 3 2>nul
echo.

echo [Testing] http://192.168.0.254...
curl -s -o nul -w "HTTP %%{http_code}" http://192.168.0.254 --connect-timeout 3 2>nul
echo.

echo [2] Kiem tra gateway hien tai:
echo Default Gateway: 192.168.1.1
echo DHCP Server: 192.168.1.1
echo.

echo [3] Ping test router:
ping -n 2 192.168.1.1
echo.

echo ================================================================
echo                    HUONG DAN
echo ================================================================
echo.

echo [NEU HTTP 200/302/401] = Router co web interface
echo [NEU HTTP 000] = Khong co web interface hoac bi chan
echo.

echo [CAC DIA CHI CAN THU:]
echo 1. http://192.168.1.1
echo 2. http://192.168.0.1  
echo 3. http://10.0.0.1
echo 4. http://192.168.1.254
echo 5. http://192.168.0.254
echo.

echo [USERNAME/PASSWORD THUONG GAP:]
echo - admin / admin
echo - admin / password
echo - admin / (de trong)
echo - root / admin
echo - Xem nhan dan sau router
echo.

echo [NEU KHONG VAO DUOC ROUTER:]
echo 1. Su dung UPnP (tu dong)
echo 2. Su dung ngrok (tam thoi)
echo 3. Lien he ISP ho tro
echo 4. Reset router ve mac dinh
echo.

pause
