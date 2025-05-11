Write-Host "===== KIỂM TRA TRẠNG THÁI SWC =====" -ForegroundColor Green

# Kiểm tra .env.local
Write-Host "Kiểm tra .env.local:" -ForegroundColor Yellow
if (Test-Path ".env.local") {
    $envLocal = Get-Content .env.local
    Write-Host $envLocal -ForegroundColor Cyan
} else {
    Write-Host "Không tìm thấy file .env.local" -ForegroundColor Red
}

# Kiểm tra .babelrc
Write-Host "`nKiểm tra .babelrc:" -ForegroundColor Yellow
if (Test-Path ".babelrc") {
    $babelrc = Get-Content .babelrc
    Write-Host $babelrc -ForegroundColor Cyan
} else {
    Write-Host "Không tìm thấy file .babelrc" -ForegroundColor Red
}

# Kiểm tra .npmrc
Write-Host "`nKiểm tra .npmrc:" -ForegroundColor Yellow
if (Test-Path ".npmrc") {
    $npmrc = Get-Content .npmrc
    Write-Host $npmrc -ForegroundColor Cyan
} else {
    Write-Host "Không tìm thấy file .npmrc" -ForegroundColor Red
}

# Kiểm tra cấu hình trong next.config.js
Write-Host "`nKiểm tra next.config.js (phần experimental):" -ForegroundColor Yellow
if (Test-Path "next.config.js") {
    $nextConfig = Get-Content next.config.js -Raw
    if ($nextConfig -match "experimental:\s*{([^}]*)") {
        Write-Host $matches[0] -ForegroundColor Cyan
    } else {
        Write-Host "Không tìm thấy phần experimental trong next.config.js" -ForegroundColor Red
    }
} else {
    Write-Host "Không tìm thấy file next.config.js" -ForegroundColor Red
}

# Kiểm tra các package SWC đã cài đặt
Write-Host "`nKiểm tra các package SWC đã cài đặt:" -ForegroundColor Yellow
$packageJson = Get-Content package.json -Raw | ConvertFrom-Json
$hasSWCPackage = $false

if ($packageJson.devDependencies.PSObject.Properties.Name -contains "@next/swc-win32-x64-msvc") {
    Write-Host "@next/swc-win32-x64-msvc: $($packageJson.devDependencies.'@next/swc-win32-x64-msvc')" -ForegroundColor Red
    $hasSWCPackage = $true
}

if ($packageJson.devDependencies.PSObject.Properties.Name -contains "@next/swc-wasm-nodejs") {
    Write-Host "@next/swc-wasm-nodejs: $($packageJson.devDependencies.'@next/swc-wasm-nodejs')" -ForegroundColor Red
    $hasSWCPackage = $true
}

if (-not $hasSWCPackage) {
    Write-Host "Không tìm thấy các package SWC trong package.json" -ForegroundColor Green
}

# Kiểm tra cấu hình Babel
Write-Host "`nKiểm tra các package Babel đã cài đặt:" -ForegroundColor Yellow
$hasBabelPackage = $false

$babelPackages = @(
    "babel-loader",
    "@babel/core",
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
    "@babel/plugin-transform-runtime"
)

foreach ($pkg in $babelPackages) {
    if ($packageJson.devDependencies.PSObject.Properties.Name -contains $pkg) {
        Write-Host "$pkg`: $($packageJson.devDependencies.$pkg)" -ForegroundColor Green
        $hasBabelPackage = $true
    }
}

if (-not $hasBabelPackage) {
    Write-Host "Không tìm thấy các package Babel trong package.json" -ForegroundColor Red
}

Write-Host "`n===== KIỂM TRA HOÀN TẤT =====" -ForegroundColor Green 