@echo off
setlocal enabledelayedexpansion

title XLab Web - Công cụ sửa lỗi tổng hợp
color 0A

:menu
cls
echo ========================================================
echo     XLab Web - CÔNG CỤ SỬA LỖI TỔNG HỢP
echo ========================================================
echo.
echo  [1] Sửa lỗi WEBPACK (Cannot read properties of undefined (reading 'call'))
echo  [2] Sửa lỗi xung đột SWC/BABEL (next/font yêu cầu SWC thay vì Babel)
echo  [3] Sửa lỗi tùy chọn SWCMINIFY không được hỗ trợ
echo  [4] Xóa cache và file NEXT.JS tạm
echo  [5] Cài đặt lại các DEPENDENCIES
echo  [6] Chạy tất cả các bước sửa lỗi theo thứ tự
echo  [7] Chạy dự án (npm run dev)
echo  [0] Thoát
echo.
echo ========================================================
echo.

set /p choice=Nhập lựa chọn của bạn (0-7): 

if "%choice%"=="0" goto :eof
if "%choice%"=="1" goto fix_webpack
if "%choice%"=="2" goto fix_swc_babel
if "%choice%"=="3" goto fix_swcminify
if "%choice%"=="4" goto clean_cache
if "%choice%"=="5" goto reinstall_deps
if "%choice%"=="6" goto run_all
if "%choice%"=="7" goto start_dev
goto menu

:run_all
cls
echo ========================================================
echo     ĐANG CHẠY TẤT CẢ CÁC BƯỚC SỬA LỖI
echo ========================================================
echo.
call :fix_webpack
call :fix_swc_babel
call :fix_swcminify
call :clean_cache
call :reinstall_deps
echo.
echo ========================================================
echo     HOÀN THÀNH TẤT CẢ CÁC BƯỚC SỬA LỖI
echo ========================================================
echo.
pause
goto menu

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
pause
if "%choice%"=="1" goto menu
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
pause
if "%choice%"=="2" goto menu
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
pause
if "%choice%"=="3" goto menu
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
pause
if "%choice%"=="4" goto menu
exit /b 0

:reinstall_deps
cls
echo ========================================================
echo     CÀI ĐẶT LẠI CÁC DEPENDENCIES
echo ========================================================
echo.
echo Chọn các dependency cần cài đặt:
echo  [1] Cài đặt lại React và React DOM (phiên bản 18.2.0)
echo  [2] Cài đặt Webpack phiên bản 5.82.1
echo  [3] Cài đặt Next.js phiên bản 13.4.8
echo  [4] Cài đặt styled-components
echo  [5] Cài đặt các UI components (@radix-ui/react-slot, class-variance-authority, clsx, tailwind-merge)
echo  [6] Xóa node_modules và cài đặt lại tất cả dependencies
echo  [0] Quay lại menu chính
echo.
set /p deps_choice=Nhập lựa chọn của bạn (0-6): 

if "%deps_choice%"=="0" goto menu
if "%deps_choice%"=="1" (
    echo Cài đặt lại React và React DOM (phiên bản 18.2.0)...
    call npm install react@18.2.0 react-dom@18.2.0
)
if "%deps_choice%"=="2" (
    echo Cài đặt Webpack phiên bản 5.82.1...
    call npm install --save-dev webpack@5.82.1
)
if "%deps_choice%"=="3" (
    echo Cài đặt Next.js phiên bản 13.4.8...
    call npm install next@13.4.8
)
if "%deps_choice%"=="4" (
    echo Cài đặt styled-components...
    call npm install styled-components
)
if "%deps_choice%"=="5" (
    echo Cài đặt các UI components...
    call npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
)
if "%deps_choice%"=="6" (
    echo Xóa node_modules và cài đặt lại tất cả dependencies...
    echo CẢNH BÁO: Quá trình này có thể mất nhiều thời gian!
    
    echo Bạn có chắc chắn muốn tiếp tục? (y/n)
    set /p confirm=
    if /i "%confirm%"=="y" (
        echo Xóa thư mục node_modules...
        rd /s /q node_modules >nul 2>&1
        echo Cài đặt lại tất cả dependencies...
        call npm install
    ) else (
        echo Đã hủy thao tác.
    )
)
echo.
echo ========================================================
echo     HOÀN THÀNH CÀI ĐẶT DEPENDENCIES
echo ========================================================
echo.
pause
goto reinstall_deps

:start_dev
cls
echo ========================================================
echo     KHỞI ĐỘNG DỰ ÁN - NPM RUN DEV
echo ========================================================
echo.
echo Khởi động dự án với lệnh npm run dev...
call npm run dev

pause
goto menu

:eof
echo.
echo Cảm ơn bạn đã sử dụng công cụ sửa lỗi XLab Web!
timeout /t 2 >nul
exit /b 0
