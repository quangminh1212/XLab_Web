import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Lấy code xác thực từ URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    // Xác định origin dựa trên host
    const isLocalhost = request.headers.get('host')?.includes('localhost') || false;
    const origin = isLocalhost ? 'http://localhost:3000' : `https://${request.headers.get('host')}`;
    
    console.log("Google OAuth Callback - Origin:", origin);
    console.log("Host header:", request.headers.get('host'));
    
    if (!code) {
      console.error("Không nhận được code từ Google OAuth");
      return NextResponse.redirect(`${origin}/login?error=no_code`);
    }

    console.log("Đã nhận code callback từ Google:", code.substring(0, 10) + "...");

    // Bước 1: Trao đổi code lấy token - sử dụng giá trị hardcode
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: '909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: `${origin}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokenResult = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("Lỗi khi trao đổi code:", tokenResult);
      return NextResponse.redirect(`${origin}/login?error=token_exchange_failed`);
    }

    const { access_token, id_token } = tokenResult;
    console.log("Đã nhận được access token:", access_token ? "CÓ" : "KHÔNG");
    
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
      return NextResponse.redirect(`${origin}/login?error=user_info_failed`);
    }

    console.log("Đăng nhập thành công với email:", userInfo.email);
    
    // Bước 3: Tạo session cookie cho người dùng
    const redirectResponse = NextResponse.redirect(`${origin}/`);
    
    // Tạo cookie với thông tin cơ bản của người dùng
    const sessionData = {
      user: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        id: userInfo.id
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 ngày
      loggedInAt: new Date().toISOString()
    };
    
    // Mã hóa dữ liệu phiên làm việc
    const encodedSession = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    
    // Đặt cookie
    redirectResponse.cookies.set('user-session', encodedSession, {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30 ngày
      sameSite: 'lax',
      secure: !isLocalhost // Chỉ bật secure trên môi trường production
    });
    
    return redirectResponse;
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý callback:", error);
    // Xác định origin dựa trên host
    const isLocalhost = request.headers.get('host')?.includes('localhost') || false;
    const origin = isLocalhost ? 'http://localhost:3000' : `https://${request.headers.get('host')}`;
    return NextResponse.redirect(`${origin}/login?error=callback_failed&details=${encodeURIComponent(String(error))}`);
  }
} 