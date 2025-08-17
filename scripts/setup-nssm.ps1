param(
  [string]$ServiceName = "XLabNext",
  [string]$AppDir = (Resolve-Path "..").Path,
  [int]$Port = 3000,
  [string]$BindHost = "127.0.0.1",
  [string]$NssmPath = ""
)

# Ensure running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  Write-Error "Please run this script in an elevated PowerShell (Run as Administrator)."
  exit 1
}

# Resolve NSSM
if ([string]::IsNullOrWhiteSpace($NssmPath)) {
  $nssmCmd = (Get-Command nssm -ErrorAction SilentlyContinue)
  if ($nssmCmd) {
    $NssmPath = $nssmCmd.Source
  }
}
if (-not (Test-Path $NssmPath)) {
  Write-Error "NSSM not found. Install from https://nssm.cc/download and ensure 'nssm' is in PATH, or pass -NssmPath to this script."
  exit 1
}

$AppDir = (Resolve-Path $AppDir).Path
$StartBat = Join-Path $AppDir "start.bat"
if (-not (Test-Path $StartBat)) {
  Write-Error "start.bat not found in $AppDir"
  exit 1
}

$LogsDir = Join-Path $AppDir "logs"
if (-not (Test-Path $LogsDir)) { New-Item -ItemType Directory -Path $LogsDir | Out-Null }

$Cmd = "$env:ComSpec"
$SvcArgs = "/c `"$StartBat $Port $BindHost`""

Write-Host "Installing service '$ServiceName' with NSSM..."
& $NssmPath install $ServiceName $Cmd $SvcArgs | Out-Null
& $NssmPath set $ServiceName AppDirectory $AppDir | Out-Null
& $NssmPath set $ServiceName AppStdout (Join-Path $LogsDir "service.out.log") | Out-Null
& $NssmPath set $ServiceName AppStderr (Join-Path $LogsDir "service.err.log") | Out-Null
& $NssmPath set $ServiceName Start SERVICE_AUTO_START | Out-Null
& $NssmPath set $ServiceName AppStopMethodConsole 15000 | Out-Null
& $NssmPath set $ServiceName AppNoConsole 1 | Out-Null
& $NssmPath set $ServiceName AppThrottle 5000 | Out-Null
& $NssmPath set $ServiceName AppEnvironmentExtra "NODE_ENV=production" "NEXT_TELEMETRY_DISABLED=1" | Out-Null

Write-Host "Starting service..."
& $NssmPath start $ServiceName | Out-Null

Write-Host "Service '$ServiceName' installed and started."

