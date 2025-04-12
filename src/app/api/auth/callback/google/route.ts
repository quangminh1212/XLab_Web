import { NextRequest, NextResponse } from 'next/server';

// Hàm để xử lý callback từ Google OAuth
export async function GET(request: NextRequest) {
  try {
    // Lấy code từ query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      // Nếu không có code, redirect về trang login với lỗi
      return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
    }
    
    // Chuẩn bị để gọi API Google để đổi code lấy token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Lỗi khi lấy token:', tokenData);
      return NextResponse.redirect(new URL('/login?error=token_error', request.url));
    }
    
    // Lấy thông tin user từ Google với access token
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      console.error('Lỗi khi lấy thông tin user:', userData);
      return NextResponse.redirect(new URL('/login?error=user_info_error', request.url));
    }
    
    // Tạo session cho người dùng ở đây (trong thực tế cần tích hợp với hệ thống auth khác)
    // Vì đây là demo, chúng ta sẽ redirect người dùng về trang chủ
    return NextResponse.redirect(new URL('/', request.url));
    
  } catch (error) {
    console.error('Lỗi trong quá trình xử lý OAuth callback:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
} 