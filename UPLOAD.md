# Hướng dẫn sử dụng chức năng upload file trong XLab Web

## Giới thiệu

XLab Web sử dụng Cloudinary để lưu trữ và phục vụ các file phần mềm được upload. Quá trình này được tích hợp vào form đăng sản phẩm ở trang Admin.

## Cấu hình

Để sử dụng chức năng upload, bạn cần cấu hình các biến môi trường sau trong file `.env.development.local`:

```
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Bạn có thể lấy các thông tin này sau khi đăng ký tài khoản trên [Cloudinary](https://cloudinary.com/).

## Cách sử dụng

1. Truy cập trang Admin qua đường dẫn `/admin`
2. Điền đầy đủ thông tin sản phẩm vào form
3. Tại mục "File phần mềm", nhấp vào khu vực kéo thả để chọn file hoặc kéo thả file vào đó
4. Sau khi chọn file, tên file và kích thước sẽ hiển thị
5. Nhấn nút "Đăng sản phẩm" để tải lên file và tạo sản phẩm mới
6. Khi upload thành công, URL file sẽ được lưu vào database và hiển thị thông báo thành công

## Cách hoạt động

1. **Frontend**: File được chọn và gửi dưới dạng FormData kèm theo các thông tin sản phẩm khác
2. **Backend**: API route nhận FormData, xử lý upload file lên Cloudinary thông qua utility function
3. **Cloudinary**: Lưu trữ file và trả về thông tin (URL, public ID, etc.)
4. **Database**: Thông tin file (URL, tên, kích thước) được lưu cùng sản phẩm

## Hạn chế hiện tại

- Kích thước file tối đa: 500MB (có thể điều chỉnh trong Cloudinary dashboard)
- Các định dạng hỗ trợ: ZIP, RAR, EXE, và hầu hết các định dạng file phổ biến
- Cần có kết nối internet để upload file

## Xử lý lỗi

Nếu gặp lỗi khi upload, hãy kiểm tra:
- Kết nối internet
- Cấu hình Cloudinary
- Kích thước file (không quá 500MB)
- Quyền truy cập API của Cloudinary

## Bảo mật

- File được upload thông qua HTTPS
- Mỗi file được gán một public ID duy nhất
- URL file có thể được cấu hình để hết hạn sau một thời gian