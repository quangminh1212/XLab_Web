# 🚀 XLab Web - Deployment Guide

## 📋 Tổng quan

Hướng dẫn chi tiết để deploy ứng dụng XLab Web từ development đến production với HTTPS và SSL.

## 🎯 Quick Start

### Windows Development
```bash
# Chỉ cần chạy một lệnh
start.bat
```

### Linux/macOS Production
```bash
# Deploy hoàn chỉnh với HTTPS
sudo ./deploy.sh
```

## 📁 Cấu trúc Scripts

### 🪟 Windows Scripts
- **`start.bat`** - Script tích hợp cho Windows development
  - ✅ Kiểm tra Node.js/npm
  - ✅ Cài đặt dependencies
  - ✅ Tạo environment files
  - ✅ Sửa lỗi common issues
  - ✅ Menu interactive cho development

### 🐧 Linux/macOS Scripts
- **`deploy.sh`** - Script deployment production hoàn chỉnh
  - ✅ Cài đặt system dependencies (Nginx, Certbot, PM2)
  - ✅ Build Next.js application
  - ✅ Cấu hình Nginx với SSL
  - ✅ Thiết lập Let's Encrypt certificate
  - ✅ PM2 process management
  - ✅ Security headers và optimization

## 🔧 npm Scripts Đã Tối Ưu

| Script | Mô tả | Sử dụng |
|--------|-------|---------|
| `dev` | Development server | `npm run dev` |
| `dev:log` | Development với logging | `npm run dev:log` |
| `build` | Build production | `npm run build` |
| `start` | Start production | `npm run start` |
| `deploy` | Deploy production | `npm run deploy` |
| `lint` | Check code quality | `npm run lint` |
| `type-check` | TypeScript checking | `npm run type-check` |
| `clean` | Clean cache | `npm run clean` |

## 🗑️ Files Đã Xóa

### Scripts Cũ (Đã Tích Hợp)
- ❌ `setup-https.sh` → Tích hợp vào `deploy.sh`
- ❌ `start-production.sh` → Tích hợp vào `deploy.sh`
- ❌ `run.bat` → Thay thế bằng `start.bat`
- ❌ `nginx-xlab.conf` → Tích hợp vào `deploy.sh`

### Temp Files
- ❌ `output.txt`, `output-categories.txt`
- ❌ `response.html`, `response_utf8.html`
- ❌ `checkout_response.html`

### Scripts Trùng Lặp
- ❌ `scripts/fix-project.js` → Chức năng đã có trong scripts khác
- ❌ `scripts/migrate.js` → Không cần thiết

## 📦 Dependencies Đã Tối Ưu

### Đã Xóa
- ❌ `@tinymce/tinymce-react` - Không sử dụng TinyMCE
- ❌ `draftjs-to-html`, `html-to-draftjs` - Không sử dụng Draft.js
- ❌ `cssnano` - Đã có trong Next.js
- ❌ `webpack-manifest-plugin` - Không cần thiết
- ❌ `critters`, `glob`, `jest` - Chuyển sang devDependencies hoặc xóa

### Giữ Lại
- ✅ Core Next.js dependencies
- ✅ React và TypeScript
- ✅ Authentication (NextAuth.js)
- ✅ UI libraries (Tailwind, Framer Motion)
- ✅ Development tools (ESLint, Prettier)

## 🚀 Deployment Process

### 1. Development (Windows)
```bash
# Chạy script tích hợp
start.bat

# Chọn option từ menu:
# 1. Development Server
# 2. Development với Logger
# 3. Build Production
# 4. Start Production
# 5. Lint Code
# 6. Type Check
```

### 2. Production (Linux/Ubuntu)

#### Bước 1: Chuẩn bị DNS
```bash
# Cập nhật DNS records:
# @ A 34.71.214.76
# www A 34.71.214.76
```

#### Bước 2: Deploy
```bash
# Clone repository
git clone https://github.com/quangminh1212/XLab_Web.git
cd XLab_Web

# Chạy deployment script
sudo ./deploy.sh
```

#### Bước 3: Verify
```bash
# Kiểm tra website
curl -I https://xlab.id.vn

# Kiểm tra PM2
pm2 list

# Kiểm tra Nginx
sudo nginx -t
```

## 🔒 Security Features

### SSL/TLS
- ✅ Let's Encrypt SSL certificate
- ✅ Auto-renewal setup
- ✅ TLS 1.2 & 1.3 support
- ✅ Strong cipher suites

### Security Headers
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Content-Security-Policy

### Performance
- ✅ Gzip compression
- ✅ Static file caching
- ✅ PM2 process management
- ✅ Nginx reverse proxy

## 🛠️ Troubleshooting

### Windows Issues
```bash
# Nếu Node.js chưa cài đặt
# Download từ: https://nodejs.org/

# Nếu có lỗi permissions
# Chạy Command Prompt as Administrator
```

### Linux Issues
```bash
# Nếu DNS chưa propagate
dig +short xlab.id.vn @8.8.8.8

# Nếu SSL certificate thất bại
sudo certbot --nginx -d xlab.id.vn -d www.xlab.id.vn

# Nếu PM2 không start
pm2 restart xlab-web
pm2 logs xlab-web
```

## 📞 Support

- **Repository**: https://github.com/quangminh1212/XLab_Web
- **Issues**: https://github.com/quangminh1212/XLab_Web/issues
- **Email**: xlab.rnd@gmail.com

## ✅ Checklist Deployment

### Pre-deployment
- [ ] DNS đã trỏ đúng IP (34.71.214.76)
- [ ] Domain đã active (xlab.id.vn)
- [ ] Server có quyền sudo
- [ ] Port 80, 443 đã mở

### Post-deployment
- [ ] Website accessible: https://xlab.id.vn
- [ ] SSL certificate valid
- [ ] PM2 process running
- [ ] Nginx status active
- [ ] Auto-renewal enabled

### Testing
- [ ] SSL Labs test: A+ rating
- [ ] Security headers check
- [ ] Performance test
- [ ] Mobile responsiveness
