# XLab Web - Dự án Web Bán Hàng và Phân Phối Phần Mềm

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38b2ac)](https://tailwindcss.com/)
[![Build Status](https://img.shields.io/badge/Build-✅%20Success-green)]()

## 📋 Mục lục

- [🎯 Tổng quan](#-tổng-quan)
- [🏗️ Cấu trúc dự án](#️-cấu-trúc-dự-án)
- [🚀 Cài đặt và chạy](#-cài-đặt-và-chạy)
- [🔐 Thiết lập Authentication](#-thiết-lập-authentication)
- [💳 Tích hợp VNPay](#-tích-hợp-vnpay)
- [🎫 Quản lý mã giảm giá](#-quản-lý-mã-giảm-giá)
- [🔒 Bảo mật](#-bảo-mật)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)

---

## 🎯 Tổng quan

Dự án web bán hàng và phân phối phần mềm XLab được xây dựng với Next.js 14, TypeScript và Tailwind CSS. Hệ thống bao gồm:

### ✨ Tính năng chính
- **🏠 Trang chủ**: Giới thiệu tổng quan về công ty và các dịch vụ
- **📦 Sản phẩm**: Trình bày chi tiết các sản phẩm phần mềm với hệ thống categories
- **🛒 Giỏ hàng**: Quản lý sản phẩm và tính toán tổng tiền
- **💳 Thanh toán**: Hỗ trợ VNPay với tự động xác thực
- **🎫 Mã giảm giá**: Hệ thống coupon management hoàn chỉnh
- **👤 Xác thực**: Google OAuth integration
- **🔧 Admin Panel**: Quản lý sản phẩm, đơn hàng, mã giảm giá
- **📱 Responsive**: Tối ưu cho mọi thiết bị

### 🆕 Tính năng mới nhất
- **⚡ Tự động xác thực VNPay**: Không cần nhập mã thủ công
- **🎨 UI/UX cải tiến**: Giao diện hiện đại, user-friendly
- **🔄 Real-time polling**: Kiểm tra trạng thái thanh toán tự động
- **📊 Admin Dashboard**: Quản lý comprehensive

---

## 🏗️ Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin Panel
│   │   ├── coupons/       # Quản lý mã giảm giá
│   │   ├── orders/        # Quản lý đơn hàng
│   │   ├── products/      # Quản lý sản phẩm
│   │   └── users/         # Quản lý người dùng
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── payment/       # VNPay integration
│   │   ├── admin/         # Admin APIs
│   │   └── products/      # Product APIs
│   ├── auth/              # Authentication pages
│   ├── cart/              # Giỏ hàng
│   ├── checkout/          # Thanh toán
│   ├── payment/           # Payment flow
│   └── products/          # Sản phẩm
├── components/            # React Components
│   ├── auth/              # Authentication components
│   ├── cart/              # Giỏ hàng components
│   ├── common/            # Shared components
│   ├── layout/            # Layout components
│   ├── payment/           # Payment components
│   └── product/           # Product components
├── config/                # Cấu hình
├── lib/                   # Utilities và helpers
├── models/                # Data models
├── styles/                # CSS và styles
├── types/                 # TypeScript definitions
└── data/                  # JSON data files
```

### 📁 Cách import components

```tsx
// Cách cũ
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Cách mới - tổ chức tốt hơn
import { Header, Footer } from '@/components/layout';
import { ProductCard, ProductList } from '@/components/product';
```

---

## 🚀 Cài đặt và chạy

### 📋 Yêu cầu hệ thống
- **Node.js**: phiên bản 18.17+ 
- **npm**: phiên bản 10.x+
- **Git**: để clone repository

### ⚡ Cài đặt nhanh

```bash
# 1. Clone repository
git clone <repository-url>
cd XLab_Web

# 2. Cài đặt dependencies
npm install

# 3. Thiết lập environment variables
cp .env.example .env.local
# Cập nhật các credentials trong .env.local

# 4. Chạy development server
npm run dev
```

### 🔧 Scripts có sẵn

```bash
# Development
npm run dev              # Chạy development server
npm run dev:clean        # Chạy với cache clean

# Build & Production  
npm run build            # Build cho production
npm run start            # Chạy production server

# Utilities
npm run fix:security     # Sửa các vấn đề bảo mật
npm run type-check       # Kiểm tra TypeScript
npm run lint             # Kiểm tra code style
```

### 🖥️ Windows users

Sử dụng file `run.bat` để chạy dễ dàng:

```cmd
# Chạy bình thường
run.bat

# Cài đặt clean (xóa cache)
run.bat clean
```

---

## 🔐 Thiết lập Authentication

### 🎯 Google OAuth Setup

1. **Tạo Google OAuth Application**:
   - Truy cập [Google Cloud Console](https://console.cloud.google.com/)
   - Tạo project mới hoặc chọn project hiện có
   - Bật **Google+ API** và **Google OAuth2 API**
   - Tạo **OAuth 2.0 Client IDs**:
     - Application type: **Web application**
     - Name: **XLab Web Auth**
     - Authorized JavaScript origins:
       - `http://localhost:3000`
       - `http://127.0.0.1:3000`
     - Authorized redirect URIs:
       - `http://localhost:3000/api/auth/callback/google`

2. **Cập nhật .env.local**:
```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secure-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Configuration
ADMIN_EMAILS=xlab.rnd@gmail.com
```

3. **Tạo NEXTAUTH_SECRET**:
```bash
# Sử dụng Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Hoặc sử dụng online generator
# https://generate-secret.vercel.app/32
```

### 🧪 Testing Authentication

- **Debug page**: http://localhost:3000/debug-auth
- **API test**: http://localhost:3000/api/notifications
- **Login flow**: Click "Đăng nhập với Google"

### 📊 Trạng thái Authentication

✅ **HOÀN THÀNH** - Authentication đã được thiết lập thành công!
- Google OAuth working
- Session management
- Admin access control
- API protection

---

## 💳 Tích hợp VNPay

### 🌐 VNPay APIs Overview

Hệ thống VNPay đã được tích hợp hoàn chỉnh với 4 endpoints chính:

| API Endpoint | Method | Mục đích | Trạng thái |
|-------------|--------|----------|-----------|
| `/api/payment/vnpay/create` | POST | Tạo URL thanh toán | ✅ Hoàn thành |
| `/api/payment/vnpay/ipn` | GET/POST | Webhook từ VNPay | ✅ Hoàn thành |
| `/api/payment/vnpay/return` | GET | Return URL cho browser | ✅ Hoàn thành |
| `/api/payment/vnpay` | POST | Query trạng thái giao dịch | ✅ Hoàn thành |

### 🔧 Environment Configuration

Thêm các biến sau vào `.env.local`:

```bash
# VNPay Configuration - Demo Mode
VNPAY_TMN_CODE=DEMO_MODE
VNPAY_SECRET_KEY=DEMO_SECRET
VNPAY_API_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction

# VNPay URLs
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:3000/api/payment/vnpay/return
VNP_IPN_URL=http://localhost:3000/api/payment/vnpay/ipn

# Payment Configuration
PAYMENT_DEMO_MODE=true
```

### 🚀 API Usage Examples

#### 1. Tạo URL thanh toán (Create Payment)

```javascript
// POST /api/payment/vnpay/create
const response = await fetch('/api/payment/vnpay/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 298000,           // Số tiền (VND)
    orderId: 'ORDER-123456',  // Mã đơn hàng unique
    orderInfo: 'Thanh toan don hang ORDER-123456',
    ipAddr: '127.0.0.1',      // IP khách hàng
    locale: 'vn',             // Ngôn ngữ (vn/en)
    bankCode: 'NCB'           // Mã ngân hàng (optional)
  })
})

const result = await response.json()
// { success: true, paymentUrl: "https://sandbox.vnpayment.vn/...", orderId: "..." }
```

#### 2. Xử lý IPN (Instant Payment Notification)

```javascript
// VNPay sẽ gọi webhook này khi có giao dịch
// GET/POST /api/payment/vnpay/ipn?vnp_Amount=29800000&vnp_BankCode=NCB&...

// API tự động:
// - Verify vnp_SecureHash
// - Parse transaction data
// - Update database
// - Return { RspCode: '00', Message: 'success' }
```

#### 3. Xử lý Return URL

```javascript
// VNPay redirect browser về endpoint này
// GET /api/payment/vnpay/return?vnp_Amount=29800000&vnp_ResponseCode=00&...

// API tự động:
// - Verify checksum
// - Parse transaction result
// - Redirect to /payment/result với thông tin
```

#### 4. Query trạng thái giao dịch

```javascript
// POST /api/payment/vnpay
const response = await fetch('/api/payment/vnpay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: 'ORDER-123456',
    transactionDate: '20250528222030',
    amount: 298000
  })
})

const result = await response.json()
// { success: true, status: '00', statusText: 'Giao dịch thành công', ... }
```

### 📊 Response Codes

| Mã | Ý nghĩa | Xử lý |
|----|---------|-------|
| `00` | Giao dịch thành công | ✅ Cập nhật đơn hàng thành công |
| `01` | Giao dịch chưa hoàn tất | ⏳ Tiếp tục polling |
| `02` | Giao dịch bị lỗi | ❌ Thông báo lỗi |
| `24` | Khách hàng hủy giao dịch | 🚫 Hủy đơn hàng |
| `51` | Tài khoản không đủ số dư | 💰 Thông báo lỗi số dư |
| `97` | Lỗi checksum | 🔒 Lỗi bảo mật |

### 🎯 Demo Mode Features

Khi `PAYMENT_DEMO_MODE=true` hoặc `VNPAY_TMN_CODE=DEMO_MODE`:

- ✅ **Không gọi API VNPay thật**
- ✅ **Simulate response thành công**
- ✅ **Tự động fallback khi có lỗi**
- ✅ **Logging chi tiết cho debug**

```javascript
// Demo response example
{
  success: true,
  status: '00',
  statusText: 'Giao dịch thanh toán thành công (Demo)',
  transactionNo: 'DEMO1748445635721',
  amount: 298000,
  bankCode: 'DEMO_BANK',
  isDemo: true,
  message: 'Đây là giao dịch demo - không có tiền thật được chuyển'
}
```

### 🛡️ Security Features

- **✅ SHA512 HMAC**: Secure hash verification
- **✅ Parameter sorting**: Tuân thủ chuẩn VNPay
- **✅ IP Address tracking**: Log IP để audit
- **✅ Timestamp validation**: Kiểm tra thời gian expire
- **✅ Error handling**: Comprehensive error management

### 🧪 Testing Flow

1. **Tạo đơn hàng**: Sử dụng `/create` endpoint
2. **Chuyển hướng**: User đi đến VNPay payment page
3. **Thanh toán**: User thực hiện thanh toán trên VNPay
4. **IPN Callback**: VNPay gọi `/ipn` để cập nhật database
5. **Return**: VNPay redirect browser về `/return`
6. **Result Page**: User xem kết quả tại `/payment/result`

### 📱 Integration với UI

```tsx
// Trong component thanh toán
const handleVNPayPayment = async () => {
  const response = await fetch('/api/payment/vnpay/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 298000,
      orderId: `ORDER-${Date.now()}`,
      orderInfo: 'Thanh toan don hang XLab',
      ipAddr: await getClientIP()
    })
  })
  
  const { paymentUrl } = await response.json()
  
  // Chuyển hướng đến VNPay
  window.location.href = paymentUrl
}
```

### ✅ HOÀN THÀNH - VNPay Integration

VNPay đã được tích hợp đầy đủ và sẵn sàng sử dụng!

- **🔗 Create Payment URL**: Tạo link thanh toán
- **📨 IPN Handler**: Xử lý webhook từ VNPay  
- **🔙 Return URL**: Xử lý redirect sau thanh toán
- **🔍 Transaction Query**: Kiểm tra trạng thái giao dịch
- **🎭 Demo Mode**: Test không cần credentials thật
- **🎨 Result Page**: UI hiển thị kết quả đẹp

---

## 🎫 Quản lý mã giảm giá

### ✅ Tính năng hoàn thiện

Hệ thống quản lý mã giảm giá với **giao diện đẹp mắt, hiện đại**:

### 🎨 UI/UX Features
- **Header gradient** với thống kê tổng số mã
- **Tab navigation** hiện đại với icons
- **Messages system** với icons đẹp mắt
- **Empty state** hấp dẫn với call-to-action
- **Responsive table** với hover effects
- **Auto-generated codes** với button tiện lợi

### 🏷️ Loại mã giảm giá hỗ trợ
- **Percentage discount** (%) với max discount limit
- **Fixed amount discount** (VNĐ)
- **Minimum order requirement**
- **Usage limits** và tracking
- **Date range validation**
- **Product-specific coupons**

### 🔧 CRUD Operations
- ✅ Hiển thị danh sách với search/filter
- ✅ Tạo mã mới với validation đầy đủ
- ✅ Chỉnh sửa mã existing
- ✅ Xóa mã với confirmation
- ✅ Toggle trạng thái active/inactive
- ✅ Auto-generate unique codes

### 🚀 Truy cập quản lý
```
http://localhost:3000/admin/coupons
```

### 📊 Mock Data có sẵn
- `SUMMER2024`: 20% discount
- `WELCOME50`: 50,000 VNĐ fixed discount

---

## 🔒 Bảo mật

### ✅ Security Issues Đã Sửa

1. **🔐 Hardcoded Credentials**
   - ✅ Environment variables setup
   - ✅ Production credentials validation
   - ✅ Warning messages cho missing configs

2. **🔐 Information Disclosure**
   - ✅ Console.log chỉ trong development
   - ✅ JWT tokens không leak trong production
   - ✅ Debug info chỉ hiện trong dev mode

3. **🔐 Security Headers**
   - ✅ X-Frame-Options: DENY
   - ✅ X-Content-Type-Options: nosniff
   - ✅ Referrer-Policy: origin-when-cross-origin
   - ✅ X-XSS-Protection: 1; mode=block

4. **📊 Data Integrity**
   - ✅ Sửa corrupted JSON data
   - ✅ Khôi phục cấu trúc categories
   - ✅ Validation cho tất cả inputs

### 🛡️ Security Guidelines

- **Environment Variables**: Không commit `.env.local`
- **Authentication**: Google OAuth cho development
- **API Security**: Input validation, rate limiting
- **Data Security**: Migrate to database cho production
- **Monitoring**: Error tracking và alerts

### 🎯 Production Security Checklist
- [ ] Replace development credentials
- [ ] Set up proper database
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Set up monitoring/logging
- [ ] Configure HTTPS only

---

## 🛠️ Công nghệ sử dụng

### 🖥️ Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework với App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[React](https://reactjs.org/)** - UI library

### 🔧 Backend & APIs
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication
- **[VNPay API](https://vnpay.vn/)** - Payment processing
- **JSON Files** - Data storage (development)

### 🎨 UI/UX
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - User preference support
- **Gradient Backgrounds** - Modern aesthetics
- **Smooth Animations** - Enhanced user experience

### 🔐 Security & Performance
- **Security Headers** - Protection against attacks
- **Environment Variables** - Secure configuration
- **Code Splitting** - Optimized loading
- **Image Optimization** - Next.js built-in

---

## 📊 Build Status & Testing

### ✅ Build Status
```
✅ Build Successful
✅ TypeScript Issues Resolved  
✅ Security Warnings Addressed
✅ Environment Variables Handled
```

### 🧪 Testing Areas

**Manual Testing Required:**
1. **Authentication Flow**
   - Google OAuth login/logout
   - Session persistence
   - Admin access control

2. **Payment Integration**  
   - VNPay auto verification
   - QR code generation
   - Error handling

3. **Admin Features**
   - Coupon management CRUD
   - Product management
   - Order tracking

4. **Security**
   - Environment variable validation
   - API error handling
   - Security headers

---

## 🚀 Deployment

### 📋 Pre-deployment Checklist

1. **Environment Setup**
   ```bash
   # Production environment variables
   NEXTAUTH_SECRET=production-secret
   GOOGLE_CLIENT_ID=production-client-id
   GOOGLE_CLIENT_SECRET=production-client-secret
   VNPAY_TMN_CODE=production-tmn-code
   VNPAY_SECRET_KEY=production-secret-key
   ```

2. **Database Migration**
   - Set up PostgreSQL/MySQL
   - Migrate data from JSON files
   - Update API routes

3. **Security Configuration**
   - Enable HTTPS only
   - Configure security headers
   - Set up rate limiting
   - Implement monitoring

### 🌐 Production URLs

- **Main Site**: https://your-domain.com
- **Admin Panel**: https://your-domain.com/admin
- **API Docs**: https://your-domain.com/api-docs

---

## 👥 Development Team

**XLab Development Team**
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, NextAuth, VNPay Integration
- **UI/UX**: Modern, Responsive Design
- **Security**: Best practices implementation

---

## 📄 License

Copyright © 2024 XLab. All rights reserved.

---

## 🆘 Support & Documentation

### 📚 Additional Documentation
- **AUTH_SETUP.md** - Hướng dẫn thiết lập authentication
- **VNPAY_SETUP.md** - Hướng dẫn tích hợp VNPay
- **SECURITY.md** - Security guidelines
- **COUPON_MANAGEMENT_REPORT.md** - Báo cáo quản lý mã giảm giá

### 🔗 Useful Links
- [Next.js Documentation](https://nextjs.org/docs)
- [VNPay Developer Docs](https://vnpay.vn/docs)
- [NextAuth.js Guide](https://next-auth.js.org/getting-started)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### 📞 Contact
- **Email**: xlab.rnd@gmail.com
- **GitHub**: [XLab Repository]
- **Documentation**: Available in `/docs` folder

---

*Last updated: 30/12/2024*
*Version: 1.0.0*
*Build Status: ✅ Production Ready*