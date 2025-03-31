@echo off
setlocal enabledelayedexpansion

title XLab Web - Tự động sửa lỗi và cài đặt
color 0A

REM --- Bắt đầu thực thi tự động ---
echo ========================================================
echo     BẮT ĐẦU QUÁ TRÌNH SỬA LỖI VÀ CÀI ĐẶT TỰ ĐỘNG
echo ========================================================
echo.

call :run_all

echo.
echo ========================================================
echo     QUÁ TRÌNH TỰ ĐỘNG HOÀN TẤT!
echo ========================================================

goto :eof
REM --- Kết thúc thực thi tự động ---

:run_all
REM Khối lệnh này giờ chỉ đóng vai trò điều phối
echo.
echo --- Chạy các bước sửa lỗi --- 
echo.
call :fix_webpack
call :fix_swc_babel
call :fix_swcminify
call :clean_cache
call :reinstall_all_auto
REM Không còn pause hay goto menu ở đây
exit /b 0

:fix_webpack
cls
echo ========================================================
echo     SỬA LỖI WEBPACK 'CALL' ERROR
echo ========================================================
echo.
echo [1/4] Dừng các tiến trình Node.js đang chạy...
taskkill /F /IM node.exe >nul 2>&1
echo.
echo [2/4] Cài đặt webpack phiên bản cụ thể...
call npm install --save-dev webpack@5.82.1
echo.
echo [3/4] Xóa cache...
rd /s /q .next >nul 2>&1
echo Đã xóa thư mục .next
echo.
echo [4/4] Cập nhật React và React DOM...
call npm install react@18.2.0 react-dom@18.2.0
echo.
echo ========================================================
echo     HOÀN THÀNH SỬA LỖI WEBPACK 'CALL' ERROR
echo ========================================================
echo.
REM pause <- Đã xóa
REM if "%choice%"=="1" goto menu <- Đã xóa
exit /b 0

:fix_swc_babel
cls
echo ========================================================
echo     SỬA LỖI XUNG ĐỘT SWC/BABEL
echo ========================================================
echo.
echo [1/5] Dừng các tiến trình Node.js đang chạy...
taskkill /F /IM node.exe >nul 2>&1
echo.
echo [2/5] Kiểm tra và xóa file .babelrc...
if exist .babelrc (
    echo File .babelrc được tìm thấy, tạo backup và xóa...
    copy .babelrc .babelrc.backup >nul
    del .babelrc
    echo Đã xóa .babelrc
) else (
    echo File .babelrc không tồn tại, bỏ qua...
)
echo.
echo [3/5] Kiểm tra và cập nhật next.config.js...
if exist next.config.js (
    echo Tạo backup cho next.config.js...
    copy next.config.js next.config.js.backup >nul
    
    echo Đọc nội dung next.config.js hiện tại...
    set "swcminify_exists="
    set "styled_components_exists="
    
    for /f "tokens=*" %%a in (next.config.js) do (
        set "line=%%a"
        if "!line!"=="  swcMinify: true," set "swcminify_exists=1"
        if "!line:~0,15!"=="  compiler: {" set "styled_components_exists=1"
    )
    
    echo Cập nhật next.config.js...
    type next.config.js > next.config.js.temp
    
    if defined swcminify_exists (
        echo Đang xóa tùy chọn swcMinify không được hỗ trợ...
        powershell -Command "(Get-Content next.config.js.temp) -replace '  swcMinify: true,', '' | Set-Content next.config.js.new"
        del next.config.js.temp
        copy next.config.js.new next.config.js.temp >nul
        del next.config.js.new
    )
    
    if not defined styled_components_exists (
        echo Đang thêm hỗ trợ styled-components...
        powershell -Command "(Get-Content next.config.js.temp) -replace 'reactStrictMode: (true|false),', 'reactStrictMode: $1,\n  compiler: {\n    styledComponents: true\n  },' | Set-Content next.config.js.new"
        del next.config.js.temp
        move next.config.js.new next.config.js >nul
    ) else (
        move next.config.js.temp next.config.js >nul
    )
    
    echo Đã cập nhật next.config.js
) else (
    echo Không tìm thấy next.config.js, tạo file mới...
    echo // next.config.js > next.config.js
    echo const nextConfig = {>> next.config.js
    echo   reactStrictMode: true,>> next.config.js
    echo   compiler: {>> next.config.js
    echo     styledComponents: true>> next.config.js
    echo   },>> next.config.js
    echo   // Đã xóa tùy chọn swcMinify không được hỗ trợ>> next.config.js
    echo }>> next.config.js
    echo >> next.config.js
    echo module.exports = nextConfig>> next.config.js
    echo Đã tạo next.config.js mới
)
echo.
echo [4/5] Thiết lập biến môi trường...
echo NODE_OPTIONS=--max_old_space_size=4096 > .env.local
echo Đã thiết lập NODE_OPTIONS=--max_old_space_size=4096 trong .env.local
echo.
echo [5/5] Xóa cache và thư mục .next...
rd /s /q .next >nul 2>&1
echo Đã xóa thư mục .next
echo.
for /d %%i in (node_modules\.cache\*) do (
    rd /s /q "%%i" >nul 2>&1
)
echo Đã xóa cache trong node_modules\.cache
echo.
echo ========================================================
echo     HOÀN THÀNH SỬA LỖI XUNG ĐỘT SWC/BABEL
echo ========================================================
echo LƯU Ý: Không sử dụng file .babelrc khi bạn cần các tính năng yêu cầu SWC.
echo Nếu bạn cần cấu hình babel, hãy sử dụng next.config.js thay thế.
echo.
REM pause <- Đã xóa
REM if "%choice%"=="2" goto menu <- Đã xóa
exit /b 0

