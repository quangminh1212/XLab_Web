$TunnelName = "xlab-id" 
$TargetPort = 3000 
 
Write-Host "Starting Serveo Tunnel..." 
 
try { 
    $process = Start-Process -FilePath "ssh" -ArgumentList "-R", "$($TunnelName):80:localhost:$TargetPort", "serveo.net" -PassThru -NoNewWindow 
    Write-Host "Serveo tunnel started with PID: $($process.Id)" 
    Write-Host "Your URL is: https://$($TunnelName).serveo.net" 
    Write-Host "If the subdomain is already in use, Serveo will assign a different one." 
    Write-Host "Check the output window for the exact URL." 
 
    Write-Host "Press Ctrl+C to stop tunnel..." 
    while ($true) { Start-Sleep -Seconds 1 } 
} 
catch { 
    Write-Host "Error: $_" -ForegroundColor Red 
} 
finally { 
    if ($process -ne $null -and -not $process.HasExited) { 
        Stop-Process -Id $process.Id -Force 
        Write-Host "Stopped Serveo tunnel" 
    } 
} 
