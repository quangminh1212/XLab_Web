# Kiến Trúc Hệ Thống XLab Web

## Tổng Quan
XLab Web là một nền tảng thương mại điện tử B2C được xây dựng trên Next.js 15, tích hợp thanh toán QR Banking qua Google Sheets. Hệ thống được thiết kế theo kiến trúc Serverless, triển khai trên Vercel với khả năng mở rộng cao.

## Sơ Đồ Kiến Trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                         Người Dùng (Browser)                     │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network (CDN)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Next.js 15 Application                       │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │          Frontend (React 18 + TypeScript)          │  │   │
│  │  │  • App Router với RSC (React Server Components)    │  │   │
│  │  │  • Tailwind CSS cho UI responsive                  │  │   │
│  │  │  • React Context API (Cart, Language, Balance)     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                           │                               │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │              API Routes (/api/*)                   │  │   │
│  │  │  • NextAuth.js + Google OAuth                      │  │   │
│  │  │  • Payment Processing (QR Code Generation)         │  │   │
│  │  │  • Order Management                                │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────┬────────────────┬──────────────────────────┘
                      │                 │
        ┌─────────────▼──────┐   ┌─────▼──────────────┐
        │   Upstash Redis     │   │  Google Sheets API │
        │  (Rate Limiting)    │   │ (Transaction Data)  │
        └────────────────────┘   └────────────────────┘
```

## Các Thành Phần Chính

### 1. Frontend Layer
- **Next.js App Router**: Routing phía server với caching tối ưu
- **Server Components**: Render HTML trên server, giảm JavaScript bundle
- **Client Components**: Tương tác động với `'use client'` directive
- **Middleware**: Xác thực, CSRF protection, rate limiting

### 2. Authentication & Security
- **NextAuth.js**: Xác thực với Google OAuth 2.0
- **JWT Sessions**: Lưu trữ phiên làm việc an toàn
- **Middleware Protection**: Kiểm tra quyền admin, API routes
- **Rate Limiting**: Upstash Redis giới hạn 100 req/phút cho API

### 3. Payment Integration
- **QR Banking**: Tạo mã QR chuẩn VietQR với vietnam-qr-pay
- **Google Sheets**: Lưu trữ và xác thực giao dịch ngân hàng
- **Real-time Verification**: Polling kiểm tra trạng thái thanh toán
- **Auto-deposit**: Tự động cộng tiền vào tài khoản sau xác thực

### 4. Data Flow
```
User → Create Order → Generate QR → Bank Transfer → Google Sheets
                                                          ↓
Frontend ← Update Balance ← Verify Transaction ← Check API
```

## Ưu Điểm Kiến Trúc
- **Serverless**: Không cần quản lý server, tự động scale
- **Edge Deployment**: Phản hồi nhanh với CDN toàn cầu
- **Cost-effective**: Sử dụng Google Sheets thay vì database
- **Security**: Multi-layer protection (OAuth, CSRF, Rate limit)

## Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **External Services**: Google OAuth, Google Sheets, Upstash Redis
- **Deployment**: Vercel (Serverless Functions + Edge Network)
