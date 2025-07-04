# Hướng dẫn triển khai XLab Web cho domain xlab.id.vn

## 🎯 **Thông tin cơ bản**
- **Domain**: xlab.id.vn
- **Server IP**: 1.52.110.251
- **DNS**: Đã cấu hình A record trỏ về IP server

## 🚀 **Triển khai tự động (Khuyến nghị)**

### **Bước 1: Kết nối SSH vào server**
```bash
ssh root@1.52.110.251
```

### **Bước 2: Upload source code**
```bash
# Tạo thư mục tạm
mkdir -p /tmp/xlab-web

# Upload source code (sử dụng scp hoặc git)
# Nếu dùng git:
git clone <repository-url> /tmp/xlab-web

# Hoặc upload từ máy local:
# scp -r ./XLab_Web root@1.52.110.251:/tmp/xlab-web
```

### **Bước 3: Chạy script tự động**
```bash
cd /tmp/xlab-web
chmod +x scripts/setup-xlab-id-vn.sh
sudo ./scripts/setup-xlab-id-vn.sh
```

## 🔧 **Triển khai thủ công (Nếu cần kiểm soát từng bước)**

### **1. Chuẩn bị server**
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt packages
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx ufw

# Cài đặt Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2
sudo npm install -g pm2
```

### **2. Thiết lập bảo mật**
```bash
# Cấu hình firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

### **3. Cài đặt SSL**
```bash
# Cài đặt Let's Encrypt SSL
sudo certbot --nginx -d xlab.id.vn -d www.xlab.id.vn
```

### **4. Cấu hình Nginx**
```bash
# Copy file cấu hình
sudo cp nginx-xlab.conf /etc/nginx/sites-available/xlab.id.vn
sudo ln -s /etc/nginx/sites-available/xlab.id.vn /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test và restart
sudo nginx -t
sudo systemctl restart nginx
```

### **5. Triển khai ứng dụng**
```bash
# Tạo thư mục app
sudo mkdir -p /var/www/xlab-web
sudo chown $USER:$USER /var/www/xlab-web

# Copy source code
cp -r . /var/www/xlab-web/
cd /var/www/xlab-web

# Cấu hình environment
cp .env.production .env.local

# Cài đặt và build
npm ci --only=production
npm run build

# Khởi động với PM2
chmod +x scripts/deploy-server.sh
./scripts/deploy-server.sh
```

## 🔍 **Kiểm tra sau triển khai**

### **1. Test website**
```bash
# Kiểm tra HTTP status
curl -I https://xlab.id.vn

# Kiểm tra redirect www
curl -I https://www.xlab.id.vn

# Test SSL
openssl s_client -servername xlab.id.vn -connect xlab.id.vn:443
```

### **2. Kiểm tra PM2**
```bash
pm2 status
pm2 logs xlab-web
```

### **3. Chạy health check**
```bash
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

## ⚙️ **Cấu hình Google OAuth**

### **Bước quan trọng: Cập nhật Google OAuth**
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project hiện tại hoặc tạo mới
3. Vào **APIs & Services > Credentials**
4. Chỉnh sửa OAuth 2.0 Client ID
5. Thêm **Authorized redirect URIs**:
   - `https://xlab.id.vn/api/auth/callback/google`
   - `https://www.xlab.id.vn/api/auth/callback/google`
6. Lưu thay đổi

### **Cập nhật environment variables**
```bash
# Chỉnh sửa file .env.local
nano /var/www/xlab-web/.env.local

# Cập nhật:
NEXTAUTH_URL=https://xlab.id.vn
GOOGLE_CLIENT_ID=your-new-client-id
GOOGLE_CLIENT_SECRET=your-new-client-secret

# Restart ứng dụng
pm2 restart xlab-web
```

## 🗄️ **Backup và Monitoring**

### **Backup tự động**
```bash
# Backup sẽ chạy tự động lúc 2:00 AM hàng ngày
# Kiểm tra cron job:
crontab -l

# Chạy backup thủ công:
./scripts/backup.sh
```

### **Monitoring**
```bash
# Kiểm tra health định kỳ
./scripts/health-check.sh

# Xem logs real-time
pm2 logs xlab-web --lines 100
```

## 🚨 **Troubleshooting**

### **Nếu website không load**
```bash
# Kiểm tra Nginx
sudo systemctl status nginx
sudo nginx -t

# Kiểm tra PM2
pm2 status
pm2 restart xlab-web

# Kiểm tra logs
pm2 logs xlab-web
tail -f /var/log/nginx/error.log
```

### **Nếu SSL có vấn đề**
```bash
# Gia hạn SSL thủ công
sudo certbot renew

# Kiểm tra SSL certificate
openssl x509 -in /etc/letsencrypt/live/xlab.id.vn/fullchain.pem -text -noout
```

## ✅ **Checklist hoàn tất**

- [ ] Server đã cài đặt đầy đủ packages
- [ ] DNS A record trỏ đúng IP
- [ ] SSL certificate đã cài đặt
- [ ] Nginx cấu hình đúng
- [ ] Ứng dụng chạy với PM2
- [ ] Google OAuth đã cập nhật
- [ ] Website load thành công tại https://xlab.id.vn
- [ ] Backup tự động đã thiết lập
- [ ] Health check hoạt động

**🎉 Chúc mừng! XLab Web đã sẵn sàng phục vụ tại https://xlab.id.vn**
