# Hệ thống Đồng bộ Dữ liệu User

## Tổng quan

Hệ thống đã được nâng cấp để đảm bảo dữ liệu user luôn đồng bộ giữa các nguồn lưu trữ khác nhau:

### Cấu trúc Lưu trữ

1. **File riêng lẻ** (`data/users/{email}.json`) - Nguồn chính
2. **users.json** - Tương thích ngược
3. **balances.json** - Đồng bộ số dư

### Tính năng Chính

- ✅ **Đồng bộ tự động** khi user login/logout
- ✅ **Sync toàn diện** khi cập nhật dữ liệu
- ✅ **Backup và khôi phục** dữ liệu
- ✅ **Validation** tính toàn vẹn dữ liệu
- ✅ **API endpoint** kiểm tra và force sync

## API Endpoints

### GET /api/user/sync

Kiểm tra trạng thái đồng bộ dữ liệu user hiện tại

**Response:**

```json
{
  "email": "user@example.com",
  "syncStatus": {
    "hasUserFile": true,
    "lastUpdated": "2025-06-01T14:34:35.715Z",
    "version": "1.0",
    "cartItems": 2,
    "balance": 2000,
    "transactionCount": 0
  },
  "recommendations": []
}
```

### POST /api/user/sync

Force sync toàn bộ dữ liệu user

**Response:**

```json
{
  "success": true,
  "message": "Dữ liệu đã được đồng bộ thành công",
  "user": {...},
  "syncTime": "2025-06-01T14:34:35.715Z",
  "dataIntegrity": {
    "hasUserFile": true,
    "cartItems": 2,
    "transactionCount": 0,
    "lastUpdated": "2025-06-01T14:34:35.715Z"
  }
}
```

## Functions Chính

### `syncAllUserData(email: string, updateData?: Partial<User>)`

Function chính để đồng bộ toàn diện dữ liệu user:

1. Đọc từ file riêng (nguồn chính)
2. Apply updates nếu có
3. Sync với users.json
4. Sync với balances.json
5. Update metadata

### `updateUserCartSync(email: string, cart: CartItem[])`

Cập nhật giỏ hàng với đồng bộ tự động:

1. Update cart trong user file
2. Update metadata timestamps
3. Trigger comprehensive sync

### `getUserDataFromFile(email: string)`

Đọc dữ liệu user từ file riêng lẻ (đã export public)

## Components

### `UserSyncStatus`

Component React hiển thị trạng thái đồng bộ:

- Hiển thị thông tin sync status
- Button kiểm tra lại
- Button force sync
- Recommendations nếu cần

**Usage:**

```tsx
import UserSyncStatus from '@/components/common/UserSyncStatus';

<UserSyncStatus />;
```

## Luồng Đồng bộ

### 1. User Login

```
SessionTracker.trackUserSession()
  ↓
Tạo/cập nhật user data
  ↓
syncAllUserData() với thông tin session
  ↓
Đồng bộ tất cả systems
```

### 2. Cart Update

```
updateUserCartSync()
  ↓
Update cart trong file riêng
  ↓
Update metadata
  ↓
syncAllUserData() comprehensive
```

### 3. Balance Update

```
updateUserBalance()
  ↓
Update trong file riêng
  ↓
Sync với users.json và balances.json
  ↓
Create transaction record
```

## Best Practices

### 1. Sử dụng Functions Sync Mới

```typescript
// ✅ Tốt - sử dụng sync function
await updateUserCartSync(email, cart);

// ⚠️ Cũ - sẽ có warning
await updateUserCart(email, cart);
```

### 2. Luôn Kiểm tra Sync Status

```typescript
const userData = await getUserDataFromFile(email);
if (!userData) {
  // Trigger sync hoặc tạo mới
  await syncAllUserData(email);
}
```

### 3. Handle Errors

```typescript
try {
  await syncAllUserData(email, updateData);
} catch (error) {
  console.error('Sync failed:', error);
  // Fallback mechanism
}
```

## Monitoring

### Logs

- ✅ `Starting comprehensive sync for user: {email}`
- ✅ `Comprehensive sync completed for user: {email}`
- ⚠️ `Using legacy updateUserCart - consider using updateUserCartSync`
- ❌ `Error in comprehensive sync for {email}`

### Health Check

```typescript
// Check sync status for user
const response = await fetch('/api/user/sync');
const status = await response.json();

if (!status.syncStatus.hasUserFile) {
  // Need initialization
}
```

## Troubleshooting

### 1. User File Missing

**Symptom:** `hasUserFile: false`
**Solution:** Call `POST /api/user/sync` để tạo file

### 2. Data Inconsistency

**Symptom:** Balance khác nhau giữa sources
**Solution:** `syncAllUserData()` sẽ chọn giá trị cao nhất

### 3. Metadata Outdated

**Symptom:** `lastUpdated` cũ
**Solution:** Force sync sẽ update metadata

## Security

- File user được encrypt với AES-256-GCM
- Backup tự động trước mỗi update
- Validation checksum cho data integrity
- Access control qua session authentication

## Performance

- Cache cleanup mỗi 30 phút
- Session tracking throttling (5 phút)
- Batch operations cho multiple users
- Lazy loading user data

## Migration

Hệ thống tự động migrate từ format cũ:

1. Đọc từ users.json/balances.json
2. Tạo file riêng cho mỗi user
3. Maintain compatibility với old system
4. Gradual migration khi user login

---

## Example Usage

```typescript
// Force sync user data
const user = await syncAllUserData('user@example.com', {
  name: 'Updated Name',
  balance: 5000,
});

// Update cart với auto sync
await updateUserCartSync('user@example.com', [
  {
    id: 'product1',
    name: 'Product 1',
    price: 100000,
    quantity: 2,
    uniqueKey: 'product1_default_123',
  },
]);

// Check sync status
const userData = await getUserDataFromFile('user@example.com');
console.log('Last updated:', userData?.metadata.lastUpdated);
```
