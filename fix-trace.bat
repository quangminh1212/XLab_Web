@echo off
echo Fixing Next.js permission errors...
echo.

REM Kết thúc tất cả các tiến trình node.js đang chạy
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

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

echo Killing any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

REM Xóa hoàn toàn thư mục .next
if exist ".next" (
    echo Cleaning entire .next directory...
    
    REM Reset file attributes
    attrib -r -s -h ".next\*.*" /s /d >nul 2>&1
    
    REM Xóa từng thư mục con
    if exist ".next\trace" rd /s /q ".next\trace" >nul 2>&1
    if exist ".next\cache" rd /s /q ".next\cache" >nul 2>&1
    if exist ".next\server" rd /s /q ".next\server" >nul 2>&1
    if exist ".next\static" rd /s /q ".next\static" >nul 2>&1
    
    REM Xóa toàn bộ thư mục .next
    rd /s /q ".next" >nul 2>&1
    
    REM Kiểm tra nếu vẫn còn thư mục .next
    if exist ".next" (
        echo WARNING: Still having trouble removing .next directory
        echo Trying stronger removal method...
        
        REM Sử dụng del/rmdir với quyền mạnh hơn
        del /f /s /q ".next\*.*" >nul 2>&1
        rd /s /q ".next" >nul 2>&1
        
        if exist ".next" (
            echo WARNING: Unable to remove .next directory completely.
            echo Please manually delete the .next folder before proceeding.
            pause
        ) else (
            echo Successfully removed .next directory!
        )
    ) else (
        echo Successfully removed .next directory!
    )
) else (
    echo No .next directory found, proceeding with clean start.
)

REM Đặt các biến môi trường để tắt tracing và telemetry
echo Setting environment variables...
set NEXT_TELEMETRY_DISABLED=1
set NODE_OPTIONS=--max-old-space-size=4096 --no-warnings

echo.
echo Starting Next.js application in dev mode...
npm run dev

exit /B 0 