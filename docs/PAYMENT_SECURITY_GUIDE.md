# Hướng dẫn Nâng cấp Xác thực Thanh toán

## 🔍 Đánh giá Hệ thống Hiện tại

### ❌ Hiện tại: XÁC THỰC GIẢ

Hệ thống hiện tại sử dụng **mock authentication** với các đặc điểm:

- **Không có API thật**: Chỉ sử dụng `setTimeout` để giả lập
- **Transaction ID giả**: Được tạo từ timestamp + số ngẫu nhiên
- **Không xác thực thật**: Chấp nhận bất kỳ mã nào >= 6 ký tự
- **Không kết nối ngân hàng**: Không có API call thật

### ✅ Mục tiêu: XÁC THỰC THẬT

## 🚀 Các Bước Nâng cấp

### 1. **Tích hợp API Ngân hàng Thật**

#### **VietQR API** (Khuyến nghị)

```bash
# Đăng ký tại: https://vietqr.io
# API Documentation: https://docs.vietqr.io
```

**Cấu hình cần thiết:**

```env
VIETQR_API_URL=https://api.vietqr.io/v2/verify
VIETQR_API_KEY=your_api_key_here
VIETQR_CLIENT_ID=your_client_id_here
```

#### **MBBank Partnership API**

```bash
# Cần partnership agreement với MBBank
# Contact: developer@mbbank.com.vn
```

#### **Các ngân hàng khác**

- **VCB**: API Corporate Banking
- **TCB**: TechcomBank Open API
- **ACB**: ACB Digital API
- **Vietinbank**: VietinBank API

### 2. **SMS/OTP Service Integration**

#### **Khuyến nghị các nhà cung cấp:**

1. **Twilio** (Quốc tế)

   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

2. **AWS SNS** (Đáng tin cậy)

   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=ap-southeast-1
   ```

3. **CMC Telecom** (Việt Nam)

   ```env
   CMC_SMS_URL=http://api.cmctelecom.vn
   CMC_USERNAME=your_username
   CMC_PASSWORD=your_password
   ```

4. **Viettel SMS** (Việt Nam)
   ```env
   VIETTEL_SMS_URL=http://smsapi.viettel.vn
   VIETTEL_API_KEY=your_api_key
   ```

### 3. **Webhook Configuration**

#### **Cấu hình Webhook URL:**

```
https://yourdomain.com/api/payment/webhook
```

#### **Security Headers:**

- `X-Webhook-Signature`: HMAC-SHA256 signature
- `X-Timestamp`: Unix timestamp
- `X-Source`: Bank identifier

### 4. **Database Schema cho Payment Records**

```sql
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  bank_code VARCHAR(10),
  account_number VARCHAR(50),
  verification_method VARCHAR(20), -- 'sms_otp', 'bank_app', 'webhook'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'failed'
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);
```

### 5. **Security Implementation**

#### **Rate Limiting**

- Max 5 lần thử / 5 phút / IP
- Max 10 lần thử / giờ / user
- Lockout tài khoản sau 20 lần thử sai

#### **Input Validation**

```typescript
// Validation patterns đã được implement trong bankAPI.ts
SMS_OTP: /^[0-9]{6,8}$/;
BANK_TXN_ID: /^[A-Z0-9]{6,20}$/i;
BANK_REF: /^(FT|MB|VCB|TCB|ACB)[0-9]{10,15}$/i;
QR_CODE: /^QR[0-9]{12,16}$/i;
```

#### **Encryption & Security**

- Mã hóa API keys với AES-256
- Sử dụng HTTPS cho tất cả requests
- Validate webhook signatures
- Log tất cả giao dịch để audit

### 6. **Testing Strategy**

#### **Development Environment**

```env
NODE_ENV=development
# Sử dụng sandbox/test APIs
VIETQR_API_URL=https://sandbox.vietqr.io/v2/verify
```

#### **Test Cases**

1. **Valid OTP**: 123456
2. **Invalid OTP**: 000000
3. **Expired OTP**: Test timeout
4. **Rate Limiting**: Test 6+ attempts
5. **Invalid Format**: abc123, 12345

#### **Load Testing**

- Concurrent users: 100+
- Response time: < 3 seconds
- Success rate: > 99%

### 7. **Monitoring & Alerts**

#### **Metrics to Track**

- Verification success rate
- Average response time
- Failed attempts by IP/user
- API errors from banking partners

#### **Alert Conditions**

- Success rate < 95%
- Response time > 5 seconds
- Error rate > 1%
- Suspicious verification patterns

### 8. **Legal & Compliance**

#### **Required Agreements**

- **Banking Partnership**: Official agreement with banks
- **SMS Provider**: Service level agreement
- **PCI Compliance**: If handling card data
- **GDPR/PDPA**: Data protection compliance

#### **Documentation**

- Terms of Service updates
- Privacy Policy updates
- User consent for SMS
- Data retention policies

## 🔧 Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Set up development environment
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Create database schema

### Phase 2: Banking Integration (Week 2-3)

- [ ] Register with VietQR/Banking APIs
- [ ] Implement verification endpoints
- [ ] Add webhook handlers
- [ ] Test with sandbox APIs

### Phase 3: SMS Integration (Week 4)

- [ ] Choose SMS provider
- [ ] Implement OTP generation
- [ ] Add OTP verification
- [ ] Test SMS delivery

### Phase 4: Security & Testing (Week 5)

- [ ] Security audit
- [ ] Load testing
- [ ] Error handling
- [ ] Monitoring setup

### Phase 5: Production (Week 6)

- [ ] Production environment setup
- [ ] Go-live checklist
- [ ] User training
- [ ] Documentation

## 💰 Cost Estimation

### API Costs (Monthly)

- **VietQR API**: ~$50-200/month
- **SMS Provider**: ~$0.05-0.10/SMS
- **Banking APIs**: ~$100-500/month
- **Monitoring Tools**: ~$50-100/month

### Development Time

- **Implementation**: 4-6 weeks
- **Testing**: 2-3 weeks
- **Documentation**: 1 week
- **Total**: 7-10 weeks

## 🎯 Expected Benefits

1. **Tăng độ tin cậy**: Xác thực thật từ ngân hàng
2. **Giảm gian lận**: Khó forge hơn nhiều
3. **Tự động hóa**: Không cần check manual
4. **User experience**: Tự động confirm thanh toán
5. **Compliance**: Đáp ứng yêu cầu pháp lý

## 📞 Support & Resources

- **VietQR**: support@vietqr.io
- **Banking APIs**: Contact respective banks
- **SMS Providers**: Check provider documentation
- **Technical Issues**: Create GitHub issues

---

_Tài liệu này sẽ được cập nhật khi có thêm thông tin mới về các API và nhà cung cấp._