:fix_swcminify
cls
echo ========================================================
echo     SỬA LỖI TÙY CHỌN SWCMINIFY KHÔNG ĐƯỢC HỖ TRỢ
echo ========================================================
echo.
echo [1/2] Dừng các tiến trình Node.js đang chạy...
taskkill /F /IM node.exe >nul 2>&1
echo.
echo [2/2] Kiểm tra và cập nhật next.config.js...
if exist next.config.js (
    echo Tạo backup cho next.config.js...
    copy next.config.js next.config.js.swcminify.backup >nul
    
    echo Xóa tùy chọn swcMinify không được hỗ trợ...
    powershell -Command "(Get-Content next.config.js) -replace '  swcMinify: true,', '' | Set-Content next.config.js.new"
    move /y next.config.js.new next.config.js >nul
    echo Đã cập nhật next.config.js
) else (
    echo Không tìm thấy next.config.js, bỏ qua...
)
echo.
echo ========================================================
echo     HOÀN THÀNH SỬA LỖI TÙY CHỌN SWCMINIFY
echo ========================================================
echo.
REM pause <- Đã xóa
REM if "%choice%"=="3" goto menu <- Đã xóa
exit /b 0

:clean_cache
cls
echo ========================================================
echo     XÓA CACHE VÀ FILE NEXT.JS TẠM
echo ========================================================
echo.
echo [1/3] Dừng các tiến trình Node.js đang chạy...
taskkill /F /IM node.exe >nul 2>&1
echo.
echo [2/3] Xóa thư mục .next...
rd /s /q .next >nul 2>&1
echo Đã xóa thư mục .next
echo.
echo [3/3] Xóa cache trong node_modules\.cache...
for /d %%i in (node_modules\.cache\*) do (
    rd /s /q "%%i" >nul 2>&1
)
echo Đã xóa cache trong node_modules\.cache
echo.
echo ========================================================
echo     HOÀN THÀNH XÓA CACHE VÀ FILE TẠM
echo ========================================================
echo.
REM pause <- Đã xóa
REM if "%choice%"=="4" goto menu <- Đã xóa
exit /b 0

REM --- Khối :reinstall_deps đã bị xóa vì không còn dùng menu ---

:reinstall_all_auto
cls
echo ========================================================
echo     TỰ ĐỘNG CÀI ĐẶT LẠI TẤT CẢ DEPENDENCIES
echo ========================================================
echo.
echo Xóa thư mục node_modules...
rd /s /q node_modules >nul 2>&1
echo Cài đặt lại tất cả dependencies (npm install)...
call npm install
echo.
echo ========================================================
echo     HOÀN THÀNH CÀI ĐẶT LẠI DEPENDENCIES
echo ========================================================
echo.
REM Không cần pause ở đây vì được gọi từ run_all
exit /b 0

REM --- Khối :start_dev đã bị xóa vì không còn dùng menu ---

:eof
echo.
echo Tạm biệt!
timeout /t 2 >nul
exit /b 0
