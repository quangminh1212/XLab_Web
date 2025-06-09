# Hướng dẫn bảo mật

## Biến môi trường
- Không bao giờ commit `.env.local` vào git
- Tạo lại tất cả thông tin xác thực trước khi triển khai production
- Sử dụng các khóa bí mật mạnh và duy nhất cho môi trường production

## Xác thực
- Thông tin xác thực Google OAuth chỉ dành cho môi trường phát triển
- Thay thế bằng thông tin xác thực production trước khi triển khai
- Sử dụng quản lý phiên đúng cách trong production

## Bảo mật API
- Tất cả các route API nên xác thực đầu vào
- Triển khai giới hạn tốc độ (rate limiting) cho production
- Chỉ sử dụng HTTPS trong production

## Bảo mật dữ liệu
- Di chuyển từ file JSON sang cơ sở dữ liệu phù hợp
- Triển khai xác thực dữ liệu đúng cách
- Sử dụng truy vấn có tham số để ngăn chặn SQL injection

## Giám sát
- Thiết lập theo dõi lỗi (Sentry)
- Giám sát sử dụng và hiệu suất API
- Thiết lập cảnh báo cho các sự cố bảo mật

## Danh sách kiểm tra trước khi triển khai
1. Thay thế thông tin xác thực Google OAuth bằng giá trị production
2. Tạo NEXTAUTH_SECRET mới cho production
3. Di chuyển từ file JSON sang cơ sở dữ liệu phù hợp
4. Thiết lập giám sát và ghi nhật ký phù hợp
5. Đánh giá và kiểm tra tất cả các biện pháp bảo mật trước khi triển khai
6. Đảm bảo tất cả các header bảo mật được cấu hình đúng
7. Kiểm tra và cập nhật tất cả các phụ thuộc có lỗi bảo mật

## Báo cáo lỗ hổng bảo mật
Nếu bạn phát hiện lỗ hổng bảo mật trong dự án này, vui lòng báo cáo cho chúng tôi qua email:
xlab.rnd@gmail.com

Vui lòng không tiết lộ công khai lỗ hổng cho đến khi nó được khắc phục. 