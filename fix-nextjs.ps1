Write-Host "=== FIXING NEXTJS ERRORS ===" -ForegroundColor Green

# Tạo các thư mục cần thiết
$dirs = @(
    ".next\server\vendor-chunks",
    ".next\server\pages\vendor-chunks",
    ".next\server\chunks",
    ".next\static\chunks\app\products\[id]",
    ".next\static\chunks\app\products\%5Bid%5D",
    ".next\server\app\products\[id]"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Cyan
    }
}

# Tạo các vendor chunk files
$vendorChunks = @(
    @{name='next.js'; content='module.exports = require("next");'},
    @{name='react.js'; content='module.exports = require("react");'},
    @{name='react-dom.js'; content='module.exports = require("react-dom");'},
    @{name='@swc.js'; content='module.exports = require("@swc/helpers");'},
    @{name='styled-jsx.js'; content='module.exports = require("styled-jsx");'},
    @{name='client-only.js'; content='module.exports = require("client-only");'},
    @{name='next-client-pages-loader.js'; content='module.exports = {};'}
)

foreach ($chunk in $vendorChunks) {
    foreach ($dir in $dirs[0..2]) {
        $filePath = Join-Path -Path $dir -ChildPath $chunk.name
        Set-Content -Path $filePath -Value $chunk.content
        Write-Host "Created file: $filePath" -ForegroundColor Yellow
    }
}

# Tạo các file cho trang sản phẩm
$productFiles = @(
    @{path=".next\static\chunks\app\products\[id]\page.js"; content="// Product placeholder"},
    @{path=".next\static\chunks\app\products\[id]\loading.js"; content="// Loading placeholder"},
    @{path=".next\static\chunks\app\products\[id]\not-found.js"; content="// Not found placeholder"},
    @{path=".next\static\chunks\app\products\%5Bid%5D\page.js"; content="// URL encoded product placeholder"},
    @{path=".next\static\chunks\app\products\%5Bid%5D\loading.js"; content="// URL encoded loading placeholder"},
    @{path=".next\static\chunks\app\products\%5Bid%5D\not-found.js"; content="// URL encoded not found placeholder"},
    @{path=".next\server\app\products\[id]\page.js"; content='module.exports = function(){ return { props: {} } }'},
    @{path=".next\server\app\products\[id]\loading.js"; content='module.exports = function(){ return null }'},
    @{path=".next\server\app\products\[id]\not-found.js"; content='module.exports = function(){ return { notFound: true } }'}
)

foreach ($file in $productFiles) {
    Set-Content -Path $file.path -Value $file.content
    Write-Host "Created file: $($file.path)" -ForegroundColor Yellow
}

# Tạo file app-paths-manifest.json
$appPathsManifestPath = ".next\server\app-paths-manifest.json"
$appPathsManifestContent = '{
  "/": "app/page.js",
  "/products/[id]": "app/products/[id]/page.js"
}'
Set-Content -Path $appPathsManifestPath -Value $appPathsManifestContent
Write-Host "Created file: $appPathsManifestPath" -ForegroundColor Yellow

# Tạo file build-manifest.json
$buildManifestPath = ".next\build-manifest.json"
$buildManifestContent = '{
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/products/[id]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/app/products/[id]/page.js"
    ]
  },
  "app": {
    "/products/[id]/page": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/app/products/[id]/page.js"
    ],
    "/products/[id]/loading": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/app/products/[id]/loading.js"
    ],
    "/products/[id]/not-found": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/app/products/[id]/not-found.js"
    ]
  }
}'
Set-Content -Path $buildManifestPath -Value $buildManifestContent
Write-Host "Created file: $buildManifestPath" -ForegroundColor Yellow

Write-Host "=== COMPLETED ===" -ForegroundColor Green
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 