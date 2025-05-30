# XLab Web

Dự án web bán hàng và phân phối phần mềm XLab.

## Quick Start (Khởi chạy nhanh)

### Với Windows - Chạy bằng 1 lệnh

Dự án đã có sẵn scripts tự động cài đặt dependencies và chạy server:

**Cách 1: Dùng file .bat**
```bash
run.bat
```

**Cách 2: Dùng PowerShell**
```powershell
.\run.ps1
```

Cả hai scripts sẽ tự động:
- ✅ Kiểm tra và cài đặt `node_modules` nếu chưa có
- 🔄 Cập nhật dependencies để đảm bảo mới nhất
- 🚀 Khởi chạy development server
- ❌ Hiển thị lỗi chi tiết nếu có vấn đề

### Cách chạy thủ công

Nếu muốn chạy từng bước:

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy môi trường phát triển
npm run dev

# 3. Build cho production
npm run build

# 4. Chạy bản build
npm start
```

## Cấu trúc dự án

Sau khi tái cấu trúc, dự án được tổ chức như sau:

```
src/
├── app/               # Next.js app router
├── components/        # Các component được tổ chức theo module
│   ├── auth/          # Components liên quan đến xác thực
│   ├── cart/          # Components liên quan đến giỏ hàng
│   ├── common/        # Components dùng chung
│   ├── layout/        # Components layout (Header, Footer,...)
│   ├── payment/       # Components liên quan đến thanh toán
│   └── product/       # Components liên quan đến sản phẩm
├── config/            # Cấu hình dự án
├── lib/               # Các tiện ích và helpers
├── models/            # Định nghĩa models
├── scripts/           # Scripts hỗ trợ
├── styles/            # CSS và styles
└── types/             # TypeScript type definitions
```

## Các module chính

### Components
Các component được tổ chức theo module chức năng:

- `auth`: Xác thực và phân quyền
- `cart`: Giỏ hàng và chức năng mua hàng
- `common`: Components dùng chung (Button, Spinner,...)
- `layout`: Layout dùng chung (Header, Footer,...)
- `payment`: Các components thanh toán
- `product`: Components liên quan đến sản phẩm

### Cách import

Tất cả các module đều có file `index.ts` export các components, giúp việc import trở nên đơn giản:

```tsx
// Cách cũ
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Cách mới - rõ ràng và tổ chức tốt hơn
import { Header, Footer } from '@/components/layout';
```

## Phát triển

```bash
# Cài đặt dependencies
npm install

# Chạy môi trường phát triển
npm run dev

# Build cho production
npm run build

# Chạy bản build
npm start
```

## Lưu ý khi phát triển

- Tạo components mới trong thư mục tương ứng với chức năng
- Export component trong file `index.ts` của thư mục đó
- Sử dụng các utilities từ `lib` cho các xử lý chung
- Định nghĩa các types trong thư mục `types`
- Tạo mới hoặc sửa đổi cấu hình trong thư mục `config`

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

4. Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

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

## Tác giả

XLab Development Team

## Giấy phép

Copyright © 2023 XLab. All rights reserved.

## Product ID Generation

Products in the system use automatically generated IDs based on their names. This provides several benefits:

1. **Human-readable IDs**: IDs are more meaningful and can be easily understood
2. **SEO-friendly**: When used in URLs, these IDs are more favorable for search engines
3. **Consistency**: All products follow the same naming convention

The ID generation follows these rules:
- Convert name to lowercase
- Remove special characters
- Replace spaces with hyphens
- Handle duplicates by adding a numeric suffix (e.g., "product-name-1")

For example:
- "Product Name" becomes "product-name"
- "Product Name (Special)" becomes "product-name-special"

If you need to update existing product IDs to follow this convention, you can run:

```
node utils/update-product-ids.js
```

## Cài đặt Google OAuth đăng nhập

Để thiết lập đăng nhập bằng Google, bạn cần tạo Google OAuth credentials:

1. Đi đến [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo dự án mới hoặc chọn dự án hiện có
3. Từ menu bên trái, chọn "APIs & Services" > "Credentials"
4. Click "Create Credentials" và chọn "OAuth client ID"
5. Chọn "Web application" làm loại ứng dụng
6. Thêm tên cho ứng dụng của bạn (ví dụ: "XLab Web")
7. Thêm các URL sau vào phần "Authorized JavaScript origins":
   - `http://localhost:3000` (cho môi trường phát triển)
   - `http://58.186.71.93:3000` (cho môi trường hiện tại nếu cần)
   - `https://your-production-domain.com` (cho môi trường sản xuất)
8. Thêm các URL sau vào phần "Authorized redirect URIs":
   - `http://localhost:3000/api/auth/callback/google` (cho môi trường phát triển)
   - `http://58.186.71.93:3000/api/auth/callback/google` (cho môi trường hiện tại nếu cần)
   - `https://your-production-domain.com/api/auth/callback/google` (cho môi trường sản xuất)
9. Click "Create"
10. Sao chép Client ID và Client Secret
11. Thêm chúng vào file `.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
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
   - Hệ thống sẽ tự động chuyển sang cổng khác

3. Lỗi EPERM khi xóa hoặc cài đặt:
   - Chạy lại với quyền admin hoặc đóng tất cả ứng dụng đang sử dụng tệp