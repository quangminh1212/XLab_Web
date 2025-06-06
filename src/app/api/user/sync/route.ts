import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncAllUserData, getUserDataFromFile } from '@/lib/userService';
import fs from 'fs';
import path from 'path';

// Tạo đường dẫn đến file lưu dữ liệu
const dataDir = path.join(process.cwd(), 'data');
const usersDir = path.join(dataDir, 'users');
const couponsFilePath = path.join(dataDir, 'coupons.json');

// Định nghĩa interface cho Coupon
interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  userLimit?: number;
  usedCount: number;
  userUsage?: { [email: string]: number };
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
  applicableProducts?: string[];
  isPublic: boolean;
  forUsers?: string[];
}

// Định nghĩa interface cho dữ liệu người dùng
interface UserData {
  profile: {
    id: string;
    name: string;
    email: string;
    image?: string;
    isAdmin?: boolean;
    isActive?: boolean;
    balance?: number;
    createdAt: string;
    updatedAt?: string;
    lastLogin?: string;
  };
  transactions?: any[];
  cart?: any[];
  orders?: any[];
  settings?: {
    notifications?: boolean;
    language?: string;
    theme?: string;
  };
  vouchers?: {
    code: string;
    name: string;
    usedCount: number;
    lastUsed?: string;
  }[];
  metadata: {
    lastUpdated: string;
    version: string;
  };
}

// Hàm đọc dữ liệu mã giảm giá từ file
function loadCoupons(): Coupon[] {
  try {
    if (fs.existsSync(couponsFilePath)) {
      const data = fs.readFileSync(couponsFilePath, 'utf8');
      try {
        return JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON from coupons file:', parseError);
        return [];
      }
    }
    return [];
  } catch (error) {
    console.error('Error loading coupons:', error);
    return [];
  }
}

// Hàm đọc dữ liệu người dùng từ file
function loadUserData(email: string): UserData | null {
  try {
    const userFilePath = path.join(usersDir, `${email}.json`);
    if (fs.existsSync(userFilePath)) {
      const data = fs.readFileSync(userFilePath, 'utf8');
      try {
        return JSON.parse(data);
      } catch (parseError) {
        console.error(`Error parsing JSON from user file ${email}:`, parseError);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error(`Error loading user data for ${email}:`, error);
    return null;
  }
}

// Hàm lưu dữ liệu người dùng vào file
function saveUserData(email: string, userData: UserData): boolean {
  try {
    if (!fs.existsSync(usersDir)) {
      fs.mkdirSync(usersDir, { recursive: true });
    }

    // Cập nhật thời gian chỉnh sửa
    userData.metadata.lastUpdated = new Date().toISOString();

    const userFilePath = path.join(usersDir, `${email}.json`);
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error saving user data for ${email}:`, error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Force sync toàn bộ dữ liệu user
    const syncedUser = await syncAllUserData(userEmail);

    if (!syncedUser) {
      return NextResponse.json({ error: 'Không thể đồng bộ dữ liệu user' }, { status: 500 });
    }

    // Lấy dữ liệu user đầy đủ sau khi sync
    const userData = await getUserDataFromFile(userEmail);

    return NextResponse.json({
      success: true,
      message: 'Dữ liệu đã được đồng bộ thành công',
      user: syncedUser,
      syncTime: new Date().toISOString(),
      dataIntegrity: {
        hasUserFile: !!userData,
        cartItems: userData?.cart?.length || 0,
        transactionCount: userData?.transactions?.length || 0,
        lastUpdated: userData?.metadata?.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Error syncing user data:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Kiểm tra trạng thái đồng bộ
    const userData = await getUserDataFromFile(userEmail);

    return NextResponse.json({
      email: userEmail,
      syncStatus: {
        hasUserFile: !!userData,
        lastUpdated: userData?.metadata?.lastUpdated,
        version: userData?.metadata?.version,
        cartItems: userData?.cart?.length || 0,
        balance: userData?.profile?.balance || 0,
        transactionCount: userData?.transactions?.length || 0,
      },
      recommendations: userData ? [] : ['Dữ liệu user chưa được khởi tạo, cần sync'],
    });
  } catch (error) {
    console.error('Error checking sync status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
