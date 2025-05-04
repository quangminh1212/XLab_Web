import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Lấy code từ query params
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  
  console.log('Callback received from Google:', { code });
  
  if (!code) {
    console.error('No code received from Google');
    return NextResponse.redirect(`${url.origin}/login?error=no_code`);
  }

  try {
    // Gọi API để trao đổi code lấy token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: '909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:3000/api/auth/callback/google',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Failed to exchange code for token:', tokenData);
      return NextResponse.redirect(`${url.origin}/login?error=token_exchange`);
    }

    // Lấy thông tin người dùng từ Google API
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      console.error('Failed to get user data:', userData);
      return NextResponse.redirect(`${url.origin}/login?error=user_data`);
    }

    console.log('User data:', userData);

    // Tạo session cookie (đơn giản hóa, trong thực tế cần sử dụng JWT hoặc session store)
    const session = {
      user: userData,
      accessToken: tokenData.access_token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    // Chuyển hướng về trang chủ với session
    const response = NextResponse.redirect(`${url.origin}/`);
    
    // Lưu session vào cookie
    response.cookies.set('user-session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in Google callback:', error);
    return NextResponse.redirect(`${url.origin}/login?error=callback_error`);
  }
} 