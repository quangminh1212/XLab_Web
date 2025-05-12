# Hướng dẫn sửa lỗi mất định dạng ảnh khi tải ZIP từ Git

## Vấn đề

Khi tải file ZIP từ tag trên GitHub hoặc GitLab, các file ảnh và binary khác có thể bị mất định dạng. Điều này xảy ra do cách Git LFS (Large File Storage) hoạt động - các file lớn như ảnh được lưu trữ riêng biệt và chỉ chứa tham chiếu đến kho lưu trữ LFS trong repository thông thường.

Khi tải ZIP, GitHub/GitLab không tự động giải quyết các tham chiếu LFS này, do đó bạn chỉ nhận được các file tham chiếu thay vì nội dung thực của file ảnh.

## Giải pháp

Chúng tôi đã tạo script `fix-git-lfs-issues.js` để tự động sửa lỗi này. Script này:

1. Vô hiệu hóa Git LFS trong repository bằng cách sửa đổi file `.gitattributes`
2. Đảm bảo các file ảnh được đánh dấu là binary để Git xử lý chúng đúng cách
3. Tạo file `.lfsconfig` để vô hiệu hóa LFS nếu đã được cài đặt

## Cách sử dụng

### Tự động (Khuyến nghị)

Script sẽ tự động chạy khi bạn khởi động dự án bằng lệnh:

```bash
npm run dev
# hoặc
npm start
```

hoặc sử dụng file `run.bat`.

### Thủ công

Nếu bạn muốn chạy script sửa lỗi một cách thủ công:

```bash
npm run fix-lfs-issues
```

hoặc:

```bash
node scripts/fix-git-lfs-issues.js
```

## Khôi phục cấu hình LFS (nếu cần)

Nếu vì lý do nào đó bạn muốn khôi phục cấu hình Git LFS ban đầu:

1. Xóa file `.gitattributes` hiện tại
2. Đổi tên `.gitattributes.bak` thành `.gitattributes` (nếu có)
3. Xóa file `.lfsconfig` (nếu có)

## Cách tải repository đúng cách

Thay vì tải ZIP từ GitHub/GitLab, cách tốt nhất để tải repository có sử dụng Git LFS là:

1. Cài đặt Git LFS: `git lfs install`
2. Clone repository: `git clone https://github.com/username/repo.git`
3. Pull nội dung LFS: `git lfs pull`

Cách này đảm bảo rằng bạn nhận được nội dung đầy đủ của tất cả các file, bao gồm cả file ảnh. 