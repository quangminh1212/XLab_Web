Write-Host "Checking for .next/trace file..."
$tracePath = Join-Path -Path (Get-Location) -ChildPath ".next\trace"
if (Test-Path $tracePath) {
    Write-Host "Found .next/trace file. Deleting..."
    try {
        Set-ItemProperty -Path $tracePath -Name IsReadOnly -Value $false -ErrorAction SilentlyContinue
        Remove-Item -Path $tracePath -Force
        Write-Host "Successfully deleted .next/trace file."
    } catch {
        Write-Host "Error deleting file: $_"
    }
} else {
    Write-Host ".next/trace file doesn't exist. No action needed."
}

Write-Host "Checking next.config.js configuration..."
$configContent = Get-Content -Path "next.config.js" -Raw
Write-Host "Configuration content:"
Write-Host $configContent

Write-Host "Checking if Next.js can start..."
Write-Host "Running npm run dev command and waiting for 5 seconds..."
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
Start-Sleep -Seconds 5
Write-Host "Checking running processes..."
Get-Process -Name "node" | Where-Object {$_.CommandLine -like "*next*"} | Format-Table Id, ProcessName, StartTime

Write-Host "Done! Check the above output for results." 