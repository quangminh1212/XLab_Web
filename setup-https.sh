#!/bin/bash

# Script thiết lập HTTPS cho xlab.id.vn
# Chạy với quyền sudo

set -e

echo "🚀 Bắt đầu thiết lập HTTPS cho xlab.id.vn..."

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Kiểm tra quyền sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Script này cần chạy với quyền sudo${NC}"
    echo "Sử dụng: sudo bash setup-https.sh"
    exit 1
fi

echo -e "${BLUE}📋 Thông tin hiện tại:${NC}"
echo "- IP máy chủ: $(curl -s ifconfig.me)"
echo "- Domain: xlab.id.vn"
echo "- Next.js port: 3000"

# Kiểm tra DNS
echo -e "\n${YELLOW}🔍 Kiểm tra DNS...${NC}"
DNS_IP=$(dig +short xlab.id.vn @8.8.8.8 | tail -n1)
CURRENT_IP=$(curl -s ifconfig.me)

if [ "$DNS_IP" != "$CURRENT_IP" ]; then
    echo -e "${RED}⚠️  CẢNH BÁO: DNS chưa trỏ đúng!${NC}"
    echo "- DNS hiện tại: $DNS_IP"
    echo "- IP máy chủ: $CURRENT_IP"
    echo -e "${YELLOW}📝 Bạn cần cập nhật DNS record:${NC}"
    echo "  @ A $CURRENT_IP"
    echo "  www A $CURRENT_IP"
    echo ""
    read -p "Bạn đã cập nhật DNS chưa? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Vui lòng cập nhật DNS trước khi tiếp tục${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ DNS đã trỏ đúng IP${NC}"
fi

# Kiểm tra Next.js đang chạy
echo -e "\n${YELLOW}🔍 Kiểm tra Next.js...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Next.js đang chạy trên port 3000${NC}"
else
    echo -e "${RED}❌ Next.js không chạy trên port 3000${NC}"
    echo "Vui lòng khởi động Next.js trước:"
    echo "cd /mnt/persist/workspace && npm run build && npm start"
    exit 1
fi

# Backup cấu hình nginx hiện tại
echo -e "\n${YELLOW}💾 Backup cấu hình Nginx...${NC}"
if [ -f /etc/nginx/sites-enabled/default ]; then
    cp /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup
    echo -e "${GREEN}✅ Đã backup cấu hình default${NC}"
fi

# Tắt site default
echo -e "\n${YELLOW}🔧 Tắt site default...${NC}"
if [ -L /etc/nginx/sites-enabled/default ]; then
    unlink /etc/nginx/sites-enabled/default
    echo -e "${GREEN}✅ Đã tắt site default${NC}"
fi

# Kích hoạt site xlab.id.vn
echo -e "\n${YELLOW}🔧 Kích hoạt site xlab.id.vn...${NC}"
if [ ! -L /etc/nginx/sites-enabled/xlab.id.vn ]; then
    ln -s /etc/nginx/sites-available/xlab.id.vn /etc/nginx/sites-enabled/
    echo -e "${GREEN}✅ Đã kích hoạt site xlab.id.vn${NC}"
fi

# Kiểm tra cấu hình nginx
echo -e "\n${YELLOW}🔍 Kiểm tra cấu hình Nginx...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Cấu hình Nginx hợp lệ${NC}"
else
    echo -e "${RED}❌ Cấu hình Nginx có lỗi${NC}"
    exit 1
fi

# Khởi động lại nginx
echo -e "\n${YELLOW}🔄 Khởi động lại Nginx...${NC}"
systemctl restart nginx
systemctl enable nginx
echo -e "${GREEN}✅ Nginx đã được khởi động lại${NC}"

# Lấy SSL certificate
echo -e "\n${YELLOW}🔒 Lấy SSL certificate từ Let's Encrypt...${NC}"
echo "Điều này có thể mất vài phút..."

# Tạo thư mục tạm cho webroot
mkdir -p /var/www/html

# Chạy certbot
if certbot --nginx -d xlab.id.vn -d www.xlab.id.vn --non-interactive --agree-tos --email xlab.rnd@gmail.com --redirect; then
    echo -e "${GREEN}✅ SSL certificate đã được cài đặt thành công${NC}"
else
    echo -e "${RED}❌ Không thể lấy SSL certificate${NC}"
    echo "Có thể do:"
    echo "- DNS chưa propagate hoàn toàn"
    echo "- Port 80/443 bị chặn"
    echo "- Domain chưa trỏ đúng IP"
    exit 1
fi

# Kiểm tra SSL
echo -e "\n${YELLOW}🔍 Kiểm tra SSL...${NC}"
if curl -s https://xlab.id.vn > /dev/null; then
    echo -e "${GREEN}✅ HTTPS hoạt động bình thường${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS có thể chưa hoạt động hoàn toàn${NC}"
fi

# Thiết lập auto-renewal
echo -e "\n${YELLOW}⏰ Thiết lập tự động gia hạn SSL...${NC}"
systemctl enable certbot.timer
systemctl start certbot.timer
echo -e "${GREEN}✅ Đã thiết lập tự động gia hạn SSL${NC}"

# Hiển thị thông tin hoàn thành
echo -e "\n${GREEN}🎉 HOÀN THÀNH THIẾT LẬP HTTPS!${NC}"
echo -e "${BLUE}📋 Thông tin:${NC}"
echo "- Website: https://xlab.id.vn"
echo "- SSL Certificate: Let's Encrypt"
echo "- Auto-renewal: Enabled"
echo "- Security Headers: Enabled"
echo "- Gzip Compression: Enabled"
echo "- Rate Limiting: Enabled"

echo -e "\n${YELLOW}📝 Các bước tiếp theo:${NC}"
echo "1. Kiểm tra website: https://xlab.id.vn"
echo "2. Test SSL: https://www.ssllabs.com/ssltest/"
echo "3. Kiểm tra security headers: https://securityheaders.com/"

echo -e "\n${GREEN}✅ Thiết lập hoàn tất!${NC}"
