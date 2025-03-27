@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

cd /d "%~dp0"
title XLab_Web - Next.js Dev Server

echo XLab Web - Next.js Startup Tool
echo ------------------------------

:: Kiểm tra tham số help
if "%1"=="help" goto :show_help
if "%1"=="--help" goto :show_help
if "%1"=="-h" goto :show_help
if "%1"=="/?" goto :show_help

:: Kiểm tra tham số fix
set FIX_MODE=0
if "%1"=="fix" set FIX_MODE=1
if "%1"=="--fix" set FIX_MODE=1
if "%1"=="-f" set FIX_MODE=1

:: Kiểm tra tham số
set CLEAN_MODE=0
if "%1"=="clean" set CLEAN_MODE=1
if "%1"=="--clean" set CLEAN_MODE=1
if "%1"=="-c" set CLEAN_MODE=1
if "%1"=="-r" set CLEAN_MODE=1
if "%1"=="reset" set CLEAN_MODE=1

:: Hiển thị chế độ chạy
if %CLEAN_MODE% EQU 1 (
  echo [Running in CLEAN mode]
) else if %FIX_MODE% EQU 1 (
  echo [Running in FIX mode]
) else (
  echo [Running in NORMAL mode]
)

:: Kiểm tra Node.js
echo [1/5] Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found! Please install Node.js v20+
    echo Visit https://nodejs.org to download and install
    pause
    exit /b 1
)

:: Hiển thị phiên bản Node.js
node --version | find "v20" >nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Recommended Node.js version is 20.x or higher
) else (
    echo Node.js version: && node --version
)

:: Kiểm tra và xử lý dọn dẹp nếu cần
echo [2/5] Cleaning previous builds and caches...

:: Dừng các quy trình Node.js đang chạy
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 1 >nul

:: Xóa các tệp cache
if exist .next rd /s /q .next >nul 2>&1
if exist .next-dev rd /s /q .next-dev >nul 2>&1
if exist node_modules\.cache rd /s /q node_modules\.cache >nul 2>&1

:: Trong chế độ fix, đảm bảo các module Next.js được cài đặt đúng
if %FIX_MODE% EQU 1 (
    echo [*] FIX MODE: Reinstalling Next.js and dependencies...
    
    :: Đảm bảo không có tệp lock nào ngăn cài đặt
    if exist package-lock.json del /f package-lock.json >nul 2>&1
    if exist node_modules\next rd /s /q node_modules\next >nul 2>&1
    if exist node_modules\react rd /s /q node_modules\react >nul 2>&1
    if exist node_modules\react-dom rd /s /q node_modules\react-dom >nul 2>&1
    
    :: Cài đặt lại các gói cốt lõi từng gói một
    echo Installing Next.js core packages individually...
    call npm install next@14.2.4 --no-fund --legacy-peer-deps --force
    call npm install react@latest --no-fund --legacy-peer-deps --force
    call npm install react-dom@latest --no-fund --legacy-peer-deps --force
    
    :: Sửa lỗi bảo mật
    echo Fixing security vulnerabilities...
    call npm audit fix --force
    
    echo [*] Fix completed. Dependencies have been reinstalled.
    goto :verify_dependencies
)

:: Nếu chọn chế độ clean, xóa hoàn toàn cài đặt
if %CLEAN_MODE% EQU 1 (
    echo [*] CLEAN MODE: Removing all dependencies and reinstalling...
    if exist node_modules rd /s /q node_modules >nul 2>&1
    if exist package-lock.json del /f package-lock.json >nul 2>&1
    
    :: Xóa cache npm để đảm bảo cài đặt mới sạch
    call npm cache clean --force >nul 2>&1
    
    :: Tạm dừng để đảm bảo tất cả các tệp đã được giải phóng
    timeout /t 2 >nul
    
    echo [*] All dependencies removed successfully.
)

