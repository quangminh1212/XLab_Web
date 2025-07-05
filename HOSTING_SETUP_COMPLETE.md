# 🚀 XLab Web - Complete Hosting Setup Guide

## ✅ **THIẾT LẬP HOSTING HOÀN CHỈNH CHO XLAB.ID.VN**

Hệ thống hosting tự động và đầy đủ cho domain **xlab.id.vn** đã được tạo!

## 📋 **CÁC SCRIPT ĐÃ TẠO:**

### 🔧 **Setup Scripts (Chạy một lần):**
- **`setup-hosting.bat`** - Script master thiết lập toàn bộ hệ thống
- **`setup-firewall.bat`** - Cấu hình Windows Firewall
- **`setup-nginx.bat`** - Cài đặt và cấu hình Nginx reverse proxy
- **`setup-ssl.bat`** - Thiết lập SSL certificate

### 🎛️ **Management Scripts (Sử dụng hàng ngày):**
- **`start-all.bat`** - Khởi động toàn bộ hệ thống hosting
- **`stop-all.bat`** - Dừng toàn bộ hệ thống
- **`check-status.bat`** - Kiểm tra trạng thái các dịch vụ
- **`diagnose-network.bat`** - Chẩn đoán và khắc phục network

### 📊 **Existing Scripts:**
- **`start.bat`** - Khởi động XLab Web Server (production)
- **`manage.bat`** - Console quản lý tổng hợp
- **`monitor.bat`** - Giám sát server

## 🚀 **HƯỚNG DẪN SỬ DỤNG:**

### **Bước 1: Thiết lập lần đầu (Chạy với quyền Administrator)**
```bash
# Chạy script master để thiết lập toàn bộ
setup-hosting.bat
```

Script này sẽ tự động:
- ✅ Cấu hình Windows Firewall (ports 80, 443, 3000)
- ✅ Tải và cài đặt Nginx
- ✅ Cấu hình reverse proxy cho xlab.id.vn
- ✅ Thiết lập SSL certificate (tùy chọn)
- ✅ Tạo các script quản lý

### **Bước 2: Khởi động hệ thống**
```bash
# Khởi động toàn bộ hệ thống hosting
start-all.bat
```

### **Bước 3: Kiểm tra trạng thái**
```bash
# Kiểm tra tất cả dịch vụ
check-status.bat

# Chẩn đoán network nếu có vấn đề
diagnose-network.bat
```

## 🌐 **KIẾN TRÚC HỆ THỐNG:**

```
Internet → Router → Windows Firewall → Nginx (Port 80/443) → XLab Web (Port 3000)
```

### **Luồng truy cập:**
1. **User truy cập:** `https://xlab.id.vn`
2. **DNS resolve:** `xlab.id.vn` → `1.52.110.251` (IP của bạn)
3. **Router forward:** Port 80/443 → Windows PC
4. **Windows Firewall:** Allow ports 80, 443, 3000
5. **Nginx reverse proxy:** Port 80/443 → localhost:3000
6. **XLab Web Server:** Xử lý request và trả về response

## 📊 **TRẠNG THÁI HIỆN TẠI:**

| Thành phần | Trạng thái | Ghi chú |
|------------|------------|---------|
| ✅ XLab Web Server | Hoạt động | localhost:3000 |
| ✅ DNS Configuration | Hoạt động | xlab.id.vn → 1.52.110.251 |
| ⚙️ Windows Firewall | Cần cấu hình | Chạy setup-firewall.bat |
| ⚙️ Nginx Reverse Proxy | Cần cài đặt | Chạy setup-nginx.bat |
| ⚙️ SSL Certificate | Tùy chọn | Chạy setup-ssl.bat |

## 🔧 **CÁC CỔNG ĐƯỢC SỬ DỤNG:**

- **Port 3000:** XLab Web Server (Next.js)
- **Port 80:** Nginx HTTP (reverse proxy)
- **Port 443:** Nginx HTTPS (reverse proxy + SSL)

## 📁 **CẤU TRÚC FILE SAU KHI THIẾT LẬP:**

```
XLab_Web/
├── 🚀 HOSTING SCRIPTS
│   ├── setup-hosting.bat      # Master setup script
│   ├── setup-firewall.bat     # Firewall configuration
│   ├── setup-nginx.bat        # Nginx installation
│   ├── setup-ssl.bat          # SSL certificate setup
│   ├── start-all.bat          # Start all services
│   ├── stop-all.bat           # Stop all services
│   ├── check-status.bat       # Status check
│   └── diagnose-network.bat   # Network diagnostics
│
├── 🎛️ EXISTING MANAGEMENT
│   ├── start.bat              # XLab Web Server
│   ├── manage.bat             # Management console
│   └── monitor.bat            # Server monitoring
│
└── 🌐 NGINX (sau khi cài đặt)
    └── C:\nginx\
        ├── nginx.exe
        ├── conf\nginx.conf     # Reverse proxy config
        ├── ssl\               # SSL certificates
        ├── start-nginx.bat    # Start Nginx
        └── stop-nginx.bat     # Stop Nginx
```

## 🎯 **WORKFLOW SỬ DỤNG HÀNG NGÀY:**

### **Khởi động website:**
```bash
start-all.bat
```

### **Kiểm tra trạng thái:**
```bash
check-status.bat
```

### **Dừng website:**
```bash
stop-all.bat
```

### **Khắc phục sự cố:**
```bash
diagnose-network.bat
```

## 🔍 **TROUBLESHOOTING:**

### **Nếu không truy cập được xlab.id.vn:**

1. **Chạy chẩn đoán:**
   ```bash
   diagnose-network.bat
   ```

2. **Kiểm tra các dịch vụ:**
   ```bash
   check-status.bat
   ```

3. **Khởi động lại toàn bộ:**
   ```bash
   stop-all.bat
   start-all.bat
   ```

### **Các vấn đề thường gặp:**

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-------------|-----------|
| Không truy cập được domain | Router chưa port forward | Cấu hình router forward port 80, 443 |
| SSL không hoạt động | Chưa cài SSL certificate | Chạy setup-ssl.bat |
| Firewall chặn | Windows Firewall | Chạy setup-firewall.bat |
| Nginx không chạy | Chưa cài đặt hoặc lỗi config | Chạy setup-nginx.bat |

## 🎉 **HOÀN TẤT!**

Sau khi chạy `setup-hosting.bat`, bạn sẽ có:

- ✅ **Hệ thống hosting hoàn chỉnh**
- ✅ **Domain xlab.id.vn hoạt động**
- ✅ **Reverse proxy professional**
- ✅ **SSL certificate (tùy chọn)**
- ✅ **Management scripts đầy đủ**
- ✅ **Auto-start capability**

**🚀 Chỉ cần chạy `setup-hosting.bat` một lần, sau đó sử dụng `start-all.bat` để khởi động website!**
