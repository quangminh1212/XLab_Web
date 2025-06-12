import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import {
  SystemSettings,
  defaultSystemSettings,
  validateSystemSettings,
} from '@/models/SystemSettingsModel';

// Đây là một mock database đơn giản. Trong ứng dụng thực tế, bạn sẽ lưu vào cơ sở dữ liệu
let systemSettings: SystemSettings = { ...defaultSystemSettings };

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
