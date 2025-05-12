# XLab_Web - Cấu trúc dự án

## Cấu trúc thư mục

```
XLab_Web/
├── .next/                  # Build output (không track trong git)
├── public/                 # Static files
│   ├── images/             # Hình ảnh tĩnh
│   └── ...
├── scripts/                # Scripts tiện ích
├── src/                    # Source code
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Nhóm các route yêu cầu authentication
│   │   ├── admin/          # Routes dành cho admin
│   │   ├── api/            # API routes
│   │   └── ...             # Các route khác
│   ├── components/         # React components
│   │   ├── auth/           # Components xác thực
│   │   ├── cart/           # Components giỏ hàng
│   │   ├── common/         # Components dùng chung
│   │   ├── layout/         # Layout components
│   │   ├── payment/        # Payment components
│   │   └── product/        # Product components
│   ├── config/             # Configuration files
│   ├── contexts/           # React Contexts
│   ├── data/               # Mock data và các dữ liệu tĩnh
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions 
│   ├── models/             # Data models
│   ├── styles/             # Styles
│   └── types/              # TypeScript types
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies và scripts
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project documentation
└── tailwind.config.js      # Tailwind CSS configuration
```

## Kiến trúc ứng dụng

### Front-end

- **Next.js 15.x**: Framework chính, sử dụng App Router
- **React 18.x**: Library UI
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **next-auth**: Authentication

### State Management

- **React Context**: State toàn cục
  - CartContext: Quản lý giỏ hàng
  - NotificationContext: Quản lý thông báo
  - RecentlyViewedProvider: Quản lý sản phẩm đã xem gần đây

### API và Data Fetching

- Sử dụng Next.js API Routes
- Phân tách API Service trong `src/lib/api.ts`

### Cấu trúc file và thư mục

- **Page-based structure**: Mỗi trang tương ứng với một route
- **Feature-based components**: Components được tổ chức theo tính năng
- **Shared components**: Các components dùng chung nằm trong thư mục `common`

### Tối ưu hóa

- Sử dụng React.memo cho các components không cần re-render thường xuyên
- Sử dụng useCallback và useMemo để cache functions và values
- Dynamic imports với `next/dynamic` để code splitting

## Quy ước

### Đặt tên

- **Tên file**:
  - Components: PascalCase (ví dụ: ProductCard.tsx)
  - Hooks: camelCase và bắt đầu với "use" (ví dụ: useCart.ts)
  - Utilities: camelCase (ví dụ: formatCurrency.ts)

- **Variables/Functions**: camelCase
- **Components/Types/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE

### Imports

- Sắp xếp imports theo thứ tự:
  1. React và các thư viện bên ngoài
  2. Next.js components
  3. Components nội bộ
  4. Hooks, utils, và types
  5. Assets (images, styles, etc.)

### CSS

- Sử dụng Tailwind CSS classes
- Tránh inline styles
- Sử dụng CSS modules cho các styles phức tạp

## Cách thêm tính năng mới

1. Tạo/cập nhật các types cần thiết trong `src/types/`
2. Tạo các utils functions trong `src/lib/` nếu cần
3. Phát triển các components cần thiết trong `src/components/`
4. Tạo/cập nhật API endpoints trong `src/app/api/` (nếu cần)
5. Tích hợp vào pages trong `src/app/`

## Tối ưu hiệu suất

1. Đảm bảo responsive trên tất cả thiết bị
2. Tối ưu hóa hình ảnh với `next/image`
3. Sử dụng dynamic imports khi cần thiết
 