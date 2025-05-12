Write-Host "===== XLab_Web - Khởi động môi trường phát triển ====="

Write-Host "1. Dọn dẹp thư mục .next..."
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -Path ".next" -ItemType Directory -Force | Out-Null

Write-Host "2. Tạo các file vendor-chunks..."
node create-vendor-chunks.js

Write-Host "3. Tạo các file manifest..."
node create-manifest.js

Write-Host "4. Khởi động máy chủ Next.js..."
npm run dev 