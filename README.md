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

## Cấu hình Google OAuth

Để đăng nhập bằng Google hoạt động đúng, bạn cần thực hiện các bước sau:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một dự án mới hoặc chọn dự án hiện có
3. Đi tới "APIs & Services" > "Credentials" 
4. Nhấp vào "Create Credentials" và chọn "OAuth client ID"
5. Chọn "Web application" làm loại ứng dụng
6. Đặt tên cho OAuth client
7. Thêm URL chuyển hướng được phép:
   - `http://localhost:3000/api/auth/callback/google` (cho môi trường phát triển)
   - `https://your-domain.com/api/auth/callback/google` (cho môi trường sản xuất)
8. Nhấp vào "Create"
9. Sau khi tạo, sao chép "Client ID" và "Client Secret" vào file `.env.local` của bạn

Đảm bảo các biến môi trường được cài đặt đúng trong file `.env.local`:

```
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
NEXTAUTH_URL=http://localhost:3000 (or your production URL)
NEXTAUTH_SECRET=your-secret-key
```

## Xử lý lỗi OAuth thường gặp

Nếu bạn gặp lỗi khi đăng nhập bằng Google:

1. Kiểm tra console để xem log lỗi chi tiết
2. Đảm bảo URL callback được cấu hình đúng trong Google Cloud Console
3. Xác nhận rằng các biến môi trường được thiết lập đúng
4. Đảm bảo ứng dụng khởi động lại sau khi thay đổi các biến môi trường
5. Nếu đang phát triển local, đảm bảo bạn đang sử dụng http://localhost:3000

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