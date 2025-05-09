Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "      Tối ưu hóa và khởi động dự án Next.js - XLab_Web" -ForegroundColor Cyan 
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "Bắt đầu quá trình dọn dẹp và khởi động lại..." -ForegroundColor Green

# 1. Dọn dẹp file trace
Write-Host "`n[1/5] Kiểm tra và xóa file trace..." -ForegroundColor Yellow
$tracePath = Join-Path -Path (Get-Location) -ChildPath ".next\trace"
if (Test-Path $tracePath) {
    try {
        Set-ItemProperty -Path $tracePath -Name IsReadOnly -Value $false -ErrorAction SilentlyContinue
        Remove-Item -Path $tracePath -Force -ErrorAction Stop
        Write-Host "  ✓ Đã xóa file trace thành công." -ForegroundColor Green
    } catch {
        Write-Host "  ✕ Lỗi khi xóa file trace: $_" -ForegroundColor Red
        Write-Host "  ! Đang thử phương pháp khác..." -ForegroundColor Yellow
        try {
            cmd /c "attrib -r -s -h .next\trace"
            cmd /c "del /f /q .next\trace"
            if (!(Test-Path $tracePath)) {
                Write-Host "  ✓ Đã xóa file trace thành công bằng CMD." -ForegroundColor Green
            } else {
                Write-Host "  ! Không thể xóa file trace. Có thể cần chạy với quyền quản trị." -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  ✕ Vẫn không thể xóa file trace: $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ✓ Không tìm thấy file trace, không cần xử lý." -ForegroundColor Green
}

# 2. Xóa bớt thư mục .next
Write-Host "`n[2/5] Dọn dẹp thư mục .next..." -ForegroundColor Yellow
$nextDir = Join-Path -Path (Get-Location) -ChildPath ".next"
if (Test-Path $nextDir) {
    # Xóa các thư mục cache
    $cacheDirs = @(
        "cache",
        "static\webpack",
        "static\development",
        "static\chunks\webpack"
    )
    
    foreach ($dir in $cacheDirs) {
        $dirPath = Join-Path -Path $nextDir -ChildPath $dir
        if (Test-Path $dirPath) {
            try {
                Remove-Item -Path $dirPath -Recurse -Force -ErrorAction Stop
                Write-Host "  ✓ Đã xóa thành công thư mục $dir" -ForegroundColor Green
            } catch {
                Write-Host "  ✕ Không thể xóa thư mục $dir: $_" -ForegroundColor Red
            }
        }
    }
    
    # Xóa các file hot-update
    Get-ChildItem -Path $nextDir -Recurse -Filter "*.hot-update.*" | ForEach-Object {
        try {
            Remove-Item -Path $_.FullName -Force -ErrorAction Stop
            Write-Host "  ✓ Đã xóa file $($_.Name)" -ForegroundColor Green
        } catch {
            Write-Host "  ✕ Không thể xóa file $($_.Name): $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ! Thư mục .next không tồn tại, sẽ được tạo khi khởi động ứng dụng." -ForegroundColor Yellow
}

# 3. Kiểm tra cấu hình Next.js
Write-Host "`n[3/5] Kiểm tra cấu hình Next.js..." -ForegroundColor Yellow
$configContent = Get-Content -Path "next.config.js" -Raw
$regexExperimental = 'experimental\s*\:\s*\{'
$regexTracingExcludes = 'outputFileTracingExcludes\s*\:'
$hasExperimentalTracing = $configContent -match "$regexExperimental[^}]*$regexTracingExcludes"
$hasStandaloneTracing = $configContent -match "$regexTracingExcludes"

if ($hasExperimentalTracing) {
    Write-Host "  ! Phát hiện 'outputFileTracingExcludes' trong experimental." -ForegroundColor Red
    Write-Host "  ! Tạo bản sao lưu và sửa cấu hình..." -ForegroundColor Yellow
    
    Copy-Item -Path "next.config.js" -Destination "next.config.js.backup" -Force
    
    # Sử dụng approach khác để thay thế
    $searchPattern = 'experimental\s*\:\s*\{'
    $replacement = 'experimental: {'
    
    # Tìm vị trí của experimental
    $match = [regex]::Match($configContent, $searchPattern)
    if ($match.Success) {
        # Tìm vị trí của dấu ngoặc đóng tương ứng
        $startPos = $match.Index
        $bracketPos = $startPos + $match.Length - 1  # vị trí của dấu { đầu tiên
        $depth = 1
        $endPos = -1
        
        for ($i = $bracketPos + 1; $i -lt $configContent.Length; $i++) {
            $char = $configContent[$i]
            if ($char -eq '{') {
                $depth++
            } elseif ($char -eq '}') {
                $depth--
                if ($depth -eq 0) {
                    $endPos = $i
                    break
                }
            }
        }
        
        if ($endPos -ne -1) {
            $experimentalBlock = $configContent.Substring($startPos, $endPos - $startPos + 1)
            
            # Kiểm tra và xóa outputFileTracingExcludes trong khối experimental
            $tracingExcludesMatch = [regex]::Match($experimentalBlock, 'outputFileTracingExcludes\s*\:\s*\{([^{}]*(\{[^{}]*\})*[^{}]*)\}')
            if ($tracingExcludesMatch.Success) {
                $tracingExcludesContent = $tracingExcludesMatch.Groups[1].Value
                
                # Tạo mới khối experimental không có outputFileTracingExcludes
                $newExperimentalBlock = $experimentalBlock.Substring(0, $tracingExcludesMatch.Index) + 
                                       $experimentalBlock.Substring($tracingExcludesMatch.Index + $tracingExcludesMatch.Length)
                
                # Tạo outputFileTracingExcludes độc lập
                $newTracingExcludes = "outputFileTracingExcludes: {$tracingExcludesContent}"
                
                # Thay thế trong file gốc
                $beforeExp = $configContent.Substring(0, $startPos)
                $afterExp = $configContent.Substring($endPos + 1)
                
                # Sửa lại khối experimental và thêm outputFileTracingExcludes
                $fixedContent = $beforeExp + $newExperimentalBlock + ",`n  " + $newTracingExcludes + $afterExp
                
                Set-Content -Path "next.config.js" -Value $fixedContent -Force
                Write-Host "  ✓ Đã sửa cấu hình next.config.js" -ForegroundColor Green
            } else {
                Write-Host "  ! Không tìm thấy cấu trúc outputFileTracingExcludes để sửa" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  ! Không thể xác định vị trí kết thúc của khối experimental" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ! Không tìm thấy khối experimental" -ForegroundColor Yellow
    }
} elseif ($hasStandaloneTracing) {
    Write-Host "  ✓ Cấu hình 'outputFileTracingExcludes' đã đúng vị trí." -ForegroundColor Green
} else {
    Write-Host "  ! Không tìm thấy 'outputFileTracingExcludes' trong cấu hình." -ForegroundColor Yellow
}

# 4. Tối ưu các file không cần thiết
Write-Host "`n[4/5] Tối ưu hóa dự án..." -ForegroundColor Yellow
$filesToDelete = @(
    "restart.bat",
    "restart.ps1",
    "restart-dev.js"
)

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        try {
            Remove-Item -Path $file -Force -ErrorAction Stop
            Write-Host "  ✓ Đã xóa file: $file" -ForegroundColor Green
        } catch {
            Write-Host "  ✕ Không thể xóa file $file: $_" -ForegroundColor Red
        }
    }
}

# 5. Chạy các script fix lỗi
Write-Host "`n[5/5] Chạy fix-all-errors để hoàn thành cài đặt..." -ForegroundColor Yellow
node fix-trace-error.js
node fix-all-errors.js

Write-Host "`n===================================================================" -ForegroundColor Cyan
Write-Host "            Dự án đã được tối ưu hóa thành công!" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Cyan

Write-Host "`nBạn có muốn khởi động ứng dụng ngay bây giờ không? (Y/N)" -ForegroundColor Yellow
$response = Read-Host
if ($response.ToLower() -eq "y") {
    Write-Host "`nĐang khởi động ứng dụng Next.js..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "`nBạn có thể khởi động ứng dụng sau bằng lệnh 'npm run dev'" -ForegroundColor Yellow
}

# Dọn dẹp trước khi kết thúc
if (Test-Path "next.config.js.backup") {
    Write-Host "Lưu ý: File next.config.js.backup được tạo để dự phòng khi cần khôi phục" -ForegroundColor Yellow
}

Write-Host "`nQuá trình hoàn tất!" -ForegroundColor Green 