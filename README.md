# XLab - Trang web bán phần mềm chất lượng cao

XLab là trang web bán phần mềm chất lượng cao, được phát triển bằng Next.js với TypeScript.

## Tính năng

- Trang chủ giới thiệu sản phẩm và dịch vụ
- Trang danh sách sản phẩm với tính năng tìm kiếm và lọc
- Trang chi tiết sản phẩm với mô tả, thông số kỹ thuật, tính năng và FAQ
- SEO tối ưu với metadata, sitemap và robots.txt
- Thiết kế responsive, hiển thị tốt trên các thiết bị di động

## Công nghệ sử dụng

- **Framework**: Next.js 13.5.6
- **Ngôn ngữ**: TypeScript
- **UI/UX**: CSS thuần với biến và thiết kế responsive
- **SEO**: Metadata, OpenGraph, Sitemap, Robots.txt

## Cài đặt

### Cách 1: Sử dụng file run.bat (Khuyến nghị cho Windows)

Đơn giản là nhấp đúp vào file `run.bat` để tự động:
- Sửa lỗi môi trường Next.js
- Cài đặt các thư viện cần thiết
- Khởi động máy chủ phát triển

### Cách 2: Sử dụng lệnh thủ công

1. Clone dự án:
```bash
git clone https://github.com/yourusername/xlab-web.git
cd xlab-web
```

2. Sửa lỗi môi trường Next.js (nếu cần):
```bash
node fix-next.js
```

3. Cài đặt các thư viện:
```bash
npm install --legacy-peer-deps
```

4. Chạy môi trường phát triển:
```bash
npm run dev
```

5. Build cho môi trường production:
```bash
npm run build
npm start
```

## Xử lý sự cố

Nếu gặp lỗi khi chạy dự án:

1. Đảm bảo Node.js đã được cài đặt (khuyến nghị phiên bản LTS)
2. Chạy script sửa lỗi Next.js: `node fix-next.js`
3. Cài đặt lại thư viện: `npm install --legacy-peer-deps`
4. Xóa cache: `npm cache clean --force` và `.next` (nếu có)
5. Khởi động lại: `npm run dev`

## Cấu trúc dự án

```
xlab-web/
├── public/             # Tài nguyên tĩnh (hình ảnh, robots.txt, sitemap.xml)
├── src/                # Mã nguồn
│   ├── app/            # Các trang trong ứng dụng (Next.js App Router)
│   │   ├── page.tsx    # Trang chủ
│   │   ├── products/   # Trang sản phẩm
│   │   │   ├── page.tsx       # Trang danh sách sản phẩm
│   │   │   ├── [id]/          # Trang chi tiết sản phẩm
│   │   │   └── products.css   # CSS cho trang sản phẩm
│   ├── components/     # Các components tái sử dụng
│   ├── styles/         # CSS toàn cục
│   ├── lib/            # Thư viện và utility functions
│   └── utils/          # Các hàm tiện ích
├── next.config.js      # Cấu hình Next.js
├── tsconfig.json       # Cấu hình TypeScript
├── package.json        # Thông tin dự án và dependencies
├── fix-next.js         # Script tự động sửa lỗi môi trường Next.js
├── run.bat             # Script khởi động tự động cho Windows
└── README.md           # Tài liệu dự án
```

## Liên hệ

Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ:

- Email: info@xlab.vn
- Điện thoại: +84 123 456 789 