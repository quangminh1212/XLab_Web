@echo off
title XLab Web với Serveo Tunnel
echo.
echo ==========================================
echo    XLab Web - Khởi động với Serveo Tunnel
echo ==========================================
echo.

:: Kiểm tra SSH đã cài đặt chưa
where ssh >nul 2>&1
if %errorlevel% neq 0 (
    echo SSH không được tìm thấy trên hệ thống.
    echo.
    echo Vui lòng cài đặt Git từ https://git-scm.com/download/win
    echo Sau khi cài đặt Git, hãy chạy lại script này.
    echo.
    echo Nhấn phím bất kỳ để thoát...
    pause >nul
    exit /b
)

echo [1/3] Kiểm tra Node.js và npm...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js chưa được cài đặt. Vui lòng cài đặt Node.js.
    pause
    exit /b
)

echo Node.js và npm đã được phát hiện.
echo.

echo [2/3] Chuẩn bị và khởi động Next.js...

:: Khởi động Next.js trong cửa sổ mới
start "Next.js Server" cmd /k "cd /d %~dp0 && npm run dev"
echo Đã khởi động Next.js server tại http://localhost:3000
echo.

echo [3/3] Khởi động Serveo tunnel...
echo.
echo QUAN TRỌNG - Để kết nối Serveo thành công:
echo.
echo 1. Khi được hỏi "Are you sure you want to continue connecting" 
echo    gõ "yes" và nhấn Enter
echo.
echo 2. URL của bạn sẽ hiển thị trong cửa sổ Serveo (thường là https://xlab-id.serveo.net)
echo.
echo 3. Sau khi có URL, cập nhật bản ghi DNS trên TenTen:
echo    - Tên: xlab
echo    - Loại: CNAME
echo    - Giá trị: xlab-id.serveo.net (không bao gồm https://)
echo.
echo Nhấn phím bất kỳ để bắt đầu kết nối Serveo...
pause >nul

:: Khởi động Serveo
start "Serveo Tunnel" cmd /k "ssh -R xlab-id:80:localhost:3000 serveo.net"

echo.
echo ==========================================
echo Tất cả dịch vụ đã khởi động thành công!
echo.
echo - Next.js đang chạy tại http://localhost:3000
echo - Serveo tunnel đang chạy (kiểm tra cửa sổ Serveo để xem URL chính xác)
echo ==========================================
echo.
echo HƯỚNG DẪN CẤU HÌNH DNS:
echo 1. Đăng nhập vào quản lý DNS của TenTen cho tên miền xlab.id.vn
echo 2. Thêm/sửa bản ghi CNAME:
echo    - Tên: xlab (hoặc @ nếu muốn dùng domain gốc)
echo    - Loại: CNAME
echo    - Giá trị: xlab-id.serveo.net (hoặc URL từ Serveo, không gồm https://)
echo 3. Trang web của bạn sẽ truy cập được qua: http://xlab.xlab.id.vn
echo.
echo LƯU Ý: Serveo thường cung cấp subdomain cố định nên bạn chỉ cần cấu hình DNS một lần
echo.
echo ==========================================
echo Để dừng tất cả dịch vụ, đóng tất cả cửa sổ và nhấn phím bất kỳ ở đây...
pause >nul

echo Đang dừng các dịch vụ...
taskkill /FI "WINDOWTITLE eq Next.js Server*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Serveo Tunnel*" /T /F >nul 2>&1
echo Đã hoàn tất. 