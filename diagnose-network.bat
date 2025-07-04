@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Network Diagnostics
REM ========================================
REM Script chan doan va khac phuc cac van de network cho xlab.id.vn

title XLab Web - Network Diagnostics

echo.
echo ================================================================
echo                    XLab Web Network Diagnostics
echo                   Chan doan ket noi cho xlab.id.vn
echo ================================================================
echo.

echo [INFO] Bat dau chan doan network...
echo.

REM Kiem tra DNS resolution
echo ================================================================
echo                    1. DNS RESOLUTION TEST
echo ================================================================
echo.

echo [INFO] Kiem tra DNS resolution cho xlab.id.vn...
nslookup xlab.id.vn
echo.

echo [INFO] Kiem tra DNS resolution cho www.xlab.id.vn...
nslookup www.xlab.id.vn
echo.

REM Kiem tra ping
echo ================================================================
echo                    2. PING TEST
echo ================================================================
echo.

echo [INFO] Ping xlab.id.vn...
ping -n 4 xlab.id.vn
echo.

REM Kiem tra port connectivity
echo ================================================================
echo                    3. PORT CONNECTIVITY TEST
echo ================================================================
echo.

echo [INFO] Kiem tra port 80 (HTTP)...
telnet xlab.id.vn 80 2>nul
if errorlevel 1 (
    echo [ERROR] Khong the ket noi port 80
) else (
    echo [SUCCESS] Port 80 co the ket noi
)
echo.

echo [INFO] Kiem tra port 443 (HTTPS)...
telnet xlab.id.vn 443 2>nul
if errorlevel 1 (
    echo [ERROR] Khong the ket noi port 443
) else (
    echo [SUCCESS] Port 443 co the ket noi
)
echo.

echo [INFO] Kiem tra port 3000 (XLab Server)...
telnet xlab.id.vn 3000 2>nul
if errorlevel 1 (
    echo [ERROR] Khong the ket noi port 3000
) else (
    echo [SUCCESS] Port 3000 co the ket noi
)
echo.

REM Kiem tra local services
echo ================================================================
echo                    4. LOCAL SERVICES TEST
echo ================================================================
echo.

echo [INFO] Kiem tra XLab Web Server (port 3000)...
netstat -an | find "3000"
if errorlevel 1 (
    echo [ERROR] XLab Web Server khong chay
) else (
    echo [SUCCESS] XLab Web Server dang chay
)
echo.

echo [INFO] Kiem tra Nginx (port 80)...
netstat -an | find ":80 "
if errorlevel 1 (
    echo [ERROR] Nginx khong chay tren port 80
) else (
    echo [SUCCESS] Nginx dang chay tren port 80
)
echo.

echo [INFO] Kiem tra HTTPS (port 443)...
netstat -an | find ":443 "
if errorlevel 1 (
    echo [WARNING] HTTPS khong chay tren port 443
) else (
    echo [SUCCESS] HTTPS dang chay tren port 443
)
echo.

REM Kiem tra firewall
echo ================================================================
echo                    5. FIREWALL TEST
echo ================================================================
echo.

echo [INFO] Kiem tra Windows Firewall rules...
netsh advfirewall firewall show rule name="XLab Web Port 3000" | findstr "Rule Name\|Action"
netsh advfirewall firewall show rule name="XLab Web HTTP" | findstr "Rule Name\|Action"
netsh advfirewall firewall show rule name="XLab Web HTTPS" | findstr "Rule Name\|Action"
echo.

REM Kiem tra local connectivity
echo ================================================================
echo                    6. LOCAL CONNECTIVITY TEST
echo ================================================================
echo.

echo [INFO] Test ket noi local...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://localhost:3000 2>nul
if errorlevel 1 (
    echo [ERROR] Khong the ket noi localhost:3000
) else (
    echo [SUCCESS] Localhost:3000 hoat dong binh thuong
)
echo.

REM Kiem tra external IP
echo ================================================================
echo                    7. EXTERNAL IP TEST
echo ================================================================
echo.

echo [INFO] Kiem tra IP cong cong...
for /f "tokens=*" %%i in ('curl -s ifconfig.me 2^>nul') do set PUBLIC_IP=%%i
if defined PUBLIC_IP (
    echo [INFO] IP cong cong: %PUBLIC_IP%
) else (
    echo [WARNING] Khong the xac dinh IP cong cong
)
echo.

REM Kiem tra router/NAT
echo ================================================================
echo                    8. ROUTER/NAT CONFIGURATION
echo ================================================================
echo.

echo [INFO] Kiem tra cau hinh mang noi bo...
ipconfig | findstr "IPv4"
echo.

echo [INFO] Kiem tra gateway...
for /f "tokens=3" %%i in ('route print ^| findstr "0.0.0.0.*0.0.0.0"') do set GATEWAY=%%i
if defined GATEWAY (
    echo [INFO] Default Gateway: %GATEWAY%
    echo [INFO] Ping gateway...
    ping -n 2 %GATEWAY%
) else (
    echo [WARNING] Khong the xac dinh gateway
)
echo.

REM Tong ket va khuyen nghi
echo ================================================================
echo                    DIAGNOSTIC SUMMARY
echo ================================================================
echo.

echo [INFO] TONG KET CHAN DOAN:
echo.

REM Kiem tra cac dieu kien can thiet
set ISSUES_FOUND=0

netstat -an | find "3000" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] XLab Web Server khong chay
    set /a ISSUES_FOUND+=1
)

netstat -an | find ":80 " >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Nginx reverse proxy khong chay
    set /a ISSUES_FOUND+=1
)

nslookup xlab.id.vn >nul 2>&1
if errorlevel 1 (
    echo [ERROR] DNS resolution that bai
    set /a ISSUES_FOUND+=1
)

if %ISSUES_FOUND% EQU 0 (
    echo [SUCCESS] Tat ca cac dich vu co ban dang hoat dong!
    echo [INFO] Neu van khong truy cap duoc, kiem tra:
    echo [INFO] 1. Router port forwarding (80, 443, 3000)
    echo [INFO] 2. ISP blocking (mot so ISP chan port 80)
    echo [INFO] 3. Cloudflare hoac CDN settings
) else (
    echo [WARNING] Tim thay %ISSUES_FOUND% van de can khac phuc
    echo.
    echo [INFO] HUONG DAN KHAC PHUC:
    echo [INFO] 1. Chay setup-hosting.bat de cai dat day du
    echo [INFO] 2. Chay start-all.bat de khoi dong dich vu
    echo [INFO] 3. Kiem tra router port forwarding
    echo [INFO] 4. Lien he ISP neu can thiet
)

echo.
echo ================================================================
echo                    DIAGNOSTIC COMPLETE
echo ================================================================
echo.

pause
