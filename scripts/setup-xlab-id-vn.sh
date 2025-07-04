#!/bin/bash

# Script triển khai hoàn chỉnh XLab Web cho domain xlab.id.vn
# Usage: sudo ./scripts/setup-xlab-id-vn.sh

set -e

echo "🚀 Bắt đầu thiết lập XLab Web cho domain xlab.id.vn..."
echo "📍 Server IP: 1.52.110.251"

# Kiểm tra quyền root
if [[ $EUID -ne 0 ]]; then
   echo "❌ Script này cần chạy với quyền root (sudo)"
   exit 1
fi

# 1. Cập nhật hệ thống
echo "🔄 Cập nhật hệ thống..."
apt update && apt upgrade -y

# 2. Cài đặt các package cần thiết
echo "📦 Cài đặt packages..."
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw

# 3. Cài đặt Node.js 18
echo "📦 Cài đặt Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 4. Cài đặt PM2
echo "📦 Cài đặt PM2..."
npm install -g pm2

# 5. Thiết lập firewall
echo "🔒 Thiết lập firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443

# 6. Tạo thư mục ứng dụng
echo "📁 Tạo thư mục ứng dụng..."
mkdir -p /var/www/xlab-web
chown $SUDO_USER:$SUDO_USER /var/www/xlab-web

# 7. Copy source code (giả sử đã có trong thư mục hiện tại)
echo "📥 Copy source code..."
cp -r . /var/www/xlab-web/
chown -R $SUDO_USER:$SUDO_USER /var/www/xlab-web

# 8. Cài đặt SSL certificate
echo "🔒 Cài đặt SSL certificate..."
certbot --nginx -d xlab.id.vn -d www.xlab.id.vn --non-interactive --agree-tos --email xlab.rnd@gmail.com

# 9. Cấu hình Nginx
echo "🌐 Cấu hình Nginx..."
cp /var/www/xlab-web/nginx-xlab.conf /etc/nginx/sites-available/xlab.id.vn
ln -sf /etc/nginx/sites-available/xlab.id.vn /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test và restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

# 10. Thiết lập auto-renewal SSL
echo "🔄 Thiết lập auto-renewal SSL..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# 11. Tạo thư mục logs
echo "📝 Tạo thư mục logs..."
mkdir -p /var/log/xlab-web
chown $SUDO_USER:$SUDO_USER /var/log/xlab-web

# 12. Tạo thư mục backup
echo "🗄️ Tạo thư mục backup..."
mkdir -p /var/backups/xlab-web

# 13. Thiết lập backup tự động
echo "⏰ Thiết lập backup tự động..."
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/xlab-web/scripts/backup.sh >> /var/log/xlab-backup.log 2>&1") | crontab -

# 14. Chuyển sang user thường để deploy app
echo "🚀 Triển khai ứng dụng..."
cd /var/www/xlab-web
sudo -u $SUDO_USER bash -c "
    # Copy environment file
    cp .env.production .env.local
    
    # Cài đặt dependencies
    npm ci --only=production
    
    # Build ứng dụng
    npm run build
    
    # Tạo PM2 ecosystem file
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'xlab-web',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/xlab-web',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/xlab-web/error.log',
    out_file: '/var/log/xlab-web/out.log',
    log_file: '/var/log/xlab-web/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
}
EOF
    
    # Khởi động ứng dụng
    pm2 delete xlab-web 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
"

echo ""
echo "✅ Thiết lập hoàn tất!"
echo "🌐 Website: https://xlab.id.vn"
echo "📊 Kiểm tra PM2: pm2 status"
echo "📝 Xem logs: pm2 logs xlab-web"
echo "🔍 Health check: ./scripts/health-check.sh"
echo ""
echo "🔧 Các bước tiếp theo:"
echo "1. Cập nhật Google OAuth credentials với domain mới"
echo "2. Test website tại https://xlab.id.vn"
echo "3. Kiểm tra SSL certificate"
echo "4. Thiết lập monitoring"
