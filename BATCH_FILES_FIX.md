# Sửa lỗi Encoding trong các file Batch

## Vấn đề gặp phải

Khi chạy `start.bat`, gặp lỗi encoding với các ký tự Unicode và emoji:

```
'dejs.org' is not recognized as an internal or external command,
'ho' is not recognized as an internal or external command,
'�y' is not recognized as an internal or external command,
'��═══════════════════════╗' is not recognized as an internal or external command,
...
```

## Nguyên nhân

- Windows Command Prompt không thể hiển thị đúng các ký tự Unicode và emoji trong file batch
- Các ký tự đặc biệt như `╔`, `║`, `╚`, `🚀`, `📝`, v.v. gây ra lỗi parsing
- Tiếng Việt có dấu cũng gây vấn đề tương tự

## Giải pháp đã áp dụng

### 1. Thay thế ký tự Unicode
- Thay thế các ký tự box drawing (`╔`, `║`, `╚`) bằng dấu `=`
- Loại bỏ tất cả emoji (`🚀`, `📝`, `🔨`, v.v.)
- Chuyển đổi tiếng Việt có dấu thành không dấu

### 2. Cải thiện xử lý encoding
- Thêm `2>&1` vào lệnh `chcp 65001 >nul 2>&1` để ẩn cả error output
- Đảm bảo encoding được thiết lập đúng cách

### 3. Files đã được sửa

#### start.bat
- Thay đổi từ tiếng Việt có dấu sang không dấu
- Loại bỏ emoji và ký tự đặc biệt
- Giữ nguyên chức năng và logic

#### build.bat  
- Áp dụng các thay đổi tương tự như start.bat
- Đảm bảo tính nhất quán

#### clean.bat
- Sửa encoding và ký tự đặc biệt
- Giữ nguyên chức năng dọn dẹp cache

### 4. Script hỗ trợ
- Tạo `commit-changes.ps1` để tự động commit và push changes lên GitHub

## Kết quả

Sau khi sửa lỗi:
- Các file batch chạy được bình thường trên Windows
- Không còn lỗi encoding
- Menu và thông báo hiển thị đúng
- Chức năng hoạt động như mong đợi

## Cách sử dụng

```bash
# Chạy development environment
.\start.bat

# Build production
.\build.bat

# Dọn dẹp cache
.\clean.bat
```

## Lưu ý

- Nếu muốn sử dụng tiếng Việt có dấu, cần đảm bảo terminal hỗ trợ UTF-8
- Tránh sử dụng emoji trong file batch trên Windows
- Luôn test trên Command Prompt trước khi commit

## Commit thông tin

- **Commit**: Fix encoding issues in batch files
- **Files changed**: start.bat, build.bat, clean.bat, commit-changes.ps1
- **Branch**: dev_22
