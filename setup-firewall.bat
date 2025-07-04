@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Windows Firewall Setup
REM ========================================
REM Script tu dong cau hinh Windows Firewall cho xlab.id.vn

title XLab Web - Firewall Configuration

echo.
echo ================================================================
echo                    XLab Web Firewall Setup
echo                   Cau hinh cho xlab.id.vn Domain
echo ================================================================
echo.

REM Kiem tra quyen Administrator
net session >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Script nay can quyen Administrator!
    echo [INFO] Vui long chay "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo [SUCCESS] Dang chay voi quyen Administrator

REM Xoa cac rule cu neu co
echo [INFO] Xoa cac firewall rule cu...
netsh advfirewall firewall delete rule name="XLab Web Server" >nul 2>&1
netsh advfirewall firewall delete rule name="XLab Web HTTP" >nul 2>&1
netsh advfirewall firewall delete rule name="XLab Web HTTPS" >nul 2>&1
netsh advfirewall firewall delete rule name="XLab Web Port 3000" >nul 2>&1
echo [SUCCESS] Da xoa cac rule cu

REM Them rule cho port 3000 (server port)
echo [INFO] Them firewall rule cho port 3000...
netsh advfirewall firewall add rule name="XLab Web Port 3000" dir=in action=allow protocol=TCP localport=3000 >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Khong the them rule cho port 3000!
    pause
    exit /b 1
)
echo [SUCCESS] Da them rule cho port 3000

REM Them rule cho port 80 (HTTP)
echo [INFO] Them firewall rule cho port 80 (HTTP)...
netsh advfirewall firewall add rule name="XLab Web HTTP" dir=in action=allow protocol=TCP localport=80 >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Khong the them rule cho port 80 (co the da ton tai)
) else (
    echo [SUCCESS] Da them rule cho port 80
)

REM Them rule cho port 443 (HTTPS)
echo [INFO] Them firewall rule cho port 443 (HTTPS)...
netsh advfirewall firewall add rule name="XLab Web HTTPS" dir=in action=allow protocol=TCP localport=443 >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Khong the them rule cho port 443 (co the da ton tai)
) else (
    echo [SUCCESS] Da them rule cho port 443
)

REM Hien thi cac rule da tao
echo.
echo [INFO] Cac firewall rule da duoc tao:
netsh advfirewall firewall show rule name="XLab Web Port 3000" | findstr "Rule Name\|LocalPort\|Action"
netsh advfirewall firewall show rule name="XLab Web HTTP" | findstr "Rule Name\|LocalPort\|Action"
netsh advfirewall firewall show rule name="XLab Web HTTPS" | findstr "Rule Name\|LocalPort\|Action"

echo.
echo ================================================================
echo                    FIREWALL SETUP COMPLETE
echo ================================================================
echo   Port 3000: ALLOWED (XLab Web Server)
echo   Port 80:   ALLOWED (HTTP)
echo   Port 443:  ALLOWED (HTTPS)
echo   Status:    Ready for xlab.id.vn
echo ================================================================
echo.

echo [SUCCESS] Windows Firewall da duoc cau hinh cho xlab.id.vn!
echo [INFO] Ban co the kiem tra lai bang Windows Defender Firewall
echo.
pause
