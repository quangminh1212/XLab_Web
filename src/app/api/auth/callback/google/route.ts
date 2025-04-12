import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v2/userinfo';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Sử dụng redirect URI cố định giống như đã đăng ký trong Google Console
const REDIRECT_URI = 'https://xlab-web.vercel.app/api/auth/callback/google';

console.log('Google callback handler loaded with REDIRECT_URI:', REDIRECT_URI);

export async function GET(req: NextRequest) {
  console.log('Google OAuth callback received');
  
  // Extract authorization code from the URL parameters
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state'); // Lấy state để xác thực
  
  console.log('Code received:', code ? 'yes' : 'no');
  console.log('State received:', state);
  
  // If there's an error or no code, redirect back to login with error message
  if (error || !code) {
    console.error('Error in OAuth callback:', error || 'No code provided');
    return NextResponse.redirect(new URL(`/login?error=${error || 'no_code'}`, req.url));
  }
  
  try {
    console.log('Exchanging authorization code for tokens');
    // Exchange the authorization code for tokens
    const tokenResponse = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    
    // Log chi tiết kết quả token để debug
    const tokenResponseText = await tokenResponse.text();
    console.log('Token response status:', tokenResponse.status);
    console.log('Token response text:', tokenResponseText);
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenResponseText);
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', req.url));
    }
    
    // Parse token data from response text
    let tokenData;
    try {
      tokenData = JSON.parse(tokenResponseText);
      console.log('Tokens received successfully');
    } catch (e) {
      console.error('Failed to parse token data:', e);
      return NextResponse.redirect(new URL('/login?error=token_parse_failed', req.url));
    }
    
    // Get user information using the access token
    const userInfoResponse = await fetch(GOOGLE_USERINFO_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userInfoResponse.ok) {
      console.error('Failed to get user info, status:', userInfoResponse.status);
      const userInfoError = await userInfoResponse.text();
      console.error('User info error:', userInfoError);
      return NextResponse.redirect(new URL('/login?error=userinfo_failed', req.url));
    }
    
    const userData = await userInfoResponse.json();
    console.log('User data retrieved:', userData.email);
    
    // Set the session in a cookie
    const session = {
      user: {
        name: userData.name,
        email: userData.email,
        image: userData.picture,
        id: userData.id,
      },
      accessToken: tokenData.access_token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    };
    
    console.log('Session created successfully, redirecting to home page');
    // Create response with redirect
    const response = NextResponse.redirect(new URL('/', req.url));
    
    // Set the session cookie on the response
    response.cookies.set({
      name: 'next-auth.session-token',
      value: JSON.stringify(session),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Error in Google callback:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', req.url));
  }
} 