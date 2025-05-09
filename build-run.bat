@echo off
echo ======================================
echo  XLab Web - Clean Build and Run
echo ======================================
echo.

echo [1/6] Dừng các tiến trình node đang chạy...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] Xóa thư mục .next và node_modules\.cache...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul

echo [3/6] Tạo thư mục .next và các thư mục con...
mkdir .next
mkdir .next\server
mkdir .next\static
mkdir .next\cache

echo [4/6] Cập nhật môi trường...
set NODE_OPTIONS=--no-warnings
set NEXT_TELEMETRY_DISABLED=1

echo [5/6] Xây dựng ứng dụng...
npm run build

echo [6/6] Khởi động máy chủ...
npm run start

pause 