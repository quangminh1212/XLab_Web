#!/bin/bash

# ========================================
# XLab Web - Production Deployment Script
# ========================================
# Script tích hợp để deploy ứng dụng Next.js với HTTPS
# Bao gồm: Build, PM2, Nginx, SSL Certificate

set -e

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Cấu hình
DOMAIN="xlab.id.vn"
APP_NAME="xlab-web"
APP_PORT="3000"
PROJECT_DIR="/mnt/persist/workspace"
EMAIL="xlab.rnd@gmail.com"

# Banner
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    XLab Web Deployment                      ║"
echo "║                  Production Setup Script                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Kiểm tra quyền sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Script này cần chạy với quyền sudo${NC}"
    echo "Sử dụng: sudo bash deploy.sh"
    exit 1
fi

# Hàm hiển thị tiến trình
show_progress() {
    echo -e "\n${CYAN}▶ $1${NC}"
}

# Hàm kiểm tra thành công
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Hàm hiển thị cảnh báo
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Hàm hiển thị lỗi
show_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Kiểm tra hệ thống
show_progress "Kiểm tra hệ thống và dependencies..."

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    show_error "Node.js chưa được cài đặt"
    exit 1
fi

# Kiểm tra npm
if ! command -v npm &> /dev/null; then
    show_error "npm chưa được cài đặt"
    exit 1
fi

# Hiển thị thông tin hệ thống
CURRENT_IP=$(curl -s ifconfig.me)
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)

echo -e "${BLUE}📋 Thông tin hệ thống:${NC}"
echo "- IP máy chủ: $CURRENT_IP"
echo "- Domain: $DOMAIN"
echo "- Node.js: $NODE_VERSION"
echo "- npm: $NPM_VERSION"
echo "- Project: $PROJECT_DIR"

# 2. Kiểm tra DNS
show_progress "Kiểm tra DNS configuration..."

DNS_IP=$(dig +short $DOMAIN @8.8.8.8 | tail -n1)
if [ "$DNS_IP" != "$CURRENT_IP" ]; then
    show_warning "DNS chưa trỏ đúng IP!"
    echo "- DNS hiện tại: $DNS_IP"
    echo "- IP máy chủ: $CURRENT_IP"
    echo ""
    read -p "Bạn có muốn tiếp tục không? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        show_error "Vui lòng cập nhật DNS trước khi tiếp tục"
        exit 1
    fi
else
    show_success "DNS đã trỏ đúng IP"
fi

# 3. Cài đặt dependencies hệ thống
show_progress "Cài đặt dependencies hệ thống..."

# Cập nhật package list
apt update -qq

# Cài đặt Nginx nếu chưa có
if ! command -v nginx &> /dev/null; then
    show_progress "Cài đặt Nginx..."
    apt install -y nginx
    show_success "Nginx đã được cài đặt"
else
    show_success "Nginx đã có sẵn"
fi

# Cài đặt Certbot nếu chưa có
if ! command -v certbot &> /dev/null; then
    show_progress "Cài đặt Certbot..."
    apt install -y certbot python3-certbot-nginx
    show_success "Certbot đã được cài đặt"
else
    show_success "Certbot đã có sẵn"
fi

# Cài đặt PM2 nếu chưa có
if ! command -v pm2 &> /dev/null; then
    show_progress "Cài đặt PM2..."
    npm install -g pm2
    show_success "PM2 đã được cài đặt"
else
    show_success "PM2 đã có sẵn"
fi

# 4. Chuẩn bị ứng dụng
show_progress "Chuẩn bị ứng dụng Next.js..."

cd $PROJECT_DIR

# Cài đặt dependencies
show_progress "Cài đặt npm dependencies..."
npm ci --production=false
show_success "Dependencies đã được cài đặt"

# Build ứng dụng
show_progress "Build ứng dụng Next.js..."
npm run build
show_success "Ứng dụng đã được build"

# 5. Cấu hình PM2
show_progress "Cấu hình PM2..."

