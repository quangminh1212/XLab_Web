@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM XLab Web - Windows Development Starter
REM ========================================
REM Script tích hợp để khởi động môi trường development trên Windows

title XLab Web - Development Environment

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    XLab Web Development                     ║
echo ║                   Windows Starter Script                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Màu sắc cho Windows
color 0A

REM Kiểm tra Node.js
echo [INFO] Kiểm tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js chưa được cài đặt!
    echo [INFO] Vui lòng tải và cài đặt Node.js từ: https://nodejs.org/
    pause
    exit /b 1
)

REM Kiểm tra npm
echo [INFO] Kiểm tra npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm chưa được cài đặt!
    pause
    exit /b 1
)

REM Hiển thị thông tin hệ thống
echo [INFO] Thông tin hệ thống:
for /f "tokens=*" %%i in ('node --version') do echo - Node.js: %%i
for /f "tokens=*" %%i in ('npm --version') do echo - npm: %%i
echo - OS: Windows
echo - Mode: Development
echo.

REM Kiểm tra thư mục dự án
if not exist "package.json" (
    echo [ERROR] Không tìm thấy package.json!
    echo [INFO] Vui lòng chạy script này trong thư mục gốc của dự án.
    pause
    exit /b 1
)

REM Tạo thư mục cần thiết
echo [INFO] Tạo thư mục cần thiết...
if not exist "src\i18n\eng\product" mkdir "src\i18n\eng\product"
if not exist "src\i18n\vie\product" mkdir "src\i18n\vie\product"
if not exist ".next\cache" mkdir ".next\cache"
echo [SUCCESS] Đã tạo thư mục cần thiết

REM Sao chép file i18n nếu cần
echo [INFO] Kiểm tra file i18n...
if exist "src\i18n\vie\product\index.ts" (
    if not exist "src\i18n\eng\product\index.ts" (
        copy "src\i18n\vie\product\index.ts" "src\i18n\eng\product\index.ts" >nul
        echo [SUCCESS] Đã sao chép file i18n
    )
)

REM Kiểm tra file .env.local
echo [INFO] Kiểm tra file environment...
if not exist ".env.local" (
    echo [INFO] Tạo file .env.local...
    (
        echo NEXTAUTH_SECRET=Cmjb/lPYHoCnsiaEh0KwFkGG7POh6v3S3DXm169y8+U=
        echo NEXTAUTH_URL=http://localhost:3000
        echo GOOGLE_CLIENT_ID=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com
        echo GOOGLE_CLIENT_SECRET=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
        echo ADMIN_EMAILS=xlab.rnd@gmail.com
        echo NODE_ENV=development
    ) > .env.local
    echo [SUCCESS] Đã tạo file .env.local
)

REM Cài đặt dependencies
echo [INFO] Cài đặt dependencies...
echo [INFO] Điều này có thể mất vài phút...
call npm install
if errorlevel 1 (
    echo [ERROR] Lỗi khi cài đặt dependencies!
    echo [INFO] Thử chạy: npm cache clean --force
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies đã được cài đặt

REM Chạy fix scripts
echo [INFO] Chạy fix scripts...
if exist "scripts\fix-next-errors.js" (
    call node scripts\fix-next-errors.js
    echo [SUCCESS] Đã chạy fix-next-errors.js
)

if exist "scripts\fix-language-issues.js" (
    call node scripts\fix-language-issues.js
    echo [SUCCESS] Đã chạy fix-language-issues.js
)

REM Xóa cache Next.js
echo [INFO] Xóa cache Next.js...
if exist ".next" (
    rmdir /s /q ".next" 2>nul
    echo [SUCCESS] Đã xóa cache Next.js
)

REM Hiển thị menu lựa chọn
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                        MENU LỰA CHỌN                        ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  1. Khởi động Development Server (npm run dev)              ║
echo ║  2. Khởi động với Logger (npm run dev:log)                  ║
echo ║  3. Build Production (npm run build)                        ║
echo ║  4. Start Production (npm run start)                        ║
echo ║  5. Lint Code (npm run lint)                                ║
echo ║  6. Type Check (npm run type-check)                         ║
echo ║  7. Thoát                                                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

set /p choice="Nhập lựa chọn của bạn (1-7): "

if "%choice%"=="1" (
    echo [INFO] Khởi động Development Server...
    echo [INFO] Ứng dụng sẽ chạy tại: http://localhost:3000
    echo [INFO] Nhấn Ctrl+C để dừng server
    echo.
    call npm run dev
) else if "%choice%"=="2" (
    echo [INFO] Khởi động Development Server với Logger...
    echo [INFO] Ứng dụng sẽ chạy tại: http://localhost:3000
    echo [INFO] Nhấn Ctrl+C để dừng server
    echo.
    call npm run dev:log
) else if "%choice%"=="3" (
    echo [INFO] Build Production...
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Build thất bại!
    ) else (
        echo [SUCCESS] Build thành công!
    )
) else if "%choice%"=="4" (
    echo [INFO] Start Production...
    echo [INFO] Ứng dụng sẽ chạy tại: http://localhost:3000
    echo [INFO] Nhấn Ctrl+C để dừng server
    echo.
    call npm run start
) else if "%choice%"=="5" (
    echo [INFO] Lint Code...
    call npm run lint
) else if "%choice%"=="6" (
    echo [INFO] Type Check...
    call npm run type-check
) else if "%choice%"=="7" (
    echo [INFO] Thoát...
    exit /b 0
) else (
    echo [ERROR] Lựa chọn không hợp lệ!
    pause
    goto :eof
)

REM Giữ cửa sổ mở nếu có lỗi
if errorlevel 1 (
    echo.
    echo [ERROR] Có lỗi xảy ra. Nhấn phím bất kỳ để thoát...
    pause >nul
)

echo.
echo [INFO] Script hoàn tất. Nhấn phím bất kỳ để thoát...
pause >nul
