# Hướng dẫn Lấy Mã Xác Thực Thật từ MBBank

## 🎯 **Tóm tắt**
Hiện tại hệ thống đang dùng **development simulation** với test codes. Để lấy **mã thật**, bạn có 2 lựa chọn:

---

## 🏦 **CÁCH 1: Giao dịch MBBank thực tế (Khuyến nghị cho test)**

### **Bước 1: Thực hiện chuyển khoản**

**Thông tin chuyển khoản:**
- 🏦 **Ngân hàng**: MBBank (Ngân hàng Quân đội)
- 👤 **Tên người nhận**: Bach Minh Quang  
- 💳 **Số tài khoản**: `669912122000`
- 💰 **Số tiền**: Chính xác số tiền trong đơn hàng (VD: 149,000 VND)
- 📝 **Nội dung**: Mã đơn hàng từ website (VD: `ORDER-1748450527623`)

### **Bước 2: Thực hiện trên app MBBank**

1. **Mở app MBBank** trên điện thoại
2. **Đăng nhập** tài khoản của bạn
3. **Chọn "Chuyển khoản"** → "Chuyển khoản trong MBBank"
4. **Nhập thông tin** như trên
5. **Xác nhận giao dịch** với OTP

### **Bước 3: Lấy mã xác thực**

Sau khi chuyển khoản thành công, bạn sẽ nhận được:

#### **📱 A. Mã OTP từ SMS** (6-8 số)
```
SMS từ MBBank: "Ma xac thuc cua ban la: 456789"
→ Nhập: 456789
```

#### **📋 B. Mã giao dịch từ app** 
```
Trong app MBBank hiển thị:
"Ma giao dich: MB1234567890"
→ Nhập: MB1234567890
```

#### **🧾 C. Số tham chiếu**
```
Từ thông báo giao dịch:
"So tham chieu: FT2024011234567"  
→ Nhập: FT2024011234567
```

#### **💻 D. Internet Banking Transaction ID**
```
Nếu dùng web banking:
"Transaction ID: IB1234567890"
→ Nhập: IB1234567890
```

### **Bước 4: Xác thực trên website**

1. **Quay lại** trang thanh toán trên website
2. **Nhập bất kỳ mã nào** từ bước 3 vào form "Mã xác thực MBBank"  
3. **Click "Xác nhận đã chuyển khoản"**
4. **Hệ thống sẽ gọi API MBBank** để verify giao dịch thật

---

## 🔧 **CÁCH 2: Setup API MBBank Partnership (Production)**

### **Bước 1: Đăng ký Partnership với MBBank**

**Liên hệ MBBank:**
- 📧 **Email**: developer@mbbank.com.vn
- 🌐 **Website**: https://developer.mbbank.com.vn  
- ☎️ **Hotline**: 1900 545426

**Tài liệu cần chuẩn bị:**
- Giấy phép kinh doanh
- Mô tả dự án/ứng dụng
- Thông tin công ty/cá nhân
- Use case thanh toán

### **Bước 2: Nhận API Credentials**

Sau khi được approve, MBBank sẽ cung cấp:
```env
MBBANK_API_URL=https://api.mbbank.com.vn/v1/transaction/verify
MBBANK_API_KEY=your_production_api_key
MBBANK_PARTNER_CODE=your_partner_code  
MBBANK_WEBHOOK_SECRET=your_webhook_secret
```

### **Bước 3: Cấu hình Production**

**Thêm vào `.env.local`:**
```env
# MBBank Production API
MBBANK_API_URL=https://api.mbbank.com.vn/v1/transaction/verify
MBBANK_API_KEY=MB_PROD_xxxxxxxxxxxxx
MBBANK_PARTNER_CODE=PARTNER_xxxxxxx
MBBANK_WEBHOOK_SECRET=webhook_secret_here

# Switch to production mode
NODE_ENV=production
MBBANK_DEV_MODE=false
```

### **Bước 4: Test Production API**

```bash
# Test connection
curl -X GET http://localhost:3000/api/payment/verify \
  -H "Content-Type: application/json"

# Test real verification  
curl -X POST http://localhost:3000/api/payment/verify \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER-123456789",
    "verificationCode": "real_otp_from_mbbank", 
    "amount": 149000
  }'
```

---

## 🧪 **Testing Scenarios**

### **Development Mode (Hiện tại)**
```javascript
// Test codes tự động thành công
"123456"        → ✅ Success (OTP simulation)
"MB123456789"   → ✅ Success (Transaction ID simulation)  
"000000"        → ❌ Invalid OTP
"111111"        → ❌ Expired OTP
"TESTFAIL"      → ❌ Test failure
```

### **Real Transaction Mode**
```javascript
// Mã thật từ MBBank app/SMS
"456789"        → API call → ✅ hoặc ❌ (tùy MBBank response)
"MB2024010123"  → API call → ✅ hoặc ❌ (tùy giao dịch thật)
"FT2024010456"  → API call → ✅ hoặc ❌ (tùy transaction)
```

---

## 🎯 **Khuyến nghị**

### **Cho Development/Testing:**
👉 **Dùng CÁCH 1** - Giao dịch thật với số tiền nhỏ (VD: 10,000 VND)

### **Cho Production Business:**  
👉 **Dùng CÁCH 2** - Partnership chính thức với MBBank

### **Ưu điểm của từng cách:**

| Aspect | Cách 1 (Real Transaction) | Cách 2 (API Partnership) |
|--------|---------------------------|---------------------------|
| **Setup** | ⚡ Instant (có tài khoản MBBank) | 🕐 2-4 tuần approval |
| **Cost** | 💰 Phí chuyển khoản (~1,000đ) | 💰 Partnership fee |
| **Reliability** | 🟡 Manual process | 🟢 Automated API |
| **Scale** | 🔴 Không scale được | 🟢 Unlimited transactions |
| **Real-time** | 🟡 Cần manual check | 🟢 Instant verification |

---

## ⚠️ **Lưu ý quan trọng**

### **Bảo mật:**
- ❌ **Không share** API credentials
- ✅ **Luôn dùng HTTPS** 
- ✅ **Validate input** trước khi gọi API
- ✅ **Log transactions** cho audit

### **Rate Limiting:**
- Hiện tại: **5 tries/5min** → Warning
- Hiện tại: **10 tries/5min** → IP block 24h
- Production: Có thể cần adjust theo traffic thật

### **Error Handling:**
- API timeout → Fallback to manual check
- Network error → Retry với exponential backoff  
- Invalid response → Log error + notify admin

---

## 🚀 **Quick Start ngay bây giờ**

**Muốn test với mã thật ngay:**

1. **Mở app MBBank** 📱
2. **Chuyển 10,000đ** đến `669912122000` 
3. **Nội dung**: `ORDER-test-` + timestamp
4. **Lấy mã OTP** từ SMS hoặc app
5. **Nhập vào website** và test!

**Logs sẽ hiển thị:**
```
🏦 MBBank API verification starting...
🛠️ MBBank API credentials not found, using development simulation  
✅ Code format valid: SMS_OTP
✅ MBBank verification successful: MB1748...
```

---

*Cần hỗ trợ thêm? Tạo GitHub issue hoặc liên hệ support team! 🎯* 