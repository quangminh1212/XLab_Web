#!/bin/bash

# XLab Web Server Deployment Script
# Usage: ./scripts/deploy-server.sh

set -e

echo "🚀 Bắt đầu triển khai XLab Web lên server..."

# Kiểm tra Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v1[8-9]\. ]] && [[ ! "$NODE_VERSION" =~ ^v2[0-9]\. ]]; then
    echo "❌ Cần Node.js version 18 trở lên!"
    exit 1
fi

# Tạo thư mục ứng dụng
APP_DIR="/var/www/xlab-web"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Clone hoặc copy source code
if [ ! -d "$APP_DIR/.git" ]; then
    echo "📥 Copy source code..."
    cp -r . $APP_DIR/
else
    echo "🔄 Cập nhật source code..."
    cd $APP_DIR
    git pull origin main
fi

cd $APP_DIR

# Copy environment file
if [ -f ".env.production" ]; then
    cp .env.production .env.local
    echo "✅ Environment variables đã được cấu hình"
else
    echo "❌ Không tìm thấy file .env.production!"
    echo "Vui lòng tạo file .env.production với các biến môi trường cần thiết."
    exit 1
fi

# Cài đặt dependencies
echo "📦 Cài đặt dependencies..."
npm ci --only=production

# Build ứng dụng
echo "🏗️ Build ứng dụng..."
npm run build

# Tạo PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'xlab-web',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR',
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

# Tạo thư mục log
sudo mkdir -p /var/log/xlab-web
sudo chown $USER:$USER /var/log/xlab-web

# Dừng ứng dụng cũ (nếu có)
pm2 delete xlab-web 2>/dev/null || true

# Khởi động ứng dụng với PM2
echo "🚀 Khởi động ứng dụng..."
pm2 start ecosystem.config.js

# Lưu PM2 configuration
pm2 save
pm2 startup

echo "✅ Triển khai hoàn tất!"
echo "🌐 Website: https://xlab.vn"
echo "📊 Kiểm tra status: pm2 status"
echo "📝 Xem logs: pm2 logs xlab-web"
