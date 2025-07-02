@echo off
title XLab Web - Quick Start
echo.
echo ==========================================
echo    XLab Web - Quick Start
echo ==========================================
echo.

:: Parse command-line arguments
set MODE=dev
if not "%1"=="" set MODE=%1

if "%MODE%"=="deploy" (
    goto deploy
) else if "%MODE%"=="prod" (
    goto production
) else if "%MODE%"=="https" (
    goto https_setup
) else (
    goto development
)

:development
echo Installing dependencies...
call npm install
echo.

echo Preparing i18n directories...
if not exist "src\i18n\eng\product" (
    mkdir "src\i18n\eng\product"
    echo Created directory: src\i18n\eng\product
)

echo Copying product files from Vietnamese to English...
if exist "src\i18n\vie\product\chatgpt.json" (
    copy "src\i18n\vie\product\chatgpt.json" "src\i18n\eng\product\chatgpt.json"
    echo Copied: chatgpt.json
)
if exist "src\i18n\vie\product\grok.json" (
    copy "src\i18n\vie\product\grok.json" "src\i18n\eng\product\grok.json"
    echo Copied: grok.json
)
if exist "src\i18n\vie\product\index.ts" (
    copy "src\i18n\vie\product\index.ts" "src\i18n\eng\product\index.ts"
    echo Copied: index.ts
)

echo Installing json5 specifically...
call npm install json5
echo.

echo Fixing language comparison issues...
call node scripts/fix-language-issues.js
echo.

echo Clearing Next.js cache...
if exist ".next" (
    rd /s /q ".next"
)
echo.
echo Starting development server without timestamps...
echo.

cd %~dp0
npm run dev:log

rem Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo Error occurred. Press any key to exit...
    pause >nul
)
goto end

:production
echo.
echo ==========================================
echo    XLab Web - Production Mode
echo ==========================================
echo.
echo Installing dependencies...
call npm install --production
echo.

echo Building for production...
call npm run build
echo.

echo Starting production server...
call npm run start
goto end

:deploy
echo.
echo ==========================================
echo    XLab Web - Deployment Setup
echo ==========================================
echo.

echo 1. Installing dependencies...
call npm install
echo.

echo 2. Creating production environment file...
if not exist ".env.production" (
    echo NEXTAUTH_URL=https://%2 > .env.production
    echo NEXTAUTH_SECRET=^<your-secret-key^> >> .env.production
    echo NODE_ENV=production >> .env.production
    echo # Add other environment variables as needed >> .env.production
    echo Created .env.production file. Please edit it with your actual values.
) else (
    echo .env.production already exists, skipping creation.
)
echo.

echo 3. Building for production...
call npm run build
echo.

echo 4. Creating Nginx configuration...
echo server { > nginx-xlab-config.conf
echo     listen 80; >> nginx-xlab-config.conf
echo     server_name %2; >> nginx-xlab-config.conf
echo. >> nginx-xlab-config.conf
echo     location / { >> nginx-xlab-config.conf
echo         proxy_pass http://localhost:3000; >> nginx-xlab-config.conf
echo         proxy_http_version 1.1; >> nginx-xlab-config.conf
echo         proxy_set_header Upgrade $http_upgrade; >> nginx-xlab-config.conf
echo         proxy_set_header Connection 'upgrade'; >> nginx-xlab-config.conf
echo         proxy_set_header Host $host; >> nginx-xlab-config.conf
echo         proxy_cache_bypass $http_upgrade; >> nginx-xlab-config.conf
echo         proxy_set_header X-Real-IP $remote_addr; >> nginx-xlab-config.conf
echo         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; >> nginx-xlab-config.conf
echo         proxy_set_header X-Forwarded-Proto $scheme; >> nginx-xlab-config.conf
echo     } >> nginx-xlab-config.conf
echo. >> nginx-xlab-config.conf
echo     # Bảo mật headers >> nginx-xlab-config.conf
echo     add_header X-Frame-Options "DENY"; >> nginx-xlab-config.conf
echo     add_header X-Content-Type-Options "nosniff"; >> nginx-xlab-config.conf
echo     add_header Referrer-Policy "strict-origin-when-cross-origin"; >> nginx-xlab-config.conf
echo     add_header X-XSS-Protection "1; mode=block"; >> nginx-xlab-config.conf
echo } >> nginx-xlab-config.conf
echo.
echo Created Nginx configuration: nginx-xlab-config.conf
echo.

