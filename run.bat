@echo off
title XLab Web Application
color 0A

echo ===================================
echo XLab Web Application Startup Tool
echo ===================================
echo.

:: Kiểm tra môi trường Node.js
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo [LỖI] Node.js chưa được cài đặt.
    echo Vui lòng cài đặt Node.js từ https://nodejs.org/
    echo Khuyến nghị sử dụng phiên bản LTS
    echo.
    pause
    exit /b 1
)

:: Hiển thị thông tin phiên bản
node --version
echo.

:: Chạy script fix-next.js trước
echo Đang chạy script sửa lỗi Next.js...
node fix-next.js
IF %ERRORLEVEL% NEQ 0 (
    echo [LỖI] Không thể chạy script sửa lỗi.
    pause
    exit /b 1
)
echo.

:: Cài đặt dependencies
echo Đang cài đặt các thư viện...
call npm install --legacy-peer-deps
IF %ERRORLEVEL% NEQ 0 (
    echo [CẢNH BÁO] Có lỗi trong quá trình cài đặt thư viện.
    echo Thử tiếp tục khởi chạy...
    echo.
)
echo.

:: Chạy ứng dụng
echo Đang khởi động ứng dụng...
call npm run dev

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [LỖI] Không thể khởi động ứng dụng.
    echo.
    echo Các bước xử lý lỗi:
    echo 1. Kiểm tra xem Node.js đã được cài đặt chưa
    echo 2. Thử chạy lệnh: npm run fix-next
    echo 3. Thử chạy lệnh: npm install --legacy-peer-deps
    echo 4. Thử chạy lệnh: npm run dev
    echo.
    echo Nếu vẫn gặp lỗi, vui lòng liên hệ đội phát triển.
)

pause 