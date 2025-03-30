@echo off
echo XLab Web - Fix All Scripts Runner
echo ------------------------------

echo [1/3] Chạy script sửa lỗi webpack...
if exist fix-webpack-call-error.bat (
    call fix-webpack-call-error.bat
) else (
    echo Script fix-webpack-call-error.bat không tồn tại, tạo file tạm...
    
    echo @echo off> fix-webpack-call-error.bat
    echo echo XLab Web - Webpack 'call' Error Fix>> fix-webpack-call-error.bat
    echo echo ------------------------------>> fix-webpack-call-error.bat
    echo echo [1/4] Dừng các tiến trình Node.js đang chạy...>> fix-webpack-call-error.bat
    echo taskkill /F /IM node.exe ^>nul 2^>^&1>> fix-webpack-call-error.bat
    echo echo [2/4] Cài đặt webpack phiên bản cụ thể...>> fix-webpack-call-error.bat
    echo call npm install --save-dev webpack@5.82.1>> fix-webpack-call-error.bat
    echo echo [3/4] Xóa cache...>> fix-webpack-call-error.bat
    echo rd /s /q .next ^>nul 2^>^&1>> fix-webpack-call-error.bat
    echo echo [4/4] Cập nhật React và React DOM...>> fix-webpack-call-error.bat
    echo call npm install react@18.2.0 react-dom@18.2.0>> fix-webpack-call-error.bat
    
    call fix-webpack-call-error.bat
)

echo.
echo [2/3] Chạy script sửa lỗi SWC/Babel...
if exist fix-swc-babel-conflict.bat (
    call fix-swc-babel-conflict.bat
) else (
    echo Script fix-swc-babel-conflict.bat không tồn tại!
    echo Vui lòng chạy lại lệnh để tạo script này.
    exit /b 1
)

echo.
echo [3/3] Kiểm tra và chạy thêm script bổ sung...
echo.
echo ===== CÁC LỆNH KHÁC CÓ THỂ CẦN CHẠY =====
echo Nếu vẫn gặp lỗi sau khi chạy các scripts sửa lỗi trên, bạn có thể thử:
echo 1. Xóa node_modules và cài đặt lại: rd /s /q node_modules và npm install
echo 2. Cài đặt styled-components: npm install styled-components
echo 3. Cập nhật phiên bản Next.js: npm install next@13.4.8
echo 4. Cài đặt các dependencies thiếu: npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
echo.
echo Chạy lệnh nào bây giờ? (1/2/3/4/n để không chạy thêm)
set /p choice=

if "%choice%"=="1" (
    echo Xóa node_modules và cài đặt lại...
    rd /s /q node_modules
    call npm install
) else if "%choice%"=="2" (
    echo Cài đặt styled-components...
    call npm install styled-components
) else if "%choice%"=="3" (
    echo Cập nhật phiên bản Next.js...
    call npm install next@13.4.8
) else if "%choice%"=="4" (
    echo Cài đặt các dependencies thiếu...
    call npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
) else (
    echo Không chạy thêm lệnh nào.
)

echo.
echo ===== THÔNG BÁO QUAN TRỌNG =====
echo Đã chạy tất cả các scripts sửa lỗi. Nếu vẫn gặp lỗi, vui lòng thực hiện các bước sau:
echo 1. Kiểm tra các lỗi trong console
echo 2. Xóa hoàn toàn thư mục .next và node_modules
echo 3. Cài đặt lại các dependencies: npm install
echo 4. Kiểm tra xung đột trong file package.json
echo ===============================
echo.
echo Khởi động lại ứng dụng...
call npm run dev

pause 