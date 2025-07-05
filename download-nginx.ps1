# Simple Nginx Download Script
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    
    if (-not (Test-Path "C:\nginx")) {
        New-Item -ItemType Directory -Path "C:\nginx" -Force | Out-Null
    }
    
    if (-not (Test-Path "C:\nginx\nginx.exe")) {
        Write-Host "Downloading Nginx..."
        Invoke-WebRequest -Uri "http://nginx.org/download/nginx-1.24.0.zip" -OutFile "nginx.zip" -UseBasicParsing
        
        Write-Host "Extracting..."
        Expand-Archive -Path "nginx.zip" -DestinationPath "." -Force
        Copy-Item "nginx-1.24.0\*" -Destination "C:\nginx" -Recurse -Force
        Remove-Item "nginx-1.24.0" -Recurse -Force
        Remove-Item "nginx.zip" -Force
        
        Write-Host "Nginx installed successfully"
    } else {
        Write-Host "Nginx already installed"
    }
} catch {
    Write-Host "Installation failed: $($_.Exception.Message)"
}
