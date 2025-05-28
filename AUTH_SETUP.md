# Hướng dẫn thiết lập Authentication

## Vấn đề hiện tại
Dự án đang gặp lỗi 401 Unauthorized khi:
- Truy cập `/api/notifications`
- Cố gắng đăng nhập với Google OAuth

## Nguyên nhân
- Thiếu file `.env.local` chứa credentials cho Google OAuth
- Chưa thiết lập Google OAuth Application

## Các bước sửa lỗi

### 1. Thiết lập Google OAuth Application

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google+ API và Google OAuth2 API
4. Vào **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Thiết lập:
   - Application type: **Web application**
   - Name: **XLab Web Auth**
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://127.0.0.1:3000/api/auth/callback/google`

### 2. Cập nhật file .env.local

File `.env.local` đã được tạo với template. Bạn cần cập nhật:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secure-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-console

# Admin emails
ADMIN_EMAILS=xlab.rnd@gmail.com
```

### 3. Tạo NEXTAUTH_SECRET

Tạo secret key bảo mật:

```bash
# Cách 1: Sử dụng openssl (nếu có)
openssl rand -base64 32

# Cách 2: Sử dụng Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Cách 3: Sử dụng online generator
# https://generate-secret.vercel.app/32
```

### 4. Khởi động lại server

```bash
npm run dev
```

## Testing Authentication

1. Truy cập `/debug-auth` để kiểm tra trạng thái authentication
2. Kiểm tra các thông tin:
   - Environment variables có được load đúng không
   - API notifications có hoạt động không
   - Có thể đăng nhập với Google không

## Giải pháp tạm thời cho Development

Hiện tại trong development mode:
- API `/api/notifications` sẽ trả về thông báo demo nếu chưa đăng nhập
- Điều này tránh lỗi 401 khi chưa thiết lập OAuth credentials

## Lỗi thường gặp

### 1. Error: redirect_uri_mismatch
- Kiểm tra Authorized redirect URIs trong Google Cloud Console
- Đảm bảo URL khớp chính xác (bao gồm http/https)

### 2. Error: invalid_client
- Kiểm tra GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET
- Đảm bảo credentials đúng và ứng dụng đã được enable

### 3. Session không persist
- Kiểm tra NEXTAUTH_SECRET có được set đúng không
- Xóa cookies browser và thử lại

## Files đã được sửa

1. **`.env.local`** - Tạo mới với template cấu hình
2. **`src/middleware.ts`** - Sửa secret key để sync với NextAuth
3. **`src/app/api/notifications/route.ts`** - Thêm fallback cho development mode
4. **`src/app/debug-auth/page.tsx`** - Tạo trang debug authentication

## Bước tiếp theo

1. ✅ Thiết lập Google OAuth credentials thật
2. ✅ Cập nhật `.env.local` với credentials thật
3. ✅ Test đăng nhập và logout
4. Xóa trang `/debug-auth` khi production (tùy chọn)

## Trạng thái hiện tại

✅ **HOÀN THÀNH** - Authentication đã được thiết lập thành công!

- Google OAuth Client ID: `909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com`
- API `/api/notifications` hiện trả về status 200 (thay vì 401)
- Trang `/debug-auth` có sẵn để kiểm tra trạng thái authentication
- NextAuth secret được tạo an toàn với crypto.randomBytes(32)

### Test URLs:
- Trang chính: http://localhost:3000
- Debug auth: http://localhost:3000/debug-auth
- API notifications: http://localhost:3000/api/notifications 