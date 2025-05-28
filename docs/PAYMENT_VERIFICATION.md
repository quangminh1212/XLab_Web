# Hệ thống xác thực thanh toán XLab

## Tổng quan

Hệ thống xác thực thanh toán của XLab cung cấp 2 phương thức chính:

1. **Thanh toán chuyển khoản ngân hàng + xác thực thủ công**
2. **Thanh toán trực tuyến qua VNPay Gateway**

## 1. Thanh toán chuyển khoản ngân hàng

### Quy trình:
1. Khách hàng xem QR Code VietQR hoặc thông tin ngân hàng
2. Thực hiện chuyển khoản với nội dung chứa mã đơn hàng
3. Nhập mã xác thực (mã giao dịch từ SMS/App ngân hàng)
4. Hệ thống xác thực và cập nhật trạng thái đơn hàng

### Thông tin ngân hàng:
- **Ngân hàng**: MBBank (Ngân hàng Quân đội)
- **Chủ tài khoản**: Bach Minh Quang
- **Số tài khoản**: 669912122000

### API Endpoints:

#### POST `/api/payment/verify`
Xác thực thanh toán bằng mã giao dịch

**Request:**
```json
{
  "orderId": "ORDER-1234567890",
  "verificationCode": "ABC123456",
  "amount": 5000000
}
```

**Response thành công:**
```json
{
  "success": true,
  "message": "Xác thực thành công",
  "transaction": {
    "orderId": "ORDER-1234567890",
    "amount": 5000000,
    "transactionId": "BANK_1234567890_123",
    "status": "manual_verified",
    "method": "manual"
  }
}
```

**Response thất bại:**
```json
{
  "success": false,
  "message": "Mã xác thực không hợp lệ"
}
```

## 2. Thanh toán VNPay Gateway

### Quy trình:
1. Khách hàng nhấn "Thanh toán qua VNPay"
2. Hệ thống tạo URL thanh toán VNPay
3. Chuyển hướng đến cổng thanh toán VNPay
4. Khách hàng thực hiện thanh toán
5. VNPay gửi kết quả về thông qua Return URL và IPN
6. Hệ thống xác thực chữ ký và cập nhật trạng thái

### API Endpoints:

#### POST `/api/payment/vnpay/create`
Tạo URL thanh toán VNPay

**Request:**
```json
{
  "amount": 5000000,
  "orderId": "ORDER-1234567890",
  "orderInfo": "Thanh toan don hang ORDER-1234567890",
  "bankCode": ""
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
  "orderId": "ORDER-1234567890"
}
```

#### GET `/api/payment/vnpay/return`
Xử lý kết quả trả về từ VNPay (Return URL)

**Parameters:** Các tham số VNPay gửi về
**Action:** Redirect đến `/payment/result` với kết quả

#### POST `/api/payment/vnpay/ipn`
Xử lý thông báo tức thì từ VNPay (IPN - Instant Payment Notification)

**Request:** VNPay parameters
**Response:**
```json
{
  "RspCode": "00",
  "Message": "Confirm Success"
}
```

## 3. Lưu trữ giao dịch

Tất cả giao dịch được lưu trong file `data/transactions.json` với format:

```json
[
  {
    "orderId": "ORDER-1234567890",
    "amount": 5000000,
    "responseCode": "00",
    "transactionNo": "BANK_1234567890_123",
    "bankCode": "MB",
    "cardType": "ATM",
    "payDate": "20241201120000",
    "isValidSignature": true,
    "status": "success", // success, failed, confirmed, manual_verified
    "createdAt": "2024-12-01T12:00:00.000Z",
    "updatedAt": "2024-12-01T12:05:00.000Z",
    "method": "vnpay", // vnpay, manual
    "rawData": {...}, // VNPay raw response
    "ipnData": {...}  // IPN confirmation data
  }
]
```

## 4. Trạng thái giao dịch

- **success**: Thanh toán thành công (từ VNPay Return URL)
- **failed**: Thanh toán thất bại
- **confirmed**: Đã được xác nhận bởi ngân hàng (qua IPN)
- **manual_verified**: Xác thực thủ công thành công

## 5. Cấu hình môi trường

Cần thiết lập các biến môi trường trong `.env.local`:

```env
# VNPay Configuration (Test Environment)
VNP_TMN_CODE=your_vnpay_tmn_code
VNP_HASH_SECRET=your_vnpay_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# NextAuth (for return URL)
NEXTAUTH_URL=http://localhost:3000
```

## 6. Xác thực bảo mật

### VNPay Signature Verification:
- Sử dụng HMAC SHA512 với secret key
- Verify tất cả request từ VNPay
- Reject các request có chữ ký không hợp lệ

### Manual Verification:
- Kiểm tra mã xác thực có độ dài tối thiểu 6 ký tự
- Mock verification với tỷ lệ thành công 90% (demo)
- Trong production cần tích hợp với API ngân hàng thực

## 7. UI Components

### PaymentForm Component:
- Hiển thị QR Code VietQR
- Form xác thực mã giao dịch
- Nút thanh toán VNPay
- Xử lý loading states và error messages

### PaymentResult Page:
- Hiển thị kết quả thanh toán
- Chi tiết giao dịch
- Actions: về trang chủ, xem đơn hàng, thử lại

## 8. Test Cases

### Thanh toán chuyển khoản:
1. Nhập mã xác thực hợp lệ (≥6 ký tự) → Thành công
2. Nhập mã xác thực ngắn (<6 ký tự) → Thất bại
3. Không nhập mã → Lỗi validation

### VNPay Gateway:
1. Tạo payment URL thành công
2. Xử lý Return URL với chữ ký hợp lệ
3. Xử lý IPN notification
4. Reject request với chữ ký không hợp lệ

## 9. Monitoring & Logs

Tất cả transaction được log với:
- Console logs cho debugging
- File storage cho persistence
- Error handling và retry logic

## 10. Production Considerations

1. **Database**: Migrate từ file storage sang database thực
2. **Bank API**: Tích hợp với API ngân hàng thực để xác thực giao dịch
3. **Webhook Security**: Implement IP whitelist cho VNPay IPN
4. **Rate Limiting**: Giới hạn request verification
5. **Audit Trail**: Log đầy đủ cho compliance
6. **Backup**: Backup định kỳ transaction data 