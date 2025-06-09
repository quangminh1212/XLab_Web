import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'data', 'translations');

// Đảm bảo thư mục cache tồn tại
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Lấy đường dẫn đến file cache cho ngôn ngữ
const getCacheFilePath = (lang: string) => {
  return path.join(CACHE_DIR, `${lang}.json`);
};

// Đọc cache từ đĩa
const readCache = (lang: string) => {
  const filePath = getCacheFilePath(lang);
  
  if (!fs.existsSync(filePath)) {
    return {};
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading cache for ${lang}:`, error);
    return {};
  }
};

// Ghi cache vào đĩa
const writeCache = (lang: string, data: Record<string, string>) => {
  const filePath = getCacheFilePath(lang);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing cache for ${lang}:`, error);
    return false;
  }
};

// API handler để lấy toàn bộ cache cho một ngôn ngữ
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang');
  
  if (!lang) {
    return NextResponse.json(
      { error: 'Language parameter is required' },
      { status: 400 }
    );
  }
  
  const cache = readCache(lang);
  return NextResponse.json({ cache });
}

// API handler để lưu một mục mới vào cache
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lang, text, translation } = body;
    
    if (!lang || !text || !translation) {
      return NextResponse.json(
        { error: 'Lang, text, and translation are required' },
        { status: 400 }
      );
    }
    
    // Đọc cache hiện tại
    const cache = readCache(lang);
    
    // Thêm bản dịch mới
    cache[text] = translation;
    
    // Lưu lại cache
    const success = writeCache(lang, cache);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to write cache' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/translate/cache:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 