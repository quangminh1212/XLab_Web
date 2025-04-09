import { NextRequest, NextResponse } from 'next/server';

interface TranslateRequestBody {
  text: string;
  targetLanguage: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequestBody = await request.json();
    const { text, targetLanguage } = body;

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields: text or targetLanguage' },
        { status: 400 }
      );
    }

    // Google Translate API URL
    const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        format: 'html',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Translation API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to translate text' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Translation processing error:', error);
    return NextResponse.json(
      { error: 'An error occurred during translation' },
      { status: 500 }
    );
  }
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