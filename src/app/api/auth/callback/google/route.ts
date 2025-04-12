import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Lấy code xác thực từ URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(`${request.nextUrl.origin}/login?error=no_code`);
    }

    console.log("Đã nhận code callback từ Google:", code.substring(0, 10) + "...");

    // Bước 1: Trao đổi code lấy token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${request.nextUrl.origin}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokenResult = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("Lỗi khi trao đổi code:", tokenResult);
      return NextResponse.redirect(`${request.nextUrl.origin}/login?error=token_exchange_failed`);
    }

    const { access_token, id_token } = tokenResult;
    
    // Bước 2: Lấy thông tin người dùng từ Google
    const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const userInfoResponse = await fetch(userInfoEndpoint, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const userInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error("Lỗi khi lấy thông tin người dùng:", userInfo);
      return NextResponse.redirect(`${request.nextUrl.origin}/login?error=user_info_failed`);
    }

    console.log("Đăng nhập thành công với email:", userInfo.email);
    
    // Bước 3: Tạo session cookie cho người dùng
    // Trong môi trường thực tế, bạn sẽ cần một giải pháp lưu trữ phiên làm việc
    // Ở đây, chúng ta tạo một cookie đơn giản
    const redirectResponse = NextResponse.redirect(`${request.nextUrl.origin}/`);
    
    // Tạo cookie với thông tin cơ bản của người dùng
    const sessionData = {
      user: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 ngày
    };
    
    // Mã hóa dữ liệu phiên làm việc (trong thực tế, bạn nên sử dụng một giải pháp bảo mật hơn)
    const encodedSession = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    
    // Đặt cookie
    redirectResponse.cookies.set('user-session', encodedSession, {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30 ngày
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return redirectResponse;
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý callback:", error);
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=callback_failed`);
  }
} 