@echo off
chcp 65001 > nul
title XLab Web - Sửa lỗi hiển thị ký tự
color 0A

echo ===================================
echo XLab Web - Công cụ sửa lỗi hiển thị ký tự
echo ===================================
echo.

echo Đang cấu hình PowerShell để hiển thị đúng ký tự tiếng Việt...

:: Tạo file PowerShell để cài đặt và cấu hình UTF-8
echo $PSDefaultParameterValues['*:Encoding'] = 'utf8' > fix-encoding.ps1
echo [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 >> fix-encoding.ps1
echo [Console]::InputEncoding = [System.Text.Encoding]::UTF8 >> fix-encoding.ps1
echo Set-ItemProperty -Path "HKCU:\Console" -Name CodePage -Value 65001 >> fix-encoding.ps1
echo Write-Host "Đã cấu hình PowerShell để sử dụng UTF-8" -ForegroundColor Green >> fix-encoding.ps1
echo Write-Host "Vui lòng khởi động lại terminal để áp dụng thay đổi" -ForegroundColor Yellow >> fix-encoding.ps1

:: Chạy file PowerShell với quyền admin
echo Đang chạy script PowerShell...
powershell -ExecutionPolicy Bypass -File fix-encoding.ps1

:: Xóa file tạm
del fix-encoding.ps1

echo.
echo Quá trình cấu hình đã hoàn tất.
echo Vui lòng đóng terminal hiện tại và mở lại để áp dụng thay đổi.
echo.
pause 