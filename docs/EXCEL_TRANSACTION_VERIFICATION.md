# Hướng dẫn Tra soát Giao dịch từ Excel/Google Sheets

## 🎯 Tổng quan

Hệ thống thanh toán đã được nâng cấp để có thể **tra soát giao dịch thực** từ dữ liệu Excel/CSV hoặc Google Sheets thay vì sử dụng simulation. Điều này cho phép xác thực thanh toán dựa trên dữ liệu giao dịch thật từ ngân hàng.

## 📊 Cấu trúc dữ liệu

### Format Excel/Google Sheets

| Cột | Tên trường | Ví dụ | Mô tả |
|-----|------------|-------|-------|
| A | Ngân hàng | MBBank | Tên ngân hàng |
| B | Ngày giao dịch | 2025-05-29 01:59:00 | Thời gian giao dịch |
| C | Số tài khoản | 669912122000 | Số tài khoản nhận |
| D | Tài khoản phụ | BACH MINH QUANG Chuyen tien... | Thông tin người chuyển + nội dung |
| E | Code TT | Tiền vào | Loại giao dịch |
| F | Nội dung thanh toán | 4000 | Mô tả giao dịch |
| G | Loại | FT25149200931766 | **Mã giao dịch chính** |
| H | Số tiền | 4000 | Số tiền giao dịch |
| I | Mã tham chiếu | | Mã tham chiếu bổ sung |
| J | Lũy kế | 0 | Số dư sau giao dịch |

## 🔍 Cách thức hoạt động

### 1. Luồng xác thực mới

```
User nhập mã xác thực → Hệ thống tìm kiếm trong Excel data → Kiểm tra khớp số tiền → Xác thực thành công/thất bại
```

### 2. Các tiêu chí tìm kiếm

Hệ thống sẽ tìm kiếm mã xác thực trong các trường:
- **Loại (G)**: Mã giao dịch chính (FT25149200931766)
- **Tài khoản phụ (D)**: Nội dung chuyển khoản (Trace728744)
- **Mã tham chiếu (I)**: Mã tham chiếu bổ sung
- **Nội dung thanh toán (F)**: Mô tả giao dịch

### 3. Điều kiện khớp

✅ **Thành công** khi:
- Mã xác thực được tìm thấy trong bất kỳ trường nào
- Số tiền khớp chính xác (sai số < 0.01 VND)
- Thời gian trong khoảng cho phép (nếu có)

❌ **Thất bại** khi:
- Không tìm thấy mã xác thực
- Số tiền không khớp
- Dữ liệu không hợp lệ

## 🔧 Cấu hình

### Option 1: Google Sheets API (Recommended)

Thêm vào `.env.local`:
```env
# Google Sheets API Configuration
GOOGLE_SHEETS_API_URL=https://sheets.googleapis.com
GOOGLE_SHEETS_API_KEY=your_google_api_key
GOOGLE_SHEETS_ID=1TOKHwtD13QAiQXXB5T_WkARkmT-LonO5s-BjWhj9okA
```

### Option 2: File JSON Local

Tạo file `data/transactions.json`:
```json
[
  {
    "bank": "MBBank",
    "transactionDate": "2025-05-29 01:59:00",
    "accountNumber": "669912122000",
    "accountSub": "BACH MINH QUANG Chuyen tien Ma giao dich Trace728744",
    "transactionCode": "Tiền vào",
    "description": "4000",
    "type": "FT25149200931766",
    "amount": 4000,
    "referenceCode": "",
    "balance": 0
  }
]
```

## 🧪 Testing

### Test API endpoints

```bash
# Test tra soát Excel
curl "http://localhost:3000/api/payment/verify?action=test-excel&code=FT25149200931766&amount=4000"

# Xem danh sách giao dịch
curl "http://localhost:3000/api/payment/verify?action=list-transactions"

# Test với Trace number
curl "http://localhost:3000/api/payment/verify?action=test-excel&code=728744&amount=4000"
```

### Test cases mẫu

| Mã xác thực | Số tiền | Kết quả mong đợi |
|-------------|---------|------------------|
| `FT25149200931766` | 4000 | ✅ Thành công |
| `728744` | 4000 | ✅ Thành công (Trace) |
| `FT25149200931766` | 5000 | ❌ Số tiền không khớp |
| `INVALID123` | 4000 | ❌ Không tìm thấy |

## 💡 Hướng dẫn sử dụng

### Cho người dùng cuối

1. **Thực hiện chuyển khoản** với thông tin được cung cấp
2. **Lấy mã giao dịch** từ:
   - SMS thông báo từ ngân hàng
   - App MBBank (mã FT...)
   - Số Trace trong nội dung chuyển khoản
3. **Nhập mã vào form** thanh toán
4. **Hệ thống tự động tra soát** và xác nhận

### Cho admin

1. **Cập nhật dữ liệu định kỳ**:
   - Export từ MBBank ra Excel/CSV
   - Upload lên Google Sheets hoặc cập nhật file local
   
2. **Monitor logs**:
   ```bash
   # Xem log tra soát
   tail -f .next/server/server.log | grep "Excel verification"
   ```

3. **Backup dữ liệu**:
   ```bash
   cp data/transactions.json data/transactions.backup.$(date +%Y%m%d).json
   ```

## 🔐 Bảo mật

### Điểm mạnh
- ✅ Dữ liệu giao dịch thật từ ngân hàng
- ✅ Kiểm tra khớp số tiền chính xác
- ✅ Rate limiting để chống spam
- ✅ Validation input đầy đủ

### Lưu ý bảo mật
- 🔒 Bảo vệ file `transactions.json` (đã thêm vào .gitignore)
- 🔒 Encrypt Google Sheets API key
- 🔒 Định kỳ rotate API credentials
- 🔒 Monitor logs cho các attempt bất thường

## 📈 Performance

### Optimization
- Caching transaction data trong memory
- Indexing theo mã giao dịch
- Lazy loading cho file lớn
- Background sync với Google Sheets

### Monitoring
```javascript
// Metrics có thể theo dõi
{
  "total_verifications": 1234,
  "success_rate": "95.2%",
  "avg_response_time": "450ms",
  "excel_load_time": "120ms"
}
```

## 🚀 Roadmap

### Phase 1: ✅ Completed
- [x] Basic Excel transaction verification
- [x] Local JSON file support
- [x] API endpoints for testing
- [x] UI integration

### Phase 2: 🔄 In Progress
- [ ] Google Sheets API integration
- [ ] Real-time sync capability
- [ ] Advanced search filters
- [ ] Bulk verification API

### Phase 3: 📋 Planned
- [ ] CSV import interface
- [ ] Multiple bank support
- [ ] ML-based fraud detection
- [ ] Analytics dashboard

---

## 🆘 Troubleshooting

### Common Issues

**Error: "Không có dữ liệu giao dịch"**
- Kiểm tra file `data/transactions.json` exists
- Verify Google Sheets API credentials
- Check network connectivity

**Error: "Không tìm thấy giao dịch"**
- Verify mã giao dịch chính xác
- Check số tiền khớp exactly
- Ensure transaction trong timeframe

**Performance slow**
- Cache data in Redis/Memory
- Optimize search algorithms
- Reduce transaction data size

### Debug Commands

```bash
# Test file reading
node -e "console.log(require('./data/transactions.json'))"

# Test API directly
curl -v "http://localhost:3000/api/payment/verify?action=list-transactions"

# Check logs
grep "Excel verification" .next/server/server.log
``` 