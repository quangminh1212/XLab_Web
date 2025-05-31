# Hướng dẫn sửa lỗi Google OAuth

## Vấn đề hiện tại
- Lỗi `error=google` khi đăng nhập
- Lỗi `OAuthCallback` trong callback
- NextAuth không redirect đến Google OAuth

## Nguyên nhân có thể
1. **Redirect URI chưa được cấu hình trong Google Cloud Console**
2. **Google OAuth credentials không hợp lệ**
3. **Environment variables không được load đúng**

## Các bước sửa lỗi

### 1. Kiểm tra Google Cloud Console
Truy cập [Google Cloud Console](https://console.cloud.google.com/):

1. Vào **APIs & Services** > **Credentials**
2. Tìm OAuth 2.0 Client ID: `909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com`
3. Kiểm tra **Authorized redirect URIs** phải có:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://127.0.0.1:3000/api/auth/callback/google`

### 2. Kiểm tra Authorized JavaScript origins
Phải có:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

### 3. Kiểm tra OAuth consent screen
- **User Type**: Internal hoặc External
- **App name**: XLab Web
- **Authorized domains**: localhost (nếu cần)

### 4. Kiểm tra file .env.local
```bash
NEXTAUTH_SECRET=Cmjb/lPYHoCnsiaEh0KwFkGG7POh6v3S3DXm169y8+U=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
ADMIN_EMAILS=xlab.rnd@gmail.com
NODE_ENV=development
```

### 5. Restart server
```bash
npm run dev
```

## Test sau khi sửa
1. Truy cập `http://localhost:3000/debug-auth`
2. Click "Sign in with Google"
3. Kiểm tra có redirect đến Google OAuth không

## Lỗi thường gặp

### redirect_uri_mismatch
- Thêm redirect URI vào Google Cloud Console
- Đảm bảo URL khớp chính xác

### invalid_client
- Kiểm tra GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET
- Đảm bảo credentials đúng

### Configuration error
- Kiểm tra OAuth consent screen đã được cấu hình
- Đảm bảo app đã được publish (nếu External) 