@echo off
echo Fixing .next/trace permission errors...
echo.

REM Kết thúc tất cả các tiến trình node.js đang chạy
taskkill /f /im node.exe >nul 2>&1

REM Đảm bảo có quyền admin
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

REM Xóa thư mục .next/trace nếu tồn tại
if exist ".next\trace" (
    echo Removing .next\trace directory...
    rd /s /q ".next\trace" >nul 2>&1
    if exist ".next\trace" (
        echo Trying to forcefully remove trace directory...
        attrib -r -s -h ".next\trace" /s /d
        del /f /s /q ".next\trace\*.*" >nul 2>&1
        rd /s /q ".next\trace" >nul 2>&1
    )
)

REM Xóa thư mục .next/cache nếu tồn tại
if exist ".next\cache" (
    echo Cleaning .next\cache directory...
    rd /s /q ".next\cache" >nul 2>&1
)

REM Khởi động lại Next.js với tùy chọn không tạo trace
echo Running Next.js without tracing...
set NEXT_TRACING_MODE=off
set NEXT_TELEMETRY_DISABLED=1

echo.
echo Fixed! Now starting the application...
npm run dev

exit /B 0 