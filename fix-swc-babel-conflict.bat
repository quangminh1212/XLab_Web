@echo off
echo XLab Web - SWC/Babel Conflict Fix
echo ------------------------------

echo [1/5] Dừng các tiến trình Node.js đang chạy...
taskkill /F /IM node.exe >nul 2>&1

echo [2/5] Kiểm tra và xóa file .babelrc...
if exist .babelrc (
    echo File .babelrc được tìm thấy, tạo backup và xóa...
    copy .babelrc .babelrc.backup >nul
    del .babelrc
    echo Đã xóa .babelrc
) else (
    echo File .babelrc không tồn tại, bỏ qua...
)

echo [3/5] Cập nhật next.config.js để sử dụng SWC...
echo // next.config.js > next.config.js.new
echo const nextConfig = {>> next.config.js.new
echo   reactStrictMode: true,>> next.config.js.new
echo   compiler: {>> next.config.js.new
echo     styledComponents: true>> next.config.js.new
echo   },>> next.config.js.new
echo   // Đã xóa tùy chọn swcMinify không được hỗ trợ>> next.config.js.new
echo }>> next.config.js.new
echo >> next.config.js.new
echo module.exports = nextConfig>> next.config.js.new

echo Tạo backup và áp dụng cấu hình mới...
if exist next.config.js (
    copy next.config.js next.config.js.backup >nul
)
move /y next.config.js.new next.config.js >nul

echo [4/5] Thiết lập biến môi trường...
echo NODE_OPTIONS=--max_old_space_size=4096 > .env.local
echo Đã thiết lập NODE_OPTIONS=--max_old_space_size=4096 trong .env.local

echo [5/5] Xóa cache và thư mục .next...
rd /s /q .next >nul 2>&1
echo Đã xóa thư mục .next

for /d %%i in (node_modules\.cache\*) do (
    rd /s /q "%%i" >nul 2>&1
)
echo Đã xóa cache trong node_modules\.cache

echo.
echo ===== THÔNG BÁO QUAN TRỌNG =====
echo Đã cấu hình Next.js để sử dụng SWC thay vì Babel.
echo Đã loại bỏ tùy chọn swcMinify không được hỗ trợ.
echo Đã thêm cấu hình compiler.styledComponents để hỗ trợ styled-components.
echo LƯU Ý: Không sử dụng file .babelrc khi bạn cần các tính năng yêu cầu SWC.
echo Nếu bạn cần cấu hình babel, hãy sử dụng next.config.js thay thế.
echo ===============================
echo.
echo Khởi động lại ứng dụng bằng lệnh: npm run dev

pause 