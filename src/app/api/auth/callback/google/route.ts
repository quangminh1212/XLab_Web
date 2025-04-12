import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log("Google OAuth Callback đã được gọi");
    const searchParams = request.nextUrl.searchParams;
    console.log("Params nhận được:", Object.fromEntries(searchParams.entries()));
    
    // Kiểm tra xem có lỗi từ Google không
    const errorParam = searchParams.get('error');
    if (errorParam) {
      console.error("Lỗi từ Google OAuth:", errorParam);
      const errorDescription = searchParams.get('error_description') || 'Unknown error';
      console.error("Chi tiết lỗi:", errorDescription);
      return NextResponse.redirect(new URL(`/login?error=google&message=${encodeURIComponent(errorDescription)}`, request.url));
    }
    
    // Lấy authentication code từ URL
    const code = searchParams.get('code');
    if (!code) {
      console.error("Không có code trong URL callback");
      return NextResponse.redirect(new URL('/login?error=google&message=No+authentication+code+provided', request.url));
    }
    
    console.log("Đã nhận được authentication code từ Google");
    
    // Thiết lập thông tin OAuth2
    const CLIENT_ID = "909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com";
    const CLIENT_SECRET = "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";
    const REDIRECT_URI = "https://xlab-web-git-main-viet-thanhs-projects.vercel.app/api/auth/callback/google";
    
    // Lấy access token từ Google
    console.log("Đang trao đổi code lấy access token...");
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Lỗi khi trao đổi token:", errorData);
      return NextResponse.redirect(new URL(`/login?error=google&message=${encodeURIComponent('Failed to exchange token: ' + errorData)}`, request.url));
    }
    
    const tokenData = await tokenResponse.json();
    console.log("Nhận được token thành công:", JSON.stringify({
      access_token: tokenData.access_token ? "✓ Received" : "✗ Missing",
      id_token: tokenData.id_token ? "✓ Received" : "✗ Missing",
      refresh_token: tokenData.refresh_token ? "✓ Received" : "✗ Missing",
      expires_in: tokenData.expires_in
    }));
    
    // Lấy thông tin người dùng từ Google
    console.log("Đang lấy thông tin người dùng...");
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userInfoResponse.ok) {
      const errorData = await userInfoResponse.text();
      console.error("Lỗi khi lấy thông tin người dùng:", errorData);
      return NextResponse.redirect(new URL(`/login?error=google&message=${encodeURIComponent('Failed to get user info: ' + errorData)}`, request.url));
    }
    
    const userData = await userInfoResponse.json();
    console.log("Thông tin người dùng Google:", JSON.stringify({
      email: userData.email,
      name: userData.name,
      id: userData.id,
      verified_email: userData.verified_email,
      picture: userData.picture ? "✓ Available" : "✗ Missing"
    }));
    
    // Tạo phiên đăng nhập (tại đây bạn nên tạo hoặc đăng nhập người dùng trong cơ sở dữ liệu)
    // Tạo cookie phiên với thông tin người dùng
    const sessionData = {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      },
      token: tokenData.access_token,
      provider: 'google',
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 ngày
    };
    
    console.log("Tạo phiên người dùng thành công");
    
    // Đặt cookie phiên bằng cách tạo response mới
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Đặt cookie vào response
    response.cookies.set({
      name: 'session',
      value: Buffer.from(JSON.stringify(sessionData)).toString('base64'),
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30 ngày tính bằng giây
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    console.log("Đã đặt cookie phiên, chuyển hướng đến trang chủ");
    
    // Trả về response với cookie đã đặt
    return response;
  } catch (error) {
    console.error("Lỗi không mong đợi trong quá trình xử lý callback Google:", error);
    return NextResponse.redirect(new URL(`/login?error=google&message=${encodeURIComponent('Unexpected error during authentication')}`, request.url));
  }
} 