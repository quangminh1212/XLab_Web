# Script to check product data from the API
Write-Host "Đang kiểm tra sản phẩm từ API..." -ForegroundColor Green

try {
    $products = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Get
    
    if ($products.success -eq $true) {
        $productCount = $products.data.Count
        Write-Host "Đã tìm thấy $productCount sản phẩm" -ForegroundColor Green
        
        $products.data | ForEach-Object {
            Write-Host "====================================" -ForegroundColor Gray
            Write-Host "Tên: $($_.name)" -ForegroundColor Cyan
            Write-Host "ID: $($_.id)" -ForegroundColor Gray
            Write-Host "Slug: $($_.slug)" -ForegroundColor Gray
            
            if ($_.versions -and $_.versions.Count -gt 0) {
                $firstVersion = $_.versions[0]
                Write-Host "Giá: $($firstVersion.price) VNĐ" -ForegroundColor Yellow
                
                if ($firstVersion.originalPrice -gt $firstVersion.price) {
                    $discount = [math]::Round((1 - ($firstVersion.price / $firstVersion.originalPrice)) * 100)
                    Write-Host "Giảm giá: $discount%" -ForegroundColor Red
                }
            }
            
            $statusText = if ($_.isPublished -eq $true) { "Công khai" } else { "Chưa công khai" }
            Write-Host "Trạng thái: $statusText" -ForegroundColor Blue
            Write-Host "====================================" -ForegroundColor Gray
        }
    } else {
        Write-Host "Không thể lấy dữ liệu sản phẩm: $($products.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "Lỗi khi kiểm tra sản phẩm: $_" -ForegroundColor Red
    Write-Host "Đảm bảo máy chủ đang chạy trên http://localhost:3000" -ForegroundColor Yellow
} 