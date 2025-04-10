import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated Không cần API này khi sử dụng dịch vụ Google Translate miễn phí
 * Chúng ta giữ file này để tham khảo khi cần sử dụng API trong tương lai
 */

interface TranslateRequestBody {
  text: string;
  targetLanguage: string;
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Đã chuyển sang sử dụng dịch vụ Google Translate miễn phí',
    info: 'Sử dụng redirect thay vì API key để dịch trang web',
  });
}

// Cho phép sử dụng phương thức OPTIONS để hỗ trợ CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    } 
  });
} 