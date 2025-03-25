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

1. Clone dự án:
```bash
git clone https://github.com/yourusername/xlab-web.git
cd xlab-web
```

2. Cài đặt các thư viện:
```bash
npm install
```

3. Chạy môi trường phát triển:
```bash
npm run dev
```

4. Build cho môi trường production:
```bash
npm run build
npm start
```

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
└── README.md           # Tài liệu dự án
```

## Liên hệ

Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ:

- Email: info@xlab.vn
- Điện thoại: +84 123 456 789 