:verify_dependencies
:: Kiểm tra node_modules
echo [3/5] Verifying dependencies...
if not exist node_modules (
    echo Node modules not found, installing dependencies...
    
    :: Cài đặt với tùy chọn legacy-peer-deps để tránh xung đột
    call npm install --no-fund --legacy-peer-deps
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo WARNING: Initial installation failed, trying alternative method...
        echo.
        
        :: Thử cài đặt từng gói cốt lõi trước
        call npm install next@14.2.4 --no-fund --legacy-peer-deps --force
        call npm install react@latest --no-fund --legacy-peer-deps --force
        call npm install react-dom@latest --no-fund --legacy-peer-deps --force
        
        :: Sau đó cài đặt các gói còn lại
        call npm install --no-fund --legacy-peer-deps
        
        if %ERRORLEVEL% NEQ 0 (
            echo.
            echo ERROR: Failed to install dependencies!
            echo Try running with 'run.bat fix' to fix installation issues.
            pause
            exit /b 1
        )
    )
    
    echo Dependencies installed successfully
) else (
    :: Kiểm tra xem next có tồn tại không
    if not exist node_modules\next\dist\bin\next.js (
        echo Next.js modules incomplete, reinstalling...
        
        :: Xóa các gói có thể gây xung đột
        if exist node_modules\next rd /s /q node_modules\next >nul 2>&1
        if exist node_modules\react rd /s /q node_modules\react >nul 2>&1
        if exist node_modules\react-dom rd /s /q node_modules\react-dom >nul 2>&1
        if exist package-lock.json del /f package-lock.json >nul 2>&1
        
        :: Cài đặt từng gói một để tránh xung đột
        call npm install next@14.2.4 --no-fund --legacy-peer-deps --force
        call npm install react@latest --no-fund --legacy-peer-deps --force
        call npm install react-dom@latest --no-fund --legacy-peer-deps --force
        
        if %ERRORLEVEL% NEQ 0 (
            echo.
            echo ERROR: Failed to install Next.js!
            echo Try running with 'run.bat fix' to fix installation issues.
            pause
            exit /b 1
        )
    )
)

:: Tắt telemetry
echo [4/5] Configuring Next.js...
call npx next telemetry disable >nul 2>&1

:: Tạo mẫu next.config.js nếu cần
if not exist next.config.js.template (
  echo /** @type {import('next').NextConfig} */ > next.config.js.template
  echo const nextConfig = { >> next.config.js.template
  echo   reactStrictMode: true, >> next.config.js.template
  echo   poweredByHeader: false, >> next.config.js.template
  echo   experimental: { >> next.config.js.template
  echo     scrollRestoration: true, >> next.config.js.template
  echo   }, >> next.config.js.template
  echo   webpack: function(config) { >> next.config.js.template
  echo     return config; >> next.config.js.template
  echo   }, >> next.config.js.template
  echo   distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next', >> next.config.js.template
  echo }; >> next.config.js.template
  echo. >> next.config.js.template
  echo module.exports = nextConfig; >> next.config.js.template
  echo Template file created for future use.
)

