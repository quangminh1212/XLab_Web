import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/utils/translator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, targetLang } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!targetLang) {
      return NextResponse.json(
        { error: 'Target language is required' },
        { status: 400 }
      );
    }

    // Sử dụng hàm dịch từ utils
    const translatedText = await translateText(text, targetLang);

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation service unavailable' },
      { status: 500 }
    );
  }
} 