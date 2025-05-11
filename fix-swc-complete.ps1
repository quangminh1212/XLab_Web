Write-Host "===== XỬ LÝ TRIỆT ĐỂ LỖI SWC TRONG NEXT.JS =====" -ForegroundColor Green

# Dừng tất cả các process node đang chạy
Write-Host "Dừng tất cả các process Node.js đang chạy..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Xóa các thư mục cache
Write-Host "Xóa các thư mục cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
}

# Tạo thư mục .next cần thiết
Write-Host "Tạo các thư mục cần thiết..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path .next/cache | Out-Null
New-Item -ItemType Directory -Force -Path .next/static | Out-Null
New-Item -ItemType Directory -Force -Path .next/server | Out-Null

# Cấu hình .env.local
Write-Host "Cấu hình .env.local..." -ForegroundColor Yellow
@"
NODE_OPTIONS=--no-warnings
NEXT_TELEMETRY_DISABLED=1
DISABLE_SWC=1
NEXT_DISABLE_SWC=1
NEXT_TRACE_PIPE_ERRORS=1
NEXT_DISABLE_EXTRACTION=true
NEXT_ENABLE_TRACE=false
"@ | Out-File -FilePath .env.local -Encoding utf8

# Cấu hình .npmrc
Write-Host "Cấu hình .npmrc..." -ForegroundColor Yellow
@"
legacy-peer-deps=true
node-linker=hoisted
preferred-cache-folder=.npm-cache
"@ | Out-File -FilePath .npmrc -Encoding utf8

# Di chuyển .babelrc sang backup nếu tồn tại
Write-Host "Xử lý .babelrc..." -ForegroundColor Yellow
if ((Test-Path ".babelrc") -and (-not (Test-Path ".babelrc.backup"))) {
    Move-Item -Path .babelrc -Destination .babelrc.backup
    Write-Host ".babelrc đã được di chuyển đến .babelrc.backup" -ForegroundColor Green
}

# Cập nhật next.config.js
Write-Host "Cập nhật next.config.js..." -ForegroundColor Yellow
$nextConfig = Get-Content -Path next.config.js -Raw
$nextConfig = $nextConfig -replace "swcMinify:\s*(?:true|false),?\r?\n?", ""
$nextConfig = $nextConfig -replace "incrementalCacheHandlerPath:\s*[`"'][^`"']*[`"'],?\r?\n?", ""
$nextConfig = $nextConfig -replace "experimental:\s*{[^}]*}", @"
experimental: {
    largePageDataBytes: 12800000,
    appDocumentPreloading: false
  }
"@
Set-Content -Path next.config.js -Value $nextConfig

# Cập nhật package.json
Write-Host "Cập nhật package.json..." -ForegroundColor Yellow
$packageJson = Get-Content -Path package.json -Raw | ConvertFrom-Json
foreach ($key in $packageJson.scripts.PSObject.Properties.Name) {
    $packageJson.scripts.$key = $packageJson.scripts.$key -replace "DISABLE_SWC=true\s*", ""
}
$packageJson | ConvertTo-Json -Depth 10 | Set-Content -Path package.json

# Cài đặt các dependencies cần thiết cho babel
Write-Host "Cài đặt các dependencies cho Babel..." -ForegroundColor Yellow
npm install --save-dev babel-loader@8.3.0 @babel/core@7.22.5 @babel/preset-env@7.22.5 @babel/preset-react@7.22.5 @babel/preset-typescript@7.22.5 @babel/plugin-transform-runtime@7.22.5

# Gỡ cài đặt swc modules
Write-Host "Gỡ cài đặt SWC modules..." -ForegroundColor Yellow
npm uninstall @next/swc-win32-x64-msvc @next/swc-wasm-nodejs

# Tạo .babelrc mới
Write-Host "Tạo .babelrc mới..." -ForegroundColor Yellow
@"
{
  "presets": [
    ["next/babel", {
      "preset-env": {},
      "preset-react": {},
      "preset-typescript": {},
      "transform-runtime": {},
      "styled-jsx": {}
    }]
  ],
  "plugins": []
}
"@ | Out-File -FilePath .babelrc -Encoding utf8

Write-Host "===== HOÀN TẤT XỬ LÝ LỖI SWC =====" -ForegroundColor Green
Write-Host "Khởi động lại Next.js bằng lệnh 'npm run dev'" -ForegroundColor Cyan 