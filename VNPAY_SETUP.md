# VNPay Integration Setup

## Environment Variables

Thêm các dòng sau vào file `.env.local`:

```bash
# VNPay Configuration
VNPAY_TMN_CODE=your_tmn_code_here
VNPAY_SECRET_KEY=your_secret_key_here  
VNPAY_API_URL=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

## Cách lấy TMN Code và Secret Key

1. Đăng ký tài khoản VNPay Merchant tại: https://vnpay.vn
2. Sau khi được duyệt, đăng nhập vào portal merchant
3. Vào **Cấu hình** > **Thông tin kết nối**
4. Copy `TMN Code` và `Secret Key`

## Sandbox Environment (Demo)

Để test trong môi trường phát triển, hệ thống sẽ tự động sử dụng demo data nếu không có credentials thật.

## Chức năng đã tích hợp

✅ **Tự động xác thực VNPay**
- Tự động polling để check trạng thái giao dịch
- Không cần nhập mã thủ công
- Tự động chuyển hướng khi thanh toán thành công

✅ **API QueryDr Integration**  
- Tuân thủ chuẩn VNPay API 2.1.0
- Secure hash SHA512
- Error handling đầy đủ

✅ **UI/UX cải tiến**
- 3 phương thức xác thực: VNPay Auto, Confirm, Manual Code
- Real-time polling status
- Loading states và progress indicators

## Testing

1. Chạy server: `npm run dev`
2. Vào trang checkout: http://localhost:3000/checkout?skipInfo=true
3. Chọn "Tự động xác thực VNPay"
4. Click "Bắt đầu xác thực tự động"
5. Hệ thống sẽ mô phỏng polling và tự động thành công sau vài giây 