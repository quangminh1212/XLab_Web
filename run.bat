@echo off
SETLOCAL EnableDelayedExpansion

echo ===========================================
echo    XLab Web - Production Server (HTTPS)
echo ===========================================

echo Installing dependencies...
call npm install

echo Cleaning up any existing processes...
powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
powershell -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
timeout /t 2 > NUL

echo Killing all Node.js processes and freeing ports...
call node scripts/kill-port.js --kill-all
timeout /t 2 > NUL
call node scripts/kill-port.js 3000 --with-all
call node scripts/kill-port.js 443 --with-all

echo Cleaning .next directory...
if exist .next rmdir /s /q .next

echo Running comprehensive fixes and build...
call node scripts/fix-all-issues.js

echo Creating required directories and files...
if not exist .next mkdir .next
if not exist .next\server mkdir .next\server
if not exist .next\server\pages mkdir .next\server\pages
if not exist .next\standalone mkdir .next\standalone

echo Creating manifest files...
echo {"pages":{},"app":{}} > .next\server\font-manifest.json
echo {"pages":{},"app":{}} > .next\server\next-font-manifest.json
echo {} > .next\server\app-paths-manifest.json
echo {"version":1,"sortedMiddleware":[],"middleware":{},"functions":{},"staticAssets":[],"rsc":{"module":"","css":[],"function":{}}} > .next\server\middleware-manifest.json

echo Creating critical error pages...
mkdir -Force -Path .next\export 2>NUL
mkdir -Force -Path .next\server\pages 2>NUL
echo ^<!DOCTYPE html^>^<html^>^<head^>^<title^>500 - Server Error^</title^>^</head^>^<body^>^<h1^>500 - Server Error^</h1^>^<p^>Sorry, something went wrong.^</p^>^</body^>^</html^> > .next\export\500.html
echo ^<!DOCTYPE html^>^<html^>^<head^>^<title^>500 - Server Error^</title^>^</head^>^<body^>^<h1^>500 - Server Error^</h1^>^<p^>Sorry, something went wrong.^</p^>^</body^>^</html^> > .next\server\pages\500.html

echo Preparing HTTPS certificates...
if not exist .certificates mkdir .certificates
if not exist .certificates\localhost.crt (
  echo Generating self-signed certificates for HTTPS using PowerShell...
  
  REM Create PowerShell script for certificate generation
  echo $cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "cert:\CurrentUser\My" -NotAfter (Get-Date).AddYears(5) > .certificates\gen-cert.ps1
  echo $certPassword = ConvertTo-SecureString -String "password" -Force -AsPlainText >> .certificates\gen-cert.ps1
  echo $certPath = "Cert:\CurrentUser\My\$($cert.Thumbprint)" >> .certificates\gen-cert.ps1
  echo $pfxPath = "$PSScriptRoot\localhost.pfx" >> .certificates\gen-cert.ps1
  echo $crtPath = "$PSScriptRoot\localhost.crt" >> .certificates\gen-cert.ps1
  echo $keyPath = "$PSScriptRoot\localhost.key" >> .certificates\gen-cert.ps1
  echo Export-PfxCertificate -Cert $certPath -FilePath $pfxPath -Password $certPassword >> .certificates\gen-cert.ps1
  echo Export-Certificate -Cert $certPath -FilePath $crtPath -Type CERT >> .certificates\gen-cert.ps1
  echo $p12cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 >> .certificates\gen-cert.ps1
  echo $p12cert.Import($pfxPath, "password", [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable) >> .certificates\gen-cert.ps1
  echo $keyData = [System.Convert]::ToBase64String($p12cert.PrivateKey.ExportCspBlob($true)) >> .certificates\gen-cert.ps1
  echo Set-Content -Path $keyPath -Value "-----BEGIN PRIVATE KEY-----`n$keyData`n-----END PRIVATE KEY-----" >> .certificates\gen-cert.ps1
  echo Write-Host "Certificate files generated successfully!" >> .certificates\gen-cert.ps1
  
  REM Run the PowerShell script
  powershell -ExecutionPolicy Bypass -File .certificates\gen-cert.ps1
)

echo Starting production server in standalone mode with HTTPS...
SET HTTPS=true
SET SSL_CRT_FILE=.certificates\localhost.crt
SET SSL_KEY_FILE=.certificates\localhost.key
SET NODE_ENV=production

echo Running server with HTTPS support...
call cross-env NODE_ENV=production HTTPS=true node scripts/direct-start.js

if ERRORLEVEL 1 (
  echo ======================================================
  echo ERROR: Server failed to start in HTTPS mode
  echo ======================================================
  echo Falling back to HTTP mode...
  SET HTTPS=false
  call node .next\standalone\server.js
)

ENDLOCAL 