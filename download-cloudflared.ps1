# Simple Cloudflared Download Script
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    if (-not (Test-Path "cloudflared.exe")) {
        Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe" -UseBasicParsing
        Write-Host "Downloaded successfully"
    } else {
        Write-Host "Already exists"
    }
} catch {
    Write-Host "Download failed"
}
