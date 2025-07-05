@echo off
chcp 65001 >nul 2>&1

echo.
echo ================================================================
echo                    XLab Web - Quick Setup
echo                   Thiết lập nhanh cho xlab.id.vn
echo ================================================================
echo.

echo [INFO] Kiểm tra trạng thái hiện tại...
echo.

REM Kiểm tra XLab Web Server
echo [1/4] Kiểm tra XLab Web Server...
netstat -an | find "3000" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] XLab Web Server chưa chạy
    echo [ACTION] Chạy: start.bat
) else (
    echo [SUCCESS] XLab Web Server đang chạy (port 3000)
)
echo.

REM Kiểm tra DNS
echo [2/4] Kiểm tra DNS resolution...
nslookup xlab.id.vn >nul 2>&1
if errorlevel 1 (
    echo [ERROR] DNS resolution thất bại
) else (
    echo [SUCCESS] DNS đã được cấu hình đúng
)
echo.

REM Kiểm tra Firewall (không cần admin để check)
echo [3/4] Kiểm tra Firewall rules...
netsh advfirewall firewall show rule name="XLab Web Port 3000" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Firewall rule chưa được tạo
    echo [ACTION] Cần chạy setup-firewall.bat với quyền Administrator
) else (
    echo [SUCCESS] Firewall rule đã tồn tại
)
echo.

REM Kiểm tra Nginx
echo [4/4] Kiểm tra Nginx...
if exist "C:\nginx\nginx.exe" (
    echo [SUCCESS] Nginx đã được cài đặt
    netstat -an | find ":80 " >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Nginx chưa chạy
        echo [ACTION] Chạy: C:\nginx\start-nginx.bat
    ) else (
        echo [SUCCESS] Nginx đang chạy (port 80)
    )
) else (
    echo [WARNING] Nginx chưa được cài đặt
    echo [ACTION] Cần chạy setup-nginx.bat với quyền Administrator
)
echo.

echo ================================================================
echo                    HƯỚNG DẪN THIẾT LẬP
echo ================================================================
echo.

echo [BƯỚC 1] Cấu hình Firewall (CẦN QUYỀN ADMINISTRATOR):
echo   1. Click chuột phải vào setup-firewall.bat
echo   2. Chọn "Run as administrator"
echo   3. Chọn "Yes" khi được hỏi
echo.

echo [BƯỚC 2] Cài đặt Nginx (CẦN QUYỀN ADMINISTRATOR):
echo   1. Click chuột phải vào setup-nginx.bat
echo   2. Chọn "Run as administrator"
echo   3. Chọn "Yes" khi được hỏi
echo.

echo [BƯỚC 3] Khởi động toàn bộ hệ thống:
echo   1. Chạy start-all.bat (không cần admin)
echo   2. Kiểm tra bằng check-status.bat
echo.

echo [BƯỚC 4] Kiểm tra truy cập:
echo   1. Mở browser
echo   2. Truy cập http://xlab.id.vn
echo   3. Nếu không được, chạy diagnose-network.bat
echo.

echo ================================================================
echo                    TRẠNG THÁI HIỆN TẠI
echo ================================================================
echo.

REM Tóm tắt trạng thái
set READY=1

netstat -an | find "3000" >nul 2>&1
if errorlevel 1 (
    echo [❌] XLab Web Server: CHƯA CHẠY
    set READY=0
) else (
    echo [✅] XLab Web Server: ĐANG CHẠY
)

nslookup xlab.id.vn >nul 2>&1
if errorlevel 1 (
    echo [❌] DNS Resolution: THẤT BẠI
    set READY=0
) else (
    echo [✅] DNS Resolution: HOẠT ĐỘNG
)

netsh advfirewall firewall show rule name="XLab Web Port 3000" >nul 2>&1
if errorlevel 1 (
    echo [⚠️] Windows Firewall: CHƯA CẤU HÌNH
    set READY=0
) else (
    echo [✅] Windows Firewall: ĐÃ CẤU HÌNH
)

if exist "C:\nginx\nginx.exe" (
    netstat -an | find ":80 " >nul 2>&1
    if errorlevel 1 (
        echo [⚠️] Nginx Reverse Proxy: CHƯA CHẠY
        set READY=0
    ) else (
        echo [✅] Nginx Reverse Proxy: ĐANG CHẠY
    )
) else (
    echo [❌] Nginx Reverse Proxy: CHƯA CÀI ĐẶT
    set READY=0
)

echo.

if %READY% EQU 1 (
    echo [🎉] WEBSITE SẴN SÀNG! Truy cập: http://xlab.id.vn
) else (
    echo [⚙️] CẦN THIẾT LẬP THÊM - Làm theo hướng dẫn ở trên
)

echo.
echo ================================================================
echo.

pause
