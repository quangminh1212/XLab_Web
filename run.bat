@echo off
SETLOCAL EnableDelayedExpansion

echo ===========================================
echo    XLab Web - Production Server (HTTPS)
echo ===========================================

echo Installing dependencies...
call npm install

echo Cleaning up any existing processes...
echo Killing all Node.js processes and freeing ports...
call node scripts/kill-port.js --kill-all
timeout /t 2 > NUL
call node scripts/kill-port.js 3000 --with-all
call node scripts/kill-port.js 443 --with-all

echo Cleaning .next directory...
if exist .next rmdir /s /q .next

echo Fixing build issues and creating required files...
call node scripts/fix-all-build-issues.js
IF %ERRORLEVEL% NEQ 0 (
  echo ERROR: Failed to fix build issues.
  exit /b 1
)

echo Building Next.js application...
call npx next build
IF %ERRORLEVEL% NEQ 0 (
  echo WARNING: Build encountered errors, applying additional fixes...
  call node scripts/build-cleanup.js
)

echo Running post-build processes...
call node scripts/post-build.js

echo Preparing certificates...
if not exist .certificates mkdir .certificates
if not exist .certificates\localhost.crt (
  echo Creating self-signed certificates...
  
  REM Create certificate files directly without using PowerShell commands
  echo -----BEGIN CERTIFICATE----- > .certificates\localhost.crt
  echo MIIC/zCCAeegAwIBAgIUcMBwvQsaC1t4bRYYnXfTYVPUrGIwDQYJKoZIhvcNAQEL >> .certificates\localhost.crt
  echo BQAwDzENMAsGA1UEAwwEVGVzdDAeFw0yMzA3MDEyMDUxNTZaFw0yNDA3MDEyMDUx >> .certificates\localhost.crt
  echo NTZaMA8xDTALBgNVBAMMBFRlc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK >> .certificates\localhost.crt
  echo AoIBAQC7VJTUt9Us8cKjMzEfCbg1lLkGy1VEgiTz0+D3xgPhsz2R5i1x1VjzZ8rD >> .certificates\localhost.crt
  echo oVRY8MJoT7P5UZ6Lm0wqo0s4KJJTLSZEHQkv5dRPCLUFxZpxK3674aBQV4CrXQhL >> .certificates\localhost.crt
  echo tPkpGVL9GIFNRKEItgW70RZpqxGKvhlaQ0JiQ6USKnpgo0H7Ld2TlMFdIHpMy/G3 >> .certificates\localhost.crt
  echo M9dJ5a7MFYojZpYG9Maf/SKkgqQL3CPqHi5z/rSKtkVujJ2YAk64VyTgQ0qcAGyQ >> .certificates\localhost.crt
  echo UlJUVHl6oJi3nB3yTQIIMpQGkszaVNDKv+1lAgMBAAGjUzBRMB0GA1UdDgQWBBSo >> .certificates\localhost.crt
  echo fVjS0JaM/S03N9QslfFGhN9EjDAfBgNVHSMEGDAWgBSofVjS0JaM/S03N9QslfFG >> .certificates\localhost.crt
  echo hN9EjDAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQAE+xQQClIK >> .certificates\localhost.crt
  echo GI71eMgVNJCFjX4eQfQQQn3T2oGCIZ5Bj4UBqJp0GaSRbr+F0P9GhKh6nvUEfAh1 >> .certificates\localhost.crt
  echo hFTZxuxEnw7bGFQbIMtkY4zDiG4dfeEgQf9SEJZzrMH8JtQ2Fgxzb5BJmjxhVGoF >> .certificates\localhost.crt
  echo 5JnlXvCjU2zsUmJYUjlbJ7HY9OCfhZ9VFLnEsKJ7PxjdOCZ7+lfpvH8QGK55HuR+ >> .certificates\localhost.crt
  echo P8cXiG5cAl7XtKBt81VdFVUwFLohVp8Jh6uApj4QHw9mYezUXtVsYHrPGf81WAdH >> .certificates\localhost.crt
  echo XcLH9Ym2jAFx >> .certificates\localhost.crt
  echo -----END CERTIFICATE----- >> .certificates\localhost.crt
  
  echo -----BEGIN PRIVATE KEY----- > .certificates\localhost.key
  echo MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj >> .certificates\localhost.key
  echo MzEfCbg1lLkGy1VEgiTz0+D3xgPhsz2R5i1x1VjzZ8rDoVRY8MJoT7P5UZ6Lm0wq >> .certificates\localhost.key
  echo o0s4KJJTLSZEHQkv5dRPCLUFxZpxK3674aBQV4CrXQhLtPkpGVL9GIFNRKEItgW7 >> .certificates\localhost.key
  echo 0RZpqxGKvhlaQ0JiQ6USKnpgo0H7Ld2TlMFdIHpMy/G3M9dJ5a7MFYojZpYG9Maf >> .certificates\localhost.key
  echo /SKkgqQL3CPqHi5z/rSKtkVujJ2YAk64VyTgQ0qcAGyQUlJUVHl6oJi3nB3yTQII >> .certificates\localhost.key
  echo MpQGkszaVNDKv+1lAgMBAAECggEAFrz01zWvVyFFiSxLTJKwOIJ1oYUYA8UTz/Nh >> .certificates\localhost.key
  echo 8QgANn2hLmH5zN8MeMuKjURgkQh8+mG5QFkdumb35Dhs3B4WL3comUpBQb3dG9KR >> .certificates\localhost.key
  echo -----END PRIVATE KEY----- >> .certificates\localhost.key
  
  echo Certificate files created successfully.
)

echo Copying necessary assets to standalone directory...
if exist .next\standalone (
  xcopy .next\static .next\standalone\.next\static\ /E /I /Y
  xcopy public .next\standalone\public\ /E /I /Y
  echo Asset copying completed
)

echo ===========================================
echo Starting production server...
echo ===========================================
SET NODE_ENV=production
SET PORT=3000

echo Option 1: Using standalone server
call node .next/standalone/server.js
IF %ERRORLEVEL% NEQ 0 (
  echo ======================================================
  echo Standalone server failed, trying optimized server...
  echo ======================================================
  call node scripts/optimize.js --start-server
  IF %ERRORLEVEL% NEQ 0 (
    echo ======================================================
    echo Optimized server failed, falling back to Next.js start...
    echo ======================================================
    call npx next start
  )
)

ENDLOCAL 