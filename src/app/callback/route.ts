import { NextRequest, NextResponse } from 'next/server';

// Tạo route xử lý chuyển hướng
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(`https://xlab-web.vercel.app/login?error=no_code_callback`);
    }

    // Chuyển hướng đến endpoint callback chính thức
    const callbackUrl = new URL('/api/auth/callback/google', request.nextUrl.origin);
    searchParams.forEach((value, key) => {
      callbackUrl.searchParams.append(key, value);
    });

    console.log("Chuyển tiếp từ /callback đến:", callbackUrl.toString());
    
    return NextResponse.redirect(callbackUrl, { status: 307 });
  } catch (error) {
    console.error("Lỗi trong quá trình xử lý callback bridge:", error);
    return NextResponse.redirect(`https://xlab-web.vercel.app/login?error=callback_bridge_failed&details=${encodeURIComponent(String(error))}`);
  }
} 