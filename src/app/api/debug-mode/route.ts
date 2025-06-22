import { NextRequest, NextResponse } from 'next/server';

// Store debug state in memory (will reset on server restart)
let debugMode = {
  enabled: false,
  showTranslationKeys: false,
  logTranslations: false
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: debugMode
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update debug settings
    if (typeof body.enabled !== 'undefined') {
      debugMode.enabled = !!body.enabled;
    }
    
    if (typeof body.showTranslationKeys !== 'undefined') {
      debugMode.showTranslationKeys = !!body.showTranslationKeys;
    }
    
    if (typeof body.logTranslations !== 'undefined') {
      debugMode.logTranslations = !!body.logTranslations;
    }
    
    return NextResponse.json({
      success: true,
      data: debugMode
    });
  } catch (error) {
    console.error('Error in debug-mode API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update debug mode'
    }, { status: 500 });
  }
} 