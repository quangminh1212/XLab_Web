import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/authOptions';
import {
  SystemSettings,
  defaultSystemSettings,
  validateSystemSettings,
} from '@/models/SystemSettingsModel';

const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');

// Hàm đọc cài đặt từ file
function readSettingsFromFile(): SystemSettings {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const fileContent = fs.readFileSync(settingsFilePath, 'utf-8');
      return JSON.parse(fileContent) as SystemSettings;
    }
  } catch (error) {
    console.error('Error reading settings file:', error);
  }
  
  // Nếu không có file hoặc đọc thất bại, trả về giá trị mặc định
  return { ...defaultSystemSettings };
}

// Hàm ghi cài đặt vào file
function saveSettingsToFile(settings: SystemSettings): boolean {
  try {
    const dirPath = path.dirname(settingsFilePath);
    
    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving settings to file:', error);
    return false;
  }
}

// Đọc cài đặt từ file khi khởi động
let systemSettings: SystemSettings = readSettingsFromFile();

export async function GET() {
  try {
    // Kiểm tra xác thực
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra vai trò admin
    const isAdmin = session.user.isAdmin === true;
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Đọc cài đặt mới nhất từ file trước khi trả về
    systemSettings = readSettingsFromFile();
    
    // Trả về cài đặt hệ thống hiện tại
    return NextResponse.json(systemSettings);
  } catch (error) {
    console.error('Error getting system settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Kiểm tra xác thực
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra vai trò admin
    const isAdmin = session.user.isAdmin === true;
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Lấy dữ liệu từ request
    const data = await request.json();

    // Xác thực dữ liệu
    const validation = validateSystemSettings(data);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          details: validation.errors,
        },
        { status: 400 },
      );
    }

    // Cập nhật cài đặt và thêm thông tin người cập nhật
    systemSettings = {
      ...data,
      lastUpdated: new Date().toISOString(),
      updatedBy: session.user.email || 'unknown',
    };

    // Lưu cài đặt vào file
    const saveSuccess = saveSettingsToFile(systemSettings);
    
    if (!saveSuccess) {
      return NextResponse.json({ 
        error: 'Failed to save settings to file'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '',
      settings: systemSettings,
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
