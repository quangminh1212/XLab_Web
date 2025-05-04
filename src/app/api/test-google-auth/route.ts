import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Đảm bảo sử dụng chính xác URL callback đã được cấu hình trong Google OAuth console
  const callbackUrl = 'http://localhost:3000/api/auth/callback/google';
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  googleAuthUrl.searchParams.append('client_id', '909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com');
  googleAuthUrl.searchParams.append('redirect_uri', callbackUrl);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'openid email profile');
  googleAuthUrl.searchParams.append('prompt', 'select_account');
  googleAuthUrl.searchParams.append('state', Date.now().toString()); // Thêm state để bảo mật
  
  // Hiển thị đường dẫn để debug
  console.log('Google Auth URL:', googleAuthUrl.toString());
  
  // Chuyển hướng đến trang đăng nhập Google
  return NextResponse.redirect(googleAuthUrl.toString());
} 