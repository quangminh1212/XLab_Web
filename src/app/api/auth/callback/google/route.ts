import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v1/userinfo';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Lấy REDIRECT_URI động dựa trên môi trường
const getRedirectUri = (req: NextRequest) => {
  // Nếu có biến môi trường, ưu tiên sử dụng
  if (process.env.NEXTAUTH_URL) {
    return `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;
  }
  
  // Nếu không, lấy từ request
  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
  
  return `${protocol}://${host}/api/auth/callback/google`;
};

console.log("Google callback handler loaded with REDIRECT_URI:", getRedirectUri);

export async function GET(req: NextRequest) {
  console.log('Google OAuth callback received');
  
  // Lấy REDIRECT_URI động
  const REDIRECT_URI = getRedirectUri(req);
  console.log('Sử dụng REDIRECT_URI:', REDIRECT_URI);
  
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
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', req.url));
    }
    
    const tokenData = await tokenResponse.json();
    console.log('Tokens received successfully');
    
    // Get user information using the access token
    const userInfoResponse = await fetch(GOOGLE_USERINFO_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userInfoResponse.ok) {
      console.error('Failed to get user info');
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
    
    console.log('Session cookie set, redirecting to home page');
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