import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Lấy code xác thực từ URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    console.log("Google OAuth Callback được gọi");
    console.log("Code exists:", !!code);
    
    if (!code) {
      console.error("Không nhận được code từ Google OAuth");
      return NextResponse.redirect(`${new URL(request.url).origin}/login?error=no_code`);
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
        redirect_uri: 'https://xlab-web-git-main-viet-thanhs-projects.vercel.app/api/auth/callback/google',
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokenResult = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("Lỗi khi trao đổi code:", tokenResult);
      return NextResponse.redirect(`${new URL(request.url).origin}/login?error=token_exchange_failed`);
    }

    const { access_token, id_token } = tokenResult;
    console.log("Đã nhận được access token:", access_token ? "CÓ" : "KHÔNG");
    
    // Bước 2: Lấy thông tin người dùng từ Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const userInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error("Lỗi khi lấy thông tin người dùng:", userInfo);
      return NextResponse.redirect(`${new URL(request.url).origin}/login?error=user_info_failed`);
    }

    console.log("Đăng nhập thành công với email:", userInfo.email);
    
    // Bước 3: Tạo session cookie
    const session = {
      user: {
        name: userInfo.name,
        email: userInfo.email,
        image: userInfo.picture,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Mã hóa session thành JSON string, sau đó encode base64
    const encodedSession = Buffer.from(JSON.stringify(session)).toString('base64');
    
    // Tạo cookie và chuyển hướng người dùng về trang chủ
    const response = NextResponse.redirect(`${new URL(request.url).origin}/`);
    response.cookies.set({
      name: 'xlab_session',
      value: encodedSession,
      httpOnly: true,
      path: '/',
      secure: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: 'lax',
    });
    
    return response;
  } catch (error) {
    console.error("Lỗi xử lý callback:", error);
    return NextResponse.redirect(`${new URL(request.url).origin}/login?error=callback_failed&details=${encodeURIComponent(String(error))}`);
  }
} 