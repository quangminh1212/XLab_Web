#!/bin/bash

# Script khởi động ứng dụng Next.js cho production
set -e

echo "🚀 Khởi động ứng dụng Next.js cho production..."

# Màu sắc
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Kiểm tra Node.js
echo -e "${YELLOW}🔍 Kiểm tra Node.js...${NC}"
node --version
npm --version

# Cài đặt dependencies
echo -e "\n${YELLOW}📦 Cài đặt dependencies...${NC}"
npm ci --production=false

# Build ứng dụng
echo -e "\n${YELLOW}🔨 Build ứng dụng...${NC}"
npm run build

# Khởi động ứng dụng
echo -e "\n${YELLOW}🚀 Khởi động ứng dụng...${NC}"
echo "Ứng dụng sẽ chạy trên port 3000"
echo "Sử dụng Ctrl+C để dừng"

# Chạy với PM2 nếu có, nếu không thì chạy trực tiếp
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ Sử dụng PM2 để quản lý process${NC}"
    pm2 stop xlab-web 2>/dev/null || true
    pm2 delete xlab-web 2>/dev/null || true
    pm2 start npm --name "xlab-web" -- start
    pm2 save
    pm2 startup
else
    echo -e "${BLUE}ℹ️  Chạy trực tiếp với npm start${NC}"
    npm start
fi