:: Kiểm tra cấu hình next.config.js
echo [+] Validating Next.js configuration...
if not exist next.config.js (
    echo WARNING: next.config.js not found!
    echo Creating default Next.js config file...
    
    :: Phương pháp 1 - Sao chép từ template
    if exist next.config.js.template (
      copy next.config.js.template next.config.js >nul
      echo Default configuration created from template!
      goto :check_config_size
    )
    
    :: Phương pháp 2 - Sử dụng NodeJS để tạo file
    echo Trying alternative method with Node.js...
    node -e "require('fs').writeFileSync('next.config.js', '/** @type {import(\'next\').NextConfig} */\nconst nextConfig = {\n  reactStrictMode: true,\n  poweredByHeader: false,\n  experimental: {\n    scrollRestoration: true,\n  },\n  webpack: function(config) {\n    return config;\n  },\n  distDir: process.env.NODE_ENV === \'development\' ? \'.next-dev\' : \'.next\',\n};\n\nmodule.exports = nextConfig;');"
    
    :: Kiểm tra kết quả
    if exist next.config.js (
      echo Default configuration created using Node.js!
    ) else (
      echo Failed to create config file. Using fallback method...
      :: Phương pháp 3 - Cuối cùng, sử dụng phương pháp echo
      type nul > next.config.js
      echo /** @type {import('next').NextConfig} */ > next.config.js
      echo const nextConfig = { >> next.config.js
      echo   reactStrictMode: true, >> next.config.js
      echo   poweredByHeader: false, >> next.config.js
      echo   experimental: { >> next.config.js
      echo     scrollRestoration: true, >> next.config.js
      echo   }, >> next.config.js
      echo   webpack: function(config) { >> next.config.js
      echo     return config; >> next.config.js
      echo   }, >> next.config.js
      echo   distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next', >> next.config.js
      echo }; >> next.config.js
      echo. >> next.config.js
      echo module.exports = nextConfig; >> next.config.js
      echo Default configuration created using echo commands!
    )
) else (
:check_config_size
    :: Lấy kích thước file
    for %%A in (next.config.js) do set filesize=%%~zA
    if !filesize! LEQ 100 (
        echo ERROR: next.config.js appears to be corrupted or empty
        echo Creating backup and generating default config...
        
        if exist next.config.js ren next.config.js next.config.js.bak
        
        :: Sử dụng template file nếu có
        if exist next.config.js.template (
          copy next.config.js.template next.config.js >nul
          echo Default configuration restored from template!
        ) else (
          :: Sử dụng Node.js để tạo file
          node -e "require('fs').writeFileSync('next.config.js', '/** @type {import(\'next\').NextConfig} */\nconst nextConfig = {\n  reactStrictMode: true,\n  poweredByHeader: false,\n  experimental: {\n    scrollRestoration: true,\n  },\n  webpack: function(config) {\n    return config;\n  },\n  distDir: process.env.NODE_ENV === \'development\' ? \'.next-dev\' : \'.next\',\n};\n\nmodule.exports = nextConfig;');"
          
          if %ERRORLEVEL% NEQ 0 (
            echo WARNING: Node.js method failed, using echo commands...
            type nul > next.config.js
            echo /** @type {import('next').NextConfig} */ > next.config.js
            echo const nextConfig = { >> next.config.js
            echo   reactStrictMode: true, >> next.config.js
            echo   poweredByHeader: false, >> next.config.js
            echo   experimental: { >> next.config.js
            echo     scrollRestoration: true, >> next.config.js
            echo   }, >> next.config.js
            echo   webpack: function(config) { >> next.config.js
            echo     return config; >> next.config.js
            echo   }, >> next.config.js
            echo   distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next', >> next.config.js
            echo }; >> next.config.js
            echo. >> next.config.js
            echo module.exports = nextConfig; >> next.config.js
          ) else (
            echo Default configuration created using Node.js!
          )
        )
    )
)

:: Đảm bảo Next.js đã được cài đặt đúng
if not exist node_modules\next\dist\bin\next.js (
    echo ERROR: Next.js not installed correctly.
    echo Try running 'run.bat fix' to repair the installation.
    pause
    exit /b 1
)

:: Cấu hình môi trường
echo [5/5] Starting development server...
set NODE_OPTIONS=--max-old-space-size=4096

:: Khởi động server
echo.
echo Starting Next.js development server...
echo Server will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

:: Sử dụng node trực tiếp để tránh các lỗi với npm scripts
node node_modules\next\dist\bin\next dev --port 3000

goto :eof

:show_help
echo.
echo XLab Web - Helper Script
echo ---------------------
echo.
echo Usage: run.bat [option]
echo.
echo Options:
echo   (no option)  Start normally without asking
echo   clean        Clean and reinstall all dependencies
echo   -c, --clean  Same as clean
echo   -r, reset    Reset and reinstall
echo   fix, --fix   Fix installation issues
echo   -f           Same as fix
echo   -h, --help   Show this help message
echo.
echo Examples:
echo   run.bat            - Normal startup (no questions)
echo   run.bat clean      - Clean all and reinstall
echo   run.bat fix        - Fix installation issues
echo   run.bat --help     - Show this help
echo.
exit /b 0

:eof
endlocal
exit /b 0 