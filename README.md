# XLab - Website Phần mềm và Dịch vụ

XLab là một website giới thiệu các sản phẩm và dịch vụ phần mềm cho doanh nghiệp, được xây dựng bằng Next.js, TypeScript và Tailwind CSS.

## Tính năng

- **Trang chủ**: Giới thiệu tổng quan về công ty và các dịch vụ
- **Sản phẩm**: Trình bày chi tiết các sản phẩm phần mềm
- **Dịch vụ**: Mô tả các dịch vụ công nghệ và hỗ trợ
- **Báo giá**: Hiển thị các gói dịch vụ và báo giá
- **Giới thiệu**: Thông tin về công ty và đội ngũ
- **Liên hệ**: Form liên hệ và thông tin liên lạc

## Công nghệ sử dụng

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)

## Môi trường

Dự án sử dụng các biến môi trường để cấu hình:

- `.env.development`: Cấu hình cho môi trường phát triển
- `.env.production`: Cấu hình cho môi trường sản phẩm
- `.env.test`: Cấu hình cho môi trường test

Các biến môi trường chính:

- `NODE_ENV`: Môi trường chạy (development/production/test)
- `NEXT_PUBLIC_API_URL`: URL của API
- `NEXT_PUBLIC_SITE_URL`: URL của website

### Bảo mật

- Không sử dụng `NODE_TLS_REJECT_UNAUTHORIZED=0` trong môi trường development
- Sử dụng SSL certificate hợp lệ cho môi trường development
- Không commit các file `.env*` lên git repository
- Sử dụng các biến môi trường an toàn cho production

### Cấu hình SSL cho Development

1. Tạo SSL certificate cho local development:
```bash
# Tạo thư mục certificates
mkdir certificates
cd certificates

# Tạo private key
openssl genrsa -out localhost.key 2048

# Tạo CSR (Certificate Signing Request)
openssl req -new -key localhost.key -out localhost.csr -subj "/CN=localhost"

# Tạo self-signed certificate
openssl x509 -req -days 365 -in localhost.csr -signkey localhost.key -out localhost.crt
```

2. Cấu hình Next.js để sử dụng SSL certificate:
```javascript
// next.config.js
const fs = require('fs');
const path = require('path');

module.exports = {
  server: {
    https: {
      key: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost.key')),
      cert: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost.crt')),
    },
  },
  // ... other config
};
```

3. Thêm certificates vào .gitignore:
```
# SSL certificates
certificates/
*.key
*.crt
*.csr
```

## Cài đặt và chạy dự án

### Yêu cầu

- Node.js phiên bản 18.17 hoặc cao hơn
- npm hoặc yarn hoặc pnpm

### Các bước cài đặt

1. Clone dự án:

```bash
git clone <repository-url>
cd XLab_Web
```

2. Cài đặt các dependencies:

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. Chạy dự án ở môi trường phát triển:

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

4. Mở trình duyệt và truy cập [http://localhost:3001](http://localhost:3001)

### Build và chạy ở môi trường production

1. Build dự án:

```bash
npm run build
# hoặc
yarn build
# hoặc
pnpm build
```

2. Chạy ở môi trường production:

```bash
npm run start
# hoặc
yarn start
# hoặc
pnpm start
```

## Cấu trúc dự án

```
XLab_Web/
├── public/               # Static files
├── src/
│   ├── app/              # App router pages
│   ├── components/       # React components
│   └── styles/           # CSS styles
├── .gitignore
├── next.config.js        # Next.js configuration
├── package.json
├── README.md
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Tác giả

XLab Development Team

## Giấy phép

Copyright © 2023 XLab. All rights reserved.

## Cài đặt Google OAuth đăng nhập

Để thiết lập đăng nhập bằng Google, bạn cần tạo Google OAuth credentials:

1. Đi đến [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo dự án mới hoặc chọn dự án hiện có
3. Từ menu bên trái, chọn "APIs & Services" > "Credentials"
4. Click "Create Credentials" và chọn "OAuth client ID"
5. Chọn "Web application" làm loại ứng dụng
6. Thêm tên cho ứng dụng của bạn (ví dụ: "XLab Web")
7. Thêm các URL sau vào phần "Authorized JavaScript origins":
   - `http://localhost:3001` (cho môi trường phát triển)
   - `http://58.186.71.93:3001` (cho môi trường hiện tại nếu cần)
   - `https://your-production-domain.com` (cho môi trường sản xuất)
8. Thêm các URL sau vào phần "Authorized redirect URIs":
   - `http://localhost:3001/api/auth/callback/google` (cho môi trường phát triển)
   - `http://58.186.71.93:3001/api/auth/callback/google` (cho môi trường hiện tại nếu cần)
   - `https://your-production-domain.com/api/auth/callback/google` (cho môi trường sản xuất)
9. Click "Create"
10. Sao chép Client ID và Client Secret
11. Thêm chúng vào file `.env.local`:

```
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=K2P5fgz9WJdLsY7mXn4A6BcRtVxZqH8DbE3NpQuT

# Google OAuth credentials
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

12. Khởi động lại server để các thay đổi có hiệu lực

## Lưu ý bảo mật

- **KHÔNG** commit file `.env.local` lên git repository
- **KHÔNG** chia sẻ Google Client Secret với bất kỳ ai
- Trong môi trường sản xuất, hãy tạo một NEXTAUTH_SECRET mạnh và duy nhất

## Hướng dẫn chạy ứng dụng

### Yêu cầu
- Node.js phiên bản 20.x trở lên
- npm phiên bản 10.x trở lên

### Cách chạy

1. Chạy bình thường:
```
run.bat
```

2. Cài đặt mới hoàn toàn (xóa cache và cài đặt lại):
```
run.bat clean
```
hoặc
```
run.bat --clean
```
hoặc
```
run.bat -c
```

Đồng thời, khi chạy không có tham số, script sẽ hỏi bạn muốn chạy bình thường hay cài đặt mới.

### Các lỗi thường gặp

1. Lỗi "Cannot read properties of undefined (reading 'call')":
   - Đã được sửa trong cấu hình webpack

2. Lỗi "Port 3000 is in use":
   - Hệ thống sẽ tự động chuyển sang cổng 3001

3. Lỗi EPERM khi xóa hoặc cài đặt:
   - Chạy lại với quyền admin hoặc đóng tất cả ứng dụng đang sử dụng tệp 