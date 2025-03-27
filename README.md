# XLab Web

XLab Web là nền tảng nghiên cứu khoa học trực tuyến, được phát triển nhằm kết nối các nhà nghiên cứu và cung cấp các công cụ hỗ trợ nghiên cứu hiện đại.

## Tính năng

- **Nghiên cứu**: Công cụ tìm kiếm và tổ chức dữ liệu nghiên cứu
- **Cộng đồng**: Kết nối với các nhà nghiên cứu từ khắp nơi trên thế giới
- **Phân tích**: Công cụ phân tích dữ liệu mạnh mẽ

## Công nghệ sử dụng

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Bắt đầu

### Sử dụng script tự động

Chạy file `run.bat` để cài đặt, build và khởi động dự án tự động:

```bash
# Chạy script tự động
run.bat
```

### Cài đặt thủ công

1. Cài đặt các gói phụ thuộc:

```bash
npm install
```

2. Khởi động server phát triển:

```bash
npm run dev
```

3. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt để xem kết quả.

## Build cho môi trường production

```bash
npm run build
npm run start
```

## Cấu trúc dự án

```
XLab_Web/
├── public/            # Tài nguyên tĩnh
├── src/
│   ├── components/    # Các thành phần UI có thể tái sử dụng
│   ├── pages/         # Các trang của ứng dụng
│   └── styles/        # File CSS
├── .babelrc           # Cấu hình Babel
├── next.config.js     # Cấu hình Next.js
├── package.json       # Phụ thuộc và script
├── run.bat            # Script khởi động tự động
└── tsconfig.json      # Cấu hình TypeScript
```

## Liên hệ

Để biết thêm thông tin, vui lòng liên hệ với nhóm phát triển XLab.
