# **KIẾN TRÚC HỆ THỐNG XLAB WEB**
## *Nền Tảng Thương Mại Điện Tử B2C*

---

## **1. TỔNG QUAN HỆ THỐNG**

XLab Web là nền tảng thương mại điện tử được phát triển với công nghệ Next.js 15, triển khai theo mô hình **Serverless Architecture** trên Vercel. Hệ thống tích hợp thanh toán QR Banking thông qua Google Sheets với khả năng mở rộng và bảo mật cao.

## **2. KIẾN TRÚC HỆ THỐNG**

### **Sơ Đồ Tổng Quan**

```
                    [NGƯỜI DÙNG]
                   (Browser/Mobile)
                         |
                         | HTTPS
                         ↓
                [VERCEL EDGE NETWORK]
                    (Global CDN)
                         |
                         ↓
            ┌────────────────────────────┐
            │   NEXT.JS 15 APPLICATION   │
            ├────────────────────────────┤
            │ • Frontend: React 18 + TS  │
            │ • Backend: API Routes      │
            │ • Middleware Security      │
            └────────────────────────────┘
                    |     |     |
                    ↓     ↓     ↓
            [NextAuth] [Redis] [Sheets]
             (OAuth)  (Cache) (Database)
```

## **3. CÁC THÀNH PHẦN CHÍNH**

### **3.1 Frontend Architecture**
- **Next.js App Router:** Hệ thống routing server-side với caching tối ưu
- **React Server Components:** Giảm JavaScript bundle size đến 40%
- **Tailwind CSS:** Responsive design với utility-first approach
- **React Context API:** Quản lý state toàn cục (Cart, Language, Balance)

### **3.2 Backend & API Layer**
- **API Routes:** RESTful endpoints xử lý business logic
- **Middleware:** Authentication, CSRF protection, rate limiting
- **Server Actions:** Direct database mutations từ React components
- **Edge Functions:** Low-latency processing gần người dùng

### **3.3 Security & Authentication**
- **OAuth 2.0:** Xác thực qua Google với NextAuth.js
- **JWT Sessions:** Stateless authentication tokens
- **CSRF Protection:** Token validation cho state-changing operations
- **Rate Limiting:** 100 requests/phút với Upstash Redis

### **3.4 Payment Integration**
- **VietQR Standard:** Tạo mã QR chuẩn ngân hàng Việt Nam
- **Real-time Verification:** Polling kiểm tra giao dịch mỗi 10 giây
- **Google Sheets API:** Lưu trữ và xác thực giao dịch
- **Auto-deposit:** Tự động cập nhật số dư sau xác thực

## **4. LUỒNG XỬ LÝ THANH TOÁN**

| **Bước** | **Mô Tả** |
|----------|-----------|
| 1 | **Khởi tạo:** User chọn sản phẩm và số tiền cần thanh toán |
| 2 | **Tạo QR:** Hệ thống generate mã QR với vietnam-qr-pay library |
| 3 | **Chuyển khoản:** User scan QR và thực hiện chuyển khoản |
| 4 | **Xác thực:** Backend kiểm tra Google Sheets để verify giao dịch |
| 5 | **Cập nhật:** Auto-deposit vào tài khoản user và xác nhận đơn hàng |

## **5. TECHNOLOGY STACK**

| **Layer** | **Technologies** |
|-----------|------------------|
| **Frontend** | Next.js 15, React 18, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, NextAuth.js, Node.js |
| **Database** | Google Sheets (Transactions), Local JSON (Products) |
| **Caching** | Upstash Redis, Next.js Cache |
| **Deployment** | Vercel (Serverless Functions + Edge Network) |

## **6. ƯU ĐIỂM KIẾN TRÚC**

✅ **Serverless:** Tự động scale, không cần quản lý infrastructure

✅ **Performance:** Edge deployment với CDN toàn cầu, TTFB < 100ms  

✅ **Cost-effective:** Pay-per-use model, sử dụng Google Sheets free tier

✅ **Security:** Multi-layer protection với OAuth, CSRF, rate limiting

✅ **Developer Experience:** TypeScript, hot reload, integrated testing

---

*Tài liệu được cập nhật: Tháng 12/2024*
