# XLab Web

Dự án web bán hàng và phân phối phần mềm XLab.

## Mục lục

- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Các module chính](#các-module-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Hướng dẫn phát triển](#hướng-dẫn-phát-triển)
- [Tối ưu hóa dự án](#tối-ưu-hóa-dự-án)
- [Bảo mật dữ liệu](#bảo-mật-dữ-liệu)
- [Authentication](#hướng-dẫn-thiết-lập-authentication)
- [Product ID Generation](#product-id-generation)
- [Tác giả và bản quyền](#tác-giả)

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
├── contexts/          # React Contexts
├── lib/               # Các tiện ích và helpers
├── models/            # Định nghĩa models
├── scripts/           # Scripts hỗ trợ
├── styles/            # CSS và styles
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
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

## Công nghệ sử dụng

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [NextAuth.js](https://next-auth.js.org/)

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
# Cách tốt nhất để khởi động (tự động dọn dẹp và sửa lỗi)
npm run dev:clean

# HOẶC chỉ cần chạy file batch
run.bat

# Hoặc cách thông thường
npm run dev
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

## Hướng dẫn phát triển

### Lưu ý khi phát triển

- Tạo components mới trong thư mục tương ứng với chức năng
- Export component trong file `index.ts` của thư mục đó
- Sử dụng các utilities từ `lib` và `utils` cho các xử lý chung
- Định nghĩa các types trong thư mục `types`
- Tạo mới hoặc sửa đổi cấu hình trong thư mục `config`

### Scripts hữu ích

```bash
# Cài đặt dependencies
npm install

# Chạy môi trường phát triển
npm run dev

# Build cho production
npm run build

# Chạy bản build
npm start

# Kiểm tra mã nguồn
npm run lint

# Sửa lỗi tự động
npm run lint:fix

# Format code
npm run format

# Dọn dẹp file tạm
npm run clean

# Sửa lỗi Next.js phổ biến
npm run fix

# Tối ưu toàn diện
npm run optimize
```

### Khi gặp lỗi

```bash
# Sửa lỗi Next.js phổ biến
npm run fix

# Dọn dẹp file tạm
npm run clean

# Tối ưu toàn diện
npm run optimize
```

### Trước khi commit

```bash
# Đảm bảo code sạch sẽ và đúng chuẩn
npm run format
npm run lint:fix
```

## Tối ưu hóa dự án

### Cải tiến đã thực hiện

#### 1. Tối ưu hóa cấu trúc dự án

- Cập nhật `.gitignore` để loại trừ nhiều file tạm thời và không cần thiết hơn
- Cập nhật `tsconfig.json` để cải thiện hiệu suất biên dịch TypeScript
- Tạo file utility trong `src/utils/productUtils.ts` để tái sử dụng mã
- Tối ưu hóa component với `React.memo` để giảm re-render không cần thiết

#### 2. Cải tiến Scripts

- `npm run dev:clean`: Xóa file tạm, sửa lỗi Next.js và chạy dev server
- `npm run clean`: Dọn dẹp các file tạm và tối ưu package.json
- `npm run fix`: Sửa các lỗi phổ biến của Next.js
- `npm run optimize`: Chạy toàn bộ quy trình tối ưu (clean, format, lint, fix)
- `npm run analyze`: Phân tích kích thước bundle để tối ưu hóa thêm

#### 3. Quản lý lỗi tốt hơn

- Script `fix-next-errors.js` đã được cập nhật để xử lý nhiều lỗi phổ biến hơn
- Cải thiện xử lý ngoại lệ và báo cáo lỗi
- Thêm quyền truy cập hợp lý cho các thư mục và file

### Các cải tiến chính về hiệu suất

1. **Memorization**: Sử dụng `useMemo` và `React.memo` để tránh các component re-render không cần thiết
2. **Tách nhỏ component**: Các component đã được tách nhỏ để dễ bảo trì và tối ưu hiệu suất
3. **Lazy loading**: Hình ảnh sử dụng Next.js Image với lazy loading
4. **Utility functions**: Các hàm chung được tách ra utility để tái sử dụng

### Các biện pháp tối ưu khác

1. **Cấu trúc thư mục**:
   - `/src/utils`: Chứa các hàm tiện ích tái sử dụng
   - `/scripts`: Chứa các script tự động hóa và sửa lỗi

2. **Quy ước đặt tên**:
   - Component: PascalCase (VD: ProductCard)
   - Hàm tiện ích: camelCase (VD: formatCurrency)
   - Files: kebab-case (VD: product-utils.ts)

3. **Chuẩn hóa CSS**:
   - Sử dụng TailwindCSS nhất quán
   - Đặt tên class theo BEM khi cần thiết

## Bảo mật dữ liệu

### Tổng quan

Hệ thống đã được nâng cấp để lưu dữ liệu từng người dùng vào file riêng biệt với mã hóa AES-256-CBC và kiểm tra tính toàn vẹn dữ liệu.

### Cấu hình bảo mật

#### 1. Environment Variables

Thêm vào file `.env.local`:

```bash
# Security encryption key for user data - QUAN TRỌNG: Thay đổi trong production
DATA_ENCRYPTION_KEY=your-super-secure-encryption-key-here-change-in-production
```

#### 2. Tạo encryption key an toàn

```bash
# Sử dụng OpenSSL
openssl rand -base64 32

# Hoặc sử dụng Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Cấu trúc lưu trữ

```
data/
├── users/                    # Dữ liệu user được mã hóa (KHÔNG commit)
│   ├── user_abc123def456.json
│   └── user_789xyz012345.json
├── backups/                  # Backup tự động (KHÔNG commit)
│   ├── 2025-01-29T10-30-00_user_abc123def456.json
│   └── 2025-01-29T11-15-00_user_789xyz012345.json
├── users.json               # Dữ liệu cũ (fallback)
├── transactions.json        # Dữ liệu cũ (fallback)
└── balances.json           # Dữ liệu cũ (fallback)
```

### Tính năng bảo mật

#### 1. Mã hóa dữ liệu

- Sử dụng AES-256-CBC encryption
- Mỗi file có IV (Initialization Vector) riêng
- Checksum SHA-256 để kiểm tra tính toàn vẹn

#### 2. Tên file an toàn

- Hash SHA-256 của email thành tên file
- Không thể đoán được email từ tên file

#### 3. Backup tự động

- Tự động backup trước khi cập nhật
- Lưu với timestamp để khôi phục

#### 4. Kiểm tra tính toàn vẹn

- Checksum validation
- Detect data tampering

### API Endpoints bảo mật

#### 1. Admin - Xem dữ liệu user

```
GET /api/admin/user-data?email=user@example.com&action=info
```

#### 2. Admin - Kiểm tra tính toàn vẹn

```
GET /api/admin/user-data?email=user@example.com&action=integrity
```

#### 3. Admin - Thống kê user

```
GET /api/admin/user-data?email=user@example.com&action=stats
```

### Lưu ý quan trọng

1. **KHÔNG BAO GIỜ commit thư mục /data/users/ và /data/backups/**
2. **Thay đổi DATA_ENCRYPTION_KEY trong production**
3. **Backup định kỳ thư mục data/**
4. **Kiểm tra log errors thường xuyên**
5. **Test tính năng integrity check định kỳ**

### Test hệ thống bảo mật

1. Đăng nhập với user bất kỳ
2. Vào `/admin` (với admin account)
3. Tìm kiếm email user
4. Kiểm tra tính toàn vẹn dữ liệu
5. Xem activities và transactions

## Hướng dẫn thiết lập Authentication

### Vấn đề hiện tại

Dự án đang gặp lỗi 401 Unauthorized khi:

- Truy cập `/api/notifications`
- Cố gắng đăng nhập với Google OAuth

### Nguyên nhân

- Thiếu file `.env.local` chứa credentials cho Google OAuth
- Chưa thiết lập Google OAuth Application

### Các bước sửa lỗi

#### 1. Thiết lập Google OAuth Application

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google+ API và Google OAuth2 API
4. Vào **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Thiết lập:
   - Application type: **Web application**
   - Name: **XLab Web Auth**
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://127.0.0.1:3000/api/auth/callback/google`

#### 2. Cập nhật file .env.local

File `.env.local` đã được tạo với template. Bạn cần cập nhật:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secure-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-console

# Admin emails
ADMIN_EMAILS=xlab.rnd@gmail.com
```

#### 3. Tạo NEXTAUTH_SECRET

Tạo secret key bảo mật:

```bash
# Cách 1: Sử dụng openssl (nếu có)
openssl rand -base64 32

# Cách 2: Sử dụng Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Cách 3: Sử dụng online generator
# https://generate-secret.vercel.app/32
```

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

## Tác giả

XLab Development Team

## Giấy phép

Copyright © 2023 XLab. All rights reserved.
