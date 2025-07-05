# 🌐 Hướng dẫn cấu hình Router cho xlab.id.vn

## 🔍 **VẤN ĐỀ ĐÃ XÁC ĐỊNH:**

### ✅ **Đã hoạt động:**
- XLab Web Server chạy trên port 3000
- Nginx reverse proxy chạy trên port 80
- Website hoạt động hoàn hảo: http://localhost

### ❌ **Cần khắc phục:**
1. **DNS có 2 IP gây xung đột**
2. **Router chưa port forwarding**

## 🔧 **BƯỚC 1: XÓA DNS RECORDS KHÔNG CẦN THIẾT**

### Trong panel TenTen DNS:

**XÓA các records sau:**
- `@` A `34.71.214.76` ❌
- `www` A `34.71.214.76` ❌

**GIỮ LẠI:**
- `@` A `1.52.110.251` ✅
- `www` A `1.52.110.251` ✅

## 🌐 **BƯỚC 2: CẤU HÌNH ROUTER PORT FORWARDING**

### **Tìm IP máy tính trong mạng nội bộ:**

```bash
# Chạy lệnh này để tìm IP nội bộ:
ipconfig | findstr IPv4
```

Kết quả sẽ giống: `192.168.1.xxx` hoặc `10.0.0.xxx`

### **Truy cập Router Admin Panel:**

1. **Mở browser** và truy cập một trong các địa chỉ sau:
   - http://192.168.1.1
   - http://192.168.0.1
   - http://10.0.0.1
   - http://192.168.1.254

2. **Đăng nhập** bằng:
   - Username: `admin`, Password: `admin`
   - Hoặc xem nhãn dán sau router
   - Hoặc Username: `admin`, Password: để trống

### **Cấu hình Port Forwarding:**

1. **Tìm mục:** "Port Forwarding", "Virtual Server", "NAT", hoặc "Applications & Gaming"

2. **Thêm rule mới:**
   ```
   Service Name: XLab Web HTTP
   External Port: 80
   Internal IP: [IP máy tính của bạn]
   Internal Port: 80
   Protocol: TCP
   Status: Enabled
   ```

3. **Thêm rule thứ 2 (backup):**
   ```
   Service Name: XLab Web Direct
   External Port: 3000
   Internal IP: [IP máy tính của bạn]
   Internal Port: 3000
   Protocol: TCP
   Status: Enabled
   ```

4. **Lưu cấu hình** và **restart router**

## 📋 **BƯỚC 3: KIỂM TRA CẤU HÌNH**

### **Sau khi cấu hình router:**

1. **Đợi 5-10 phút** để router khởi động lại
2. **Chạy script kiểm tra:**
   ```bash
   check-dns.bat
   ```

3. **Test từ mobile data** (không dùng WiFi nhà):
   - http://xlab.id.vn
   - http://1.52.110.251

## 🔍 **TROUBLESHOOTING:**

### **Nếu vẫn không truy cập được:**

#### **Kiểm tra 1: ISP có chặn port 80 không**
```bash
# Test từ máy khác hoặc mobile data:
telnet 1.52.110.251 80
```

#### **Kiểm tra 2: Windows Firewall**
```bash
# Chạy với quyền Administrator:
netsh advfirewall firewall show rule name="XLab Web HTTP"
```

#### **Kiểm tra 3: Router có hỗ trợ Port Forwarding không**
- Một số router ISP bị khóa tính năng này
- Liên hệ ISP để mở khóa

### **Giải pháp thay thế:**

#### **Option 1: Sử dụng port khác**
Nếu ISP chặn port 80, cấu hình:
- External Port: 8080
- Internal Port: 80
- Truy cập: http://xlab.id.vn:8080

#### **Option 2: Sử dụng ngrok (tạm thời)**
```bash
# Tải ngrok và chạy:
ngrok http 80
```

## 📊 **KIỂM TRA CUỐI CÙNG:**

### **Sau khi hoàn thành tất cả:**

1. **DNS chỉ có 1 IP:** `1.52.110.251`
2. **Router đã port forward:** Port 80 → Máy tính
3. **Test thành công:**
   - ✅ http://localhost (local)
   - ✅ http://xlab.id.vn (internet)
   - ✅ http://1.52.110.251 (IP trực tiếp)

## 🎯 **TÓM TẮT CÁC BƯỚC:**

1. **Xóa DNS record:** `34.71.214.76`
2. **Tìm IP nội bộ:** `ipconfig`
3. **Cấu hình router:** Port 80 forwarding
4. **Test:** http://xlab.id.vn

## 📞 **HỖ TRỢ:**

Nếu gặp khó khăn:
1. **Chụp ảnh** giao diện router
2. **Chạy** `check-dns.bat` và gửi kết quả
3. **Kiểm tra** ISP có chặn port 80 không

**Website sẽ hoạt động ngay sau khi hoàn thành 2 bước trên!** 🚀
