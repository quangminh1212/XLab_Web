# XLab Web - UPnP Port Forwarding Setup
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                XLab Web - UPnP Setup" -ForegroundColor Cyan
Write-Host "              Tu dong mo port 80 bang UPnP" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "[ERROR] Script nay can quyen Administrator!" -ForegroundColor Red
    Write-Host "[INFO] Vui long chay PowerShell as Administrator" -ForegroundColor Yellow
    Read-Host "Nhan Enter de thoat"
    exit 1
}

Write-Host "[SUCCESS] Dang chay voi quyen Administrator" -ForegroundColor Green

# Enable UPnP service
Write-Host "[INFO] Kich hoat UPnP service..." -ForegroundColor Yellow
try {
    Set-Service -Name "upnphost" -StartupType Automatic -ErrorAction Stop
    Start-Service -Name "upnphost" -ErrorAction Stop
    Write-Host "[SUCCESS] UPnP service da duoc kich hoat" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Khong the kich hoat UPnP service: $($_.Exception.Message)" -ForegroundColor Red
}

# Enable UPnP in Windows Firewall
Write-Host "[INFO] Kich hoat UPnP trong Windows Firewall..." -ForegroundColor Yellow
try {
    netsh firewall set service type=upnp mode=enable | Out-Null
    Write-Host "[SUCCESS] UPnP da duoc kich hoat trong firewall" -ForegroundColor Green
}
catch {
    Write-Host "[WARNING] Khong the kich hoat UPnP trong firewall" -ForegroundColor Yellow
}

# Try to create UPnP port mapping using COM object
Write-Host "[INFO] Thu tao UPnP port mapping..." -ForegroundColor Yellow
try {
    $upnp = New-Object -ComObject HNetCfg.NATUPnP
    $mappings = $upnp.StaticPortMappingCollection
    
    # Remove existing mapping if any
    try {
        $mappings.Remove(80, "TCP")
    } catch {}
    
    # Add new mapping
    $mappings.Add(80, "TCP", 80, "192.168.1.113", $true, "XLab Web HTTP")
    Write-Host "[SUCCESS] Da tao UPnP port mapping cho port 80" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Khong the tao UPnP mapping: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "[INFO] Router co the khong ho tro UPnP hoac da tat" -ForegroundColor Yellow
}

# Alternative: Use netsh
Write-Host "[INFO] Thu phuong phap khac voi netsh..." -ForegroundColor Yellow
try {
    netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=80 connectaddress=127.0.0.1 | Out-Null
    Write-Host "[SUCCESS] Da tao port proxy 8080 -> 80" -ForegroundColor Green
    Write-Host "[INFO] Co the truy cap qua: http://xlab.id.vn:8080" -ForegroundColor Yellow
}
catch {
    Write-Host "[WARNING] Khong the tao port proxy" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                UPnP SETUP COMPLETE" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  UPnP Service: Enabled" -ForegroundColor White
Write-Host "  Port Mapping: 80 -> 192.168.1.113:80" -ForegroundColor White
Write-Host "  Alternative: Port 8080 -> 80" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[INFO] Test cac URL sau:" -ForegroundColor Yellow
Write-Host "  - http://xlab.id.vn" -ForegroundColor White
Write-Host "  - http://xlab.id.vn:8080" -ForegroundColor White
Write-Host "  - http://1.52.110.251" -ForegroundColor White
Write-Host "  - http://1.52.110.251:8080" -ForegroundColor White

Read-Host "Nhan Enter de tiep tuc"
