@echo off
title XLab Web - Serveo Tunnel Setup
echo.
echo ==========================================
echo    XLab Web - Serveo Tunnel Setup
echo ==========================================
echo.

:: Kiểm tra quyền admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Cần quyền quản trị để cài đặt. Vui lòng chạy với quyền admin.
    pause
    exit
)

:: Kiểm tra Git/SSH đã cài đặt chưa
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo Git chưa được cài đặt. Đang tải và cài đặt Git...
    
    :: Tạo thư mục tạm
    mkdir temp >nul 2>&1
    
    :: Tải Git installer
    echo Đang tải Git installer...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.39.0.windows.1/Git-2.39.0-64-bit.exe' -OutFile 'temp\git_installer.exe'"
    
    :: Cài đặt Git im lặng
    echo Đang cài đặt Git (có thể mất vài phút)...
    start /wait temp\git_installer.exe /VERYSILENT /NORESTART
    
    :: Xóa file tạm
    rmdir /s /q temp
    
    echo Git đã được cài đặt thành công!
    echo Khởi động lại script để tiếp tục...
    pause
    exit
) else (
    echo Git đã được cài đặt trên hệ thống.
)

:: Kiểm tra SSH đã cài đặt chưa
where ssh >nul 2>&1
if %errorlevel% neq 0 (
    echo SSH không tìm thấy. Cài lại Git với SSH hoặc cài đặt OpenSSH...
    pause
    exit
) else (
    echo SSH đã được cài đặt trên hệ thống.
)

:: Tạo file PowerShell để chạy Serveo
echo $TunnelName = "xlab-id" > run-serveo.ps1
echo $TargetPort = 3000 >> run-serveo.ps1
echo. >> run-serveo.ps1
echo Write-Host "Bắt đầu Serveo Tunnel..." >> run-serveo.ps1
echo. >> run-serveo.ps1
echo try { >> run-serveo.ps1
echo     # Khởi động kết nối Serveo >> run-serveo.ps1
echo     $process = Start-Process -FilePath "ssh" -ArgumentList "-R", "$($TunnelName):80:localhost:$TargetPort", "serveo.net" -PassThru -NoNewWindow >> run-serveo.ps1
echo     Write-Host "Serveo tunnel started with PID: $($process.Id)" >> run-serveo.ps1
echo     Write-Host "URL của bạn có thể là: https://$($TunnelName).serveo.net" >> run-serveo.ps1
echo     Write-Host "Nếu subdomain đã được sử dụng, Serveo sẽ tự động cấp một subdomain khác." >> run-serveo.ps1
echo     Write-Host "Kiểm tra cửa sổ output để biết URL chính xác." >> run-serveo.ps1
echo. >> run-serveo.ps1
echo     # Đợi cho đến khi người dùng hủy >> run-serveo.ps1
echo     Write-Host "Nhấn Ctrl+C để dừng tunnel..." >> run-serveo.ps1
echo     while ($true) { Start-Sleep -Seconds 1 } >> run-serveo.ps1
echo } >> run-serveo.ps1
echo catch { >> run-serveo.ps1
echo     Write-Host "Lỗi: $_" -ForegroundColor Red >> run-serveo.ps1
echo } >> run-serveo.ps1
echo finally { >> run-serveo.ps1
echo     if ($process -ne $null -and -not $process.HasExited) { >> run-serveo.ps1
echo         Stop-Process -Id $process.Id -Force >> run-serveo.ps1
echo         Write-Host "Đã dừng Serveo tunnel" >> run-serveo.ps1
echo     } >> run-serveo.ps1
echo } >> run-serveo.ps1

:: Chạy Serveo trong PowerShell
echo.
echo Khởi động Serveo tunnel...
echo.
echo ==========================================
echo QUAN TRỌNG - Để kết nối thành công:
echo.
echo 1. Khi được hỏi "Are you sure you want to continue connecting" 
echo    gõ "yes" và nhấn Enter
echo.
echo 2. Đợi cho URL hiện ra (thường là https://xlab-id.serveo.net)
echo.
echo 3. Sau khi có URL, cập nhật bản ghi DNS trên TenTen:
echo    - Tên: xlab
echo    - Loại: CNAME
echo    - Giá trị: xlab-id.serveo.net (hoặc URL bạn nhận được)
echo ==========================================
echo.
echo Nhấn phím bất kỳ để bắt đầu...
pause >nul

start powershell -NoExit -ExecutionPolicy Bypass -File run-serveo.ps1

:: Tự động chạy Next.js
echo.
echo Khởi động Next.js server...
cd /d %~dp0
start "Next.js Server" cmd /k "npm run dev"

echo.
echo ==========================================
echo Tất cả dịch vụ đã khởi động thành công!
echo.
echo - Next.js đang chạy tại http://localhost:3000
echo - Serveo tunnel đang chạy (kiểm tra cửa sổ PowerShell để lấy URL)
echo - CNAME trong DNS TenTen nên trỏ đến [subdomain].serveo.net
echo ==========================================
echo.
echo Để dừng dịch vụ, đóng các cửa sổ PowerShell và Next.js
echo.
pause 