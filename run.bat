@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

title XLab Web - Cài đặt và Khởi động
color 0A

echo ========================================================
echo     ĐANG CHUẨN BỊ CÀI ĐẶT VÀ KHỞI ĐỘNG XLAB WEB
echo ========================================================
echo.

echo [1/4] Dừng các tiến trình Node.js đang chạy...
taskkill /F /IM node.exe >nul 2>&1
echo.

echo [2/4] Xóa thư mục node_modules (nếu có)...
if exist node_modules (
    rd /s /q node_modules >nul 2>&1
    echo Đã xóa thư mục node_modules
) else (
    echo Thư mục node_modules không tồn tại, bỏ qua
)
echo.

echo [3/4] Cài đặt tất cả các dependencies...
call npm install
echo.

echo [4/4] Khởi động ứng dụng...
echo.
echo ========================================================
echo     KHỞI ĐỘNG XLAB WEB (NPM START)
echo     Nhấn Ctrl+C để dừng ứng dụng
echo ========================================================
echo.

call npm start

echo.
echo ========================================================
echo     ỨNG DỤNG ĐÃ DỪNG
echo ========================================================
echo.
pause
exit /b 0
