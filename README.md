# XLab - Website Phần mềm và Dịch vụ

XLab là một website giới thiệu các sản phẩm và dịch vụ phần mềm cho doanh nghiệp, được xây dựng bằng Next.js, TypeScript và Tailwind CSS.

## Tính năng

- **Trang chủ**: Giới thiệu tổng quan về công ty và các dịch vụ
- **Sản phẩm**: Trình bày chi tiết các sản phẩm phần mềm
- **Dịch vụ**: Mô tả các dịch vụ công nghệ và hỗ trợ
- **Báo giá**: Hiển thị các gói dịch vụ và báo giá
- **Blog**: Chia sẻ kiến thức về công nghệ và phần mềm
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