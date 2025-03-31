@echo off
setlocal enabledelayedexpansion

title XLab Web - Tự động sửa lỗi và cài đặt
color 0A

REM --- Bắt đầu thực thi tự động ---
echo ========================================================
echo     BẮT ĐẦU QUÁ TRÌNH KIỂM TRA VÀ SỬA LỖI TỰ ĐỘNG
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
REM Khối lệnh này giờ sẽ kiểm tra và chỉ sửa những thành phần cần thiết
echo.
echo --- Đang kiểm tra và sửa lỗi tự động --- 
echo.

REM Kiểm tra webpack
call :check_webpack_issue
if "%webpack_issue%"=="1" (
    call :fix_webpack
)

REM Kiểm tra SWC/BABEL
call :check_swc_babel_issue
if "%swc_babel_issue%"=="1" (
    call :fix_swc_babel
)

REM Kiểm tra swcMinify
call :check_swcminify_issue
if "%swcminify_issue%"=="1" (
    call :fix_swcminify
)

REM Luôn xóa cache vì điều này không gây hại
call :clean_cache

REM Kiểm tra dependencies có thiếu không
call :check_dependencies_issue
if "%dependencies_issue%"=="1" (
    call :reinstall_all_auto
)

echo.
exit /b 0

:check_webpack_issue
set "webpack_issue=0"
echo Kiểm tra vấn đề webpack...

REM Kiểm tra phiên bản webpack hiện tại
if exist node_modules\webpack (
    set "webpack_version="
    for /f "tokens=*" %%a in ('npm list webpack --depth=0 2^>nul ^| findstr /C:"webpack@"') do (
        set webpack_info=%%a
        for /f "tokens=2 delims=@" %%b in ("!webpack_info!") do (
            set webpack_version=%%b
        )
    )
    
    if "!webpack_version!"=="" (
        echo Không thể xác định phiên bản webpack
        set "webpack_issue=1"
    ) else (
        echo Phiên bản webpack hiện tại: !webpack_version!
        REM Kiểm tra xem phiên bản có phải là 5.82.1 không
        if not "!webpack_version!"=="5.82.1" (
            echo Phiên bản webpack không phải là 5.82.1, cần cập nhật
            set "webpack_issue=1"
        ) else (
            echo Phiên bản webpack đã OK (5.82.1)
        )
    )
) else (
    echo Webpack chưa được cài đặt, cần cài đặt
    set "webpack_issue=1"
)

REM Kiểm tra React và React DOM
if exist node_modules\react (
    set "react_version="
    for /f "tokens=*" %%a in ('npm list react --depth=0 2^>nul ^| findstr /C:"react@"') do (
        set react_info=%%a
        for /f "tokens=2 delims=@" %%b in ("!react_info!") do (
            set react_version=%%b
        )
    )
    
    if "!react_version!"=="" (
        echo Không thể xác định phiên bản React
        set "webpack_issue=1"
    ) else (
        echo Phiên bản React hiện tại: !react_version!
        if not "!react_version!"=="18.2.0" (
            echo Phiên bản React không phải là 18.2.0, cần cập nhật
            set "webpack_issue=1"
        ) else (
            echo Phiên bản React đã OK (18.2.0)
        )
    )
) else (
    echo React chưa được cài đặt, cần cài đặt
    set "webpack_issue=1"
)

exit /b 0

:check_swc_babel_issue
set "swc_babel_issue=0"
echo Kiểm tra vấn đề SWC/BABEL...

REM Kiểm tra file .babelrc
if exist .babelrc (
    echo File .babelrc tồn tại, cần xử lý xung đột SWC/BABEL
    set "swc_babel_issue=1"
)

REM Kiểm tra cấu hình styled-components trong next.config.js
if exist next.config.js (
    set "styled_components_exists=0"
    for /f "tokens=*" %%a in (next.config.js) do (
        set "line=%%a"
        if "!line:~0,15!"=="  compiler: {" set "styled_components_exists=1"
    )
    
    if not "!styled_components_exists!"=="1" (
        echo next.config.js thiếu cấu hình styled-components, cần cập nhật
        set "swc_babel_issue=1"
    ) else (
        echo Cấu hình styled-components trong next.config.js đã OK
    )
) else (
    echo File next.config.js không tồn tại, cần tạo mới
    set "swc_babel_issue=1"
)

exit /b 0

:check_swcminify_issue
set "swcminify_issue=0"
echo Kiểm tra vấn đề swcMinify...

REM Kiểm tra tùy chọn swcMinify trong next.config.js
if exist next.config.js (
    set "swcminify_exists=0"
    for /f "tokens=*" %%a in (next.config.js) do (
        set "line=%%a"
        if "!line!"=="  swcMinify: true," set "swcminify_exists=1"
    )
    
    if "!swcminify_exists!"=="1" (
        echo Tùy chọn swcMinify tồn tại trong next.config.js, cần xóa
        set "swcminify_issue=1"
    ) else (
        echo Không có tùy chọn swcMinify trong next.config.js, OK
    )
) else (
    echo File next.config.js không tồn tại, sẽ được tạo bởi bước fix_swc_babel
)

exit /b 0

:check_dependencies_issue
set "dependencies_issue=0"
echo Kiểm tra vấn đề dependencies...

REM Kiểm tra thư mục node_modules
if not exist node_modules (
    echo Thư mục node_modules không tồn tại, cần cài đặt dependencies
    set "dependencies_issue=1"
    exit /b 0
)

REM Kiểm tra package.json và node_modules có khớp nhau không
if exist package.json (
    echo Kiểm tra dependencies từ package.json...
    
    REM Đọc các dependencies chính từ package.json
    for /f "tokens=*" %%a in ('findstr /C:"\"react\":" package.json') do (
        if not exist node_modules\react (
            echo React không được cài đặt, cần cài đặt lại dependencies
            set "dependencies_issue=1"
        )
    )
    
    for /f "tokens=*" %%a in ('findstr /C:"\"next\":" package.json') do (
        if not exist node_modules\next (
            echo Next.js không được cài đặt, cần cài đặt lại dependencies
            set "dependencies_issue=1"
        )
    )
    
    for /f "tokens=*" %%a in ('findstr /C:"\"styled-components\":" package.json') do (
        if not exist node_modules\styled-components (
            echo styled-components không được cài đặt, cần cài đặt lại dependencies
            set "dependencies_issue=1"
        )
    )
) else (
    echo File package.json không tồn tại, không thể kiểm tra dependencies
    set "dependencies_issue=1"
)

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
if exist node_modules\.cache (
    for /d %%i in (node_modules\.cache\*) do (
        rd /s /q "%%i" >nul 2>&1
    )
    echo Đã xóa cache trong node_modules\.cache
) else (
    echo Thư mục node_modules\.cache không tồn tại, bỏ qua
)
echo.
echo ========================================================
echo     HOÀN THÀNH XÓA CACHE VÀ FILE TẠM
echo ========================================================
echo.
exit /b 0

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
exit /b 0

:eof
echo.
echo Quá trình sửa lỗi đã hoàn tất!
timeout /t 2 >nul
exit /b 0