# Dừng ứng dụng cũ nếu có
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Khởi động ứng dụng với PM2
pm2 start npm --name "$APP_NAME" -- start
pm2 save
pm2 startup

show_success "PM2 đã được cấu hình"

# 6. Cấu hình Nginx
show_progress "Cấu hình Nginx..."

# Tạo cấu hình Nginx
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
# HTTP server - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name xlab.id.vn www.xlab.id.vn;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name xlab.id.vn www.xlab.id.vn;

    # SSL Configuration (will be updated by Certbot)
    ssl_certificate /etc/letsencrypt/live/xlab.id.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xlab.id.vn/privkey.pem;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Proxy to Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security - deny access to sensitive files
    location ~ /\. { deny all; access_log off; log_not_found off; }
    location ~ /(\.env|node_modules|package\.json) { deny all; }

    # Logs
    access_log /var/log/nginx/xlab.id.vn.access.log;
    error_log /var/log/nginx/xlab.id.vn.error.log;
}
EOF

# Kích hoạt site
if [ -L /etc/nginx/sites-enabled/default ]; then
    unlink /etc/nginx/sites-enabled/default
fi

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Kiểm tra cấu hình Nginx
if nginx -t; then
    show_success "Cấu hình Nginx hợp lệ"
    systemctl restart nginx
    systemctl enable nginx
    show_success "Nginx đã được khởi động lại"
else
    show_error "Cấu hình Nginx có lỗi"
    exit 1
fi

# 7. Thiết lập SSL Certificate
show_progress "Thiết lập SSL Certificate..."

# Kiểm tra xem Next.js có đang chạy không
if ! curl -s http://localhost:$APP_PORT > /dev/null; then
    show_error "Next.js không chạy trên port $APP_PORT"
    exit 1
fi

# Lấy SSL certificate
if certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect; then
    show_success "SSL certificate đã được cài đặt thành công"
else
    show_warning "Không thể lấy SSL certificate. Có thể do DNS chưa propagate hoàn toàn"
    echo "Bạn có thể chạy lại lệnh sau khi DNS đã cập nhật:"
    echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

# Thiết lập auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer
show_success "Đã thiết lập tự động gia hạn SSL"

# 8. Kiểm tra final
show_progress "Kiểm tra final..."

# Kiểm tra PM2
if pm2 list | grep -q $APP_NAME; then
    show_success "PM2 đang chạy ứng dụng"
else
    show_warning "PM2 có vấn đề"
fi

# Kiểm tra Nginx
if systemctl is-active --quiet nginx; then
    show_success "Nginx đang hoạt động"
else
    show_warning "Nginx có vấn đề"
fi

# Kiểm tra HTTPS
if curl -s https://$DOMAIN > /dev/null 2>&1; then
    show_success "HTTPS hoạt động bình thường"
else
    show_warning "HTTPS có thể chưa hoạt động hoàn toàn"
fi

# 9. Hoàn thành
echo -e "\n${GREEN}🎉 DEPLOYMENT HOÀN THÀNH!${NC}"
echo -e "${BLUE}📋 Thông tin:${NC}"
echo "- Website: https://$DOMAIN"
echo "- PM2 App: $APP_NAME"
echo "- Nginx Config: /etc/nginx/sites-available/$DOMAIN"
echo "- SSL Certificate: Let's Encrypt"
echo "- Auto-renewal: Enabled"

echo -e "\n${YELLOW}📝 Các lệnh hữu ích:${NC}"
echo "- Xem logs PM2: pm2 logs $APP_NAME"
echo "- Restart app: pm2 restart $APP_NAME"
echo "- Xem logs Nginx: tail -f /var/log/nginx/$DOMAIN.access.log"
echo "- Test SSL: curl -I https://$DOMAIN"

echo -e "\n${CYAN}🔗 Kiểm tra:${NC}"
echo "- SSL Test: https://www.ssllabs.com/ssltest/"
echo "- Security Headers: https://securityheaders.com/"
echo "- Performance: https://pagespeed.web.dev/"

echo -e "\n${GREEN}✅ Deployment script hoàn tất!${NC}"
