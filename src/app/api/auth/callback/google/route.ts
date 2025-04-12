import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Lấy code xác thực từ URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    // Lấy origin để tạo redirect URLs
    const origin = request.headers.get('host')?.includes('localhost') 
      ? 'http://localhost:3000' 
      : `https://${request.headers.get('host')}`;
    
    console.log("=== GOOGLE CALLBACK ===");
    console.log("Host:", request.headers.get('host'));
    console.log("Origin được tính toán:", origin);
    
    if (error) {
      console.error("Lỗi từ Google:", error);
      return NextResponse.redirect(`${origin}/login?error=google_error&details=${error}`, { status: 302 });
    }
    
    if (!code) {
      console.error("Không nhận được code từ Google");
      return NextResponse.redirect(`${origin}/login?error=no_code`, { status: 302 });
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
        client_id: '909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: `${origin}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokenResult = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("Lỗi khi trao đổi code:", tokenResult);
      return NextResponse.redirect(`${origin}/login?error=token_exchange_failed&status=${tokenResponse.status}`, { status: 302 });
    }

    const { access_token, id_token } = tokenResult;
    console.log("Đã nhận được token từ Google:", access_token ? "Có access token" : "Không có access token");
    
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
      return NextResponse.redirect(`${origin}/login?error=user_info_failed&status=${userInfoResponse.status}`, { status: 302 });
    }

    console.log("Đăng nhập thành công với email:", userInfo.email);
    
    // Bước 3: Tạo session cookie cho người dùng
    // Trong môi trường thực tế, bạn sẽ cần một giải pháp lưu trữ phiên làm việc
    // Ở đây, chúng ta tạo một cookie đơn giản
    const redirectResponse = NextResponse.redirect(`${origin}/`, { status: 302 });
    
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
      secure: process.env.NODE_ENV === 'production'
    });
    
    return redirectResponse;
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý callback:", error);
    const origin = request.headers.get('host')?.includes('localhost') 
      ? 'http://localhost:3000' 
      : `https://${request.headers.get('host')}`;
    return NextResponse.redirect(`${origin}/login?error=callback_failed&details=${encodeURIComponent(String(error))}`, { status: 302 });
  }
} 