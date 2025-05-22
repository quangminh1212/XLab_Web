# Hướng dẫn cập nhật số lượt mua tự động

## Cài đặt

Hệ thống đã được cài đặt các tính năng:

1. API tự động cập nhật số lượt mua: `/api/admin/products/update-purchases`
2. Script Node.js để chạy API: `src/scripts/update-purchases.js`
3. Command npm: `npm run update-purchases`

## Cách sử dụng

### Cách 1: Chạy lệnh trực tiếp

```bash
npm run update-purchases
```

### Cách 2: Cài đặt cronjob tự động chạy hàng ngày (trên server Linux)

```bash
# Mở trình soạn thảo crontab
crontab -e

# Thêm dòng dưới đây để chạy vào 00:00 mỗi ngày
0 0 * * * cd /đường/dẫn/tới/dự/án && npm run update-purchases >> logs/update-purchases.log 2>&1
```

### Cách 3: Tạo Task Scheduler trên Windows

1. Mở Task Scheduler trên Windows
2. Tạo task mới chạy lệnh sau mỗi ngày:
   ```
   cmd.exe /c "cd /d C:\VF\XLab_Web && npm run update-purchases"
   ```

## Tùy chỉnh

Hệ thống hiện tại được cấu hình để tăng ngẫu nhiên 1-10 lượt mua mỗi ngày cho mỗi sản phẩm.

Để thay đổi phạm vi số lượng tăng, bạn có thể chỉnh sửa file:
- `src/app/api/admin/products/update-purchases/route.ts`

Hoặc thay đổi số lượt mua ban đầu khi tạo sản phẩm tại:
- `src/app/admin/products/new/page.tsx` 