echo 5. Creating deployment instructions file...
echo # XLab Web Deployment Instructions > deployment-steps.md
echo. >> deployment-steps.md
echo ## 1. Cài đặt lên máy chủ >> deployment-steps.md
echo. >> deployment-steps.md
echo ```bash >> deployment-steps.md
echo # Cài đặt Node.js 18+ và npm >> deployment-steps.md
echo # Sao chép mã nguồn lên máy chủ >> deployment-steps.md
echo # Sao chép file .env.production đã tạo vào thư mục gốc >> deployment-steps.md
echo # Chạy lệnh sau để cài đặt PM2 >> deployment-steps.md
echo npm install -g pm2 >> deployment-steps.md
echo. >> deployment-steps.md
echo # Khởi chạy ứng dụng với PM2 >> deployment-steps.md
echo pm2 start npm --name "xlab-web" -- start >> deployment-steps.md
echo pm2 save >> deployment-steps.md
echo pm2 startup >> deployment-steps.md
echo ``` >> deployment-steps.md
echo. >> deployment-steps.md
echo ## 2. Cấu hình Nginx >> deployment-steps.md
echo. >> deployment-steps.md
echo ```bash >> deployment-steps.md
echo # Cài đặt Nginx >> deployment-steps.md
echo sudo apt update >> deployment-steps.md
echo sudo apt install nginx >> deployment-steps.md
echo. >> deployment-steps.md
echo # Sao chép file nginx-xlab-config.conf đã tạo vào thư mục cấu hình Nginx >> deployment-steps.md
echo sudo cp nginx-xlab-config.conf /etc/nginx/sites-available/xlab-web >> deployment-steps.md
echo sudo ln -s /etc/nginx/sites-available/xlab-web /etc/nginx/sites-enabled/ >> deployment-steps.md
echo sudo nginx -t >> deployment-steps.md
echo sudo systemctl restart nginx >> deployment-steps.md
echo ``` >> deployment-steps.md
echo. >> deployment-steps.md
echo ## 3. Cấu hình DNS >> deployment-steps.md
echo. >> deployment-steps.md
echo 1. Đăng nhập vào bảng điều khiển của nhà cung cấp tên miền của bạn >> deployment-steps.md
echo 2. Thêm bản ghi A cho domain của bạn: >> deployment-steps.md
echo    - Hostname: @ (domain chính) >> deployment-steps.md
echo    - Giá trị: [IP máy chủ của bạn] >> deployment-steps.md
echo 3. Thêm bản ghi A cho www: >> deployment-steps.md
echo    - Hostname: www >> deployment-steps.md
echo    - Giá trị: [IP máy chủ của bạn] >> deployment-steps.md
echo. >> deployment-steps.md
echo ## 4. Cấu hình HTTPS (SSL) >> deployment-steps.md
echo. >> deployment-steps.md
echo ```bash >> deployment-steps.md
echo # Cài đặt Certbot >> deployment-steps.md
echo sudo apt install certbot python3-certbot-nginx >> deployment-steps.md
echo sudo certbot --nginx -d %2 -d www.%2 >> deployment-steps.md
echo ``` >> deployment-steps.md
echo. >> deployment-steps.md

echo.
echo 6. Creating PM2 ecosystem file...
echo module.exports = { > ecosystem.config.js
echo   apps : [{ >> ecosystem.config.js
echo     name: 'xlab-web', >> ecosystem.config.js
echo     script: 'npm', >> ecosystem.config.js
echo     args: 'start', >> ecosystem.config.js
echo     instances: 1, >> ecosystem.config.js
echo     autorestart: true, >> ecosystem.config.js
echo     watch: false, >> ecosystem.config.js
echo     max_memory_restart: '512M', >> ecosystem.config.js
echo     env: { >> ecosystem.config.js
echo       NODE_ENV: 'production', >> ecosystem.config.js
echo     } >> ecosystem.config.js
echo   }] >> ecosystem.config.js
echo }; >> ecosystem.config.js
echo.
echo Created PM2 ecosystem file: ecosystem.config.js
echo.

echo ==========================================
echo Deployment setup complete!
echo.
echo Domain name set to: %2
echo.
echo Next steps:
echo 1. Edit the .env.production file with your actual values
echo 2. Upload the project to your server
echo 3. Follow the steps in deployment-steps.md
echo ==========================================
goto end

:https_setup
echo.
echo ==========================================
echo    XLab Web - HTTPS Configuration
echo ==========================================
echo.

echo This script will help you configure HTTPS for your XLab Web application.
echo.
echo Before continuing, make sure:
echo  1. Your application is already deployed
echo  2. Nginx is installed and configured
echo  3. Your domain is pointing to your server's IP address
echo.

set /p DOMAIN=Enter your domain name (e.g., example.com): 

echo.
echo Creating HTTPS configuration script...
echo #!/bin/bash > https-setup.sh
echo echo "Setting up HTTPS for %DOMAIN%" >> https-setup.sh
echo. >> https-setup.sh
echo echo "Installing Certbot..." >> https-setup.sh
echo apt update >> https-setup.sh
echo apt install -y certbot python3-certbot-nginx >> https-setup.sh
echo. >> https-setup.sh
echo echo "Obtaining SSL certificate..." >> https-setup.sh
echo certbot --nginx -d %DOMAIN% -d www.%DOMAIN% --non-interactive --agree-tos --email webmaster@%DOMAIN% >> https-setup.sh
echo. >> https-setup.sh
echo echo "Verifying HTTPS configuration..." >> https-setup.sh
echo nginx -t >> https-setup.sh
echo systemctl reload nginx >> https-setup.sh
echo. >> https-setup.sh
echo echo "Setting up auto-renewal..." >> https-setup.sh
echo echo "0 3 * * * certbot renew --quiet" | tee -a /etc/crontab >> https-setup.sh
echo. >> https-setup.sh
echo echo "Testing auto-renewal..." >> https-setup.sh
echo certbot renew --dry-run >> https-setup.sh
echo. >> https-setup.sh
echo echo "HTTPS setup completed successfully!" >> https-setup.sh
echo echo "Your site should now be accessible at https://%DOMAIN%" >> https-setup.sh

echo Creating Next.js HTTPS configuration file...
echo // HTTPS configuration for Next.js > https-nextjs-config.js
echo const fs = require('fs'); >> https-nextjs-config.js
echo const path = require('path'); >> https-nextjs-config.js
echo const https = require('https'); >> https-nextjs-config.js
echo const next = require('next'); >> https-nextjs-config.js
echo. >> https-nextjs-config.js
echo // Update these paths to match your certificate locations >> https-nextjs-config.js
echo const certPath = '/etc/letsencrypt/live/%DOMAIN%'; >> https-nextjs-config.js
echo. >> https-nextjs-config.js
echo const dev = process.env.NODE_ENV !== 'production'; >> https-nextjs-config.js
echo const app = next({ dev }); >> https-nextjs-config.js
echo const handle = app.getRequestHandler(); >> https-nextjs-config.js
echo. >> https-nextjs-config.js
echo const httpsOptions = { >> https-nextjs-config.js
echo   key: fs.readFileSync(path.join(certPath, 'privkey.pem')), >> https-nextjs-config.js
echo   cert: fs.readFileSync(path.join(certPath, 'fullchain.pem')) >> https-nextjs-config.js
echo }; >> https-nextjs-config.js
echo. >> https-nextjs-config.js
echo app.prepare().then(() => { >> https-nextjs-config.js
echo   https.createServer(httpsOptions, (req, res) => { >> https-nextjs-config.js
echo     handle(req, res); >> https-nextjs-config.js
echo   }).listen(3001, err => { >> https-nextjs-config.js
echo     if (err) throw err; >> https-nextjs-config.js
echo     console.log('> HTTPS: Ready on https://localhost:3001'); >> https-nextjs-config.js
echo   }); >> https-nextjs-config.js
echo }); >> https-nextjs-config.js

echo Creating HTTPS instructions file...
echo # XLab Web HTTPS Setup Instructions > https-instructions.md
echo. >> https-instructions.md
echo ## 1. Transfer these files to your server >> https-instructions.md
echo. >> https-instructions.md
echo Copy the following files to your server: >> https-instructions.md
echo - https-setup.sh >> https-instructions.md
echo - https-nextjs-config.js (optional - only if you want Next.js to directly handle HTTPS) >> https-instructions.md
echo. >> https-instructions.md
echo ## 2. Run the HTTPS setup script >> https-instructions.md
echo. >> https-instructions.md
echo ```bash >> https-instructions.md
echo # Make the script executable >> https-instructions.md
echo chmod +x https-setup.sh >> https-instructions.md
echo. >> https-instructions.md
echo # Run the script as root >> https-instructions.md
echo sudo ./https-setup.sh >> https-instructions.md
echo ``` >> https-instructions.md
echo. >> https-instructions.md
echo ## 3. Verify HTTPS Setup >> https-instructions.md
echo. >> https-instructions.md
echo Visit your website using HTTPS: >> https-instructions.md
echo - https://%DOMAIN% >> https-instructions.md
echo. >> https-instructions.md
echo You should see a secure padlock icon in your browser. >> https-instructions.md
echo. >> https-instructions.md
echo ## 4. Force HTTPS Redirect (Optional) >> https-instructions.md
echo. >> https-instructions.md
echo To force all HTTP traffic to HTTPS, update your Nginx configuration: >> https-instructions.md
echo. >> https-instructions.md
echo ```nginx >> https-instructions.md
echo server { >> https-instructions.md
echo     listen 80; >> https-instructions.md
echo     server_name %DOMAIN% www.%DOMAIN%; >> https-instructions.md
echo     return 301 https://$host$request_uri; >> https-instructions.md
echo } >> https-instructions.md
echo ``` >> https-instructions.md
echo. >> https-instructions.md
echo ## 5. Using Next.js with Direct HTTPS (Alternative Method) >> https-instructions.md
echo. >> https-instructions.md
echo If you prefer to have Next.js handle HTTPS directly (instead of through Nginx): >> https-instructions.md
echo. >> https-instructions.md
echo 1. Install the created https-nextjs-config.js file >> https-instructions.md
echo 2. Run it with: >> https-instructions.md
echo. >> https-instructions.md
echo ```bash >> https-instructions.md
echo node https-nextjs-config.js >> https-instructions.md
echo ``` >> https-instructions.md
echo. >> https-instructions.md
echo Note: This is generally not recommended for production. Using Nginx as a reverse proxy is the preferred method. >> https-instructions.md
echo. >> https-instructions.md
echo ## 6. Certificate Auto-Renewal >> https-instructions.md
echo. >> https-instructions.md
echo The setup script has already configured automatic renewal of your SSL certificates. >> https-instructions.md
echo Certificates will be automatically renewed when they're approaching expiration. >> https-instructions.md

echo.
echo ==========================================
echo HTTPS setup files created successfully!
echo.
echo Files created:
echo - https-setup.sh (Script to set up HTTPS on your server)
echo - https-nextjs-config.js (For direct Next.js HTTPS configuration)
echo - https-instructions.md (Instructions for HTTPS setup)
echo.
echo Next steps:
echo 1. Transfer these files to your server
echo 2. Follow the instructions in https-instructions.md
echo ==========================================
goto end

:end 