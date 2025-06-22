import { NextRequest, NextResponse } from 'next/server';
import locales from '@/../../locales';

export async function GET(request: NextRequest) {
  try {
    // Get language from query params, default to English
    const lang = request.nextUrl.searchParams.get('lang') || 'eng';
    
    // Validate language
    if (lang !== 'eng' && lang !== 'vie') {
      return NextResponse.json({
        success: false,
        error: 'Invalid language. Must be "eng" or "vie".'
      }, { status: 400 });
    }
    
    // Return the translations for the requested language
    return NextResponse.json({
      success: true,
      data: locales[lang as 'eng' | 'vie']
    });
  } catch (error) {
    console.error('Error in translations API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch translations'
    }, { status: 500 });
  }
} 