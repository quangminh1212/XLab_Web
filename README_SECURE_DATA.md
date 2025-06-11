# 🔒 Hệ thống lưu trữ dữ liệu người dùng bảo mật

## Tổng quan

Hệ thống đã được nâng cấp để lưu dữ liệu từng người dùng vào file riêng biệt với mã hóa AES-256-CBC và kiểm tra tính toàn vẹn dữ liệu.

## Cấu hình bảo mật

### 1. Environment Variables

Thêm vào file `.env.local`:

```bash
# Security encryption key for user data - QUAN TRỌNG: Thay đổi trong production
DATA_ENCRYPTION_KEY=your-super-secure-encryption-key-here-change-in-production
```

### 2. Tạo encryption key an toàn

```bash
# Sử dụng OpenSSL
openssl rand -base64 32

# Hoặc sử dụng Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Cấu trúc lưu trữ

```
data/
├── users/                    # Dữ liệu user được mã hóa (KHÔNG commit)
│   ├── user_abc123def456.json
│   └── user_789xyz012345.json
├── backups/                  # Backup tự động (KHÔNG commit)
│   ├── 2025-01-29T10-30-00_user_abc123def456.json
│   └── 2025-01-29T11-15-00_user_789xyz012345.json
├── users.json               # Dữ liệu cũ (fallback)
├── transactions.json        # Dữ liệu cũ (fallback)
└── balances.json           # Dữ liệu cũ (fallback)
```

## Tính năng bảo mật

### 1. Mã hóa dữ liệu

- Sử dụng AES-256-CBC encryption
- Mỗi file có IV (Initialization Vector) riêng
- Checksum SHA-256 để kiểm tra tính toàn vẹn

### 2. Tên file an toàn

- Hash SHA-256 của email thành tên file
- Không thể đoán được email từ tên file

### 3. Backup tự động

- Tự động backup trước khi cập nhật
- Lưu với timestamp để khôi phục

### 4. Kiểm tra tính toàn vẹn

- Checksum validation
- Detect data tampering

## Cấu trúc dữ liệu User

```typescript
interface UserData {
  profile: User; // Thông tin cá nhân
  transactions: Transaction[]; // Lịch sử giao dịch
  sessions: UserSession[]; // Thông tin đăng nhập
  activities: UserActivity[]; // Lịch sử hoạt động
  settings: UserSettings; // Cài đặt cá nhân
  metadata: {
    // Metadata bảo mật
    lastBackup: string;
    dataVersion: string;
    checksum: string;
  };
}
```

## API Endpoints mới

### 1. Admin - Xem dữ liệu user

```
GET /api/admin/user-data?email=user@example.com&action=info
```

### 2. Admin - Kiểm tra tính toàn vẹn

```
GET /api/admin/user-data?email=user@example.com&action=integrity
```

### 3. Admin - Thống kê user

```
GET /api/admin/user-data?email=user@example.com&action=stats
```

## Session Tracking

### Tự động theo dõi:

- ✅ Thông tin đăng nhập (IP, User-Agent)
- ✅ Hoạt động user (login, logout, transactions)
- ✅ Cập nhật balance tự động
- ✅ Lưu transaction vào secure system

### Integration:

- ✅ NextAuth session callback
- ✅ API routes cập nhật
- ✅ Fallback to old system

## Bảo mật Production

### 1. Environment Variables

```bash
DATA_ENCRYPTION_KEY=<strong-random-key>
NEXTAUTH_SECRET=<nextauth-secret>
```

### 2. File Permissions

```bash
chmod 600 data/users/*
chmod 700 data/users/
chmod 700 data/backups/
```

### 3. Gitignore Protection

```gitignore
# Secure user data - NEVER commit these!
/data/users/
/data/backups/
*.user_*.json
```

## Admin Interface

### Truy cập: `/admin`

- 🔍 Tìm kiếm user data
- 📊 Xem thống kê chi tiết
- ✅ Kiểm tra tính toàn vẹn dữ liệu
- 📝 Xem hoạt động gần đây
- 💰 Lịch sử giao dịch
- 🖥️ Sessions đăng nhập

## Migration từ hệ thống cũ

Hệ thống mới tương thích ngược:

1. Tự động tạo user data mới khi đăng nhập
2. Sync balance từ hệ thống cũ
3. Fallback đọc từ file cũ nếu không có data mới

## Backup & Recovery

### Automatic Backup

- Backup trước mỗi lần cập nhật
- Lưu với timestamp
- Mã hóa như dữ liệu gốc

### Manual Restore

```javascript
// Từ admin interface hoặc API
restoreFromBackup(email, timestamp);
```

## Monitoring

### Log Messages

```
✅ User data saved securely for: user@example.com
✅ Session tracked for user: user@example.com
✅ Balance updated for user: user@example.com
⚠️ Data integrity warning for user: user@example.com
❌ Error loading user data for user@example.com
```

## Lưu ý quan trọng

1. **KHÔNG BAO GIỜ commit thư mục /data/users/ và /data/backups/**
2. **Thay đổi DATA_ENCRYPTION_KEY trong production**
3. **Backup định kỳ thư mục data/**
4. **Kiểm tra log errors thường xuyên**
5. **Test tính năng integrity check định kỳ**

## Test hệ thống

1. Đăng nhập với user bất kỳ
2. Vào `/admin` (với admin account)
3. Tìm kiếm email user
4. Kiểm tra tính toàn vẹn dữ liệu
5. Xem activities và transactions

---

**🚨 Cảnh báo bảo mật:** Hệ thống này lưu trữ dữ liệu nhạy cảm. Đảm bảo:

- Backup thường xuyên
- Giám sát access logs
- Cập nhật security patches
- Review quyền truy cập file system
