import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
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

// API để đồng bộ voucher đã dùng với dữ liệu người dùng
export async function GET(request: Request) {
  try {
    // Kiểm tra xác thực và quyền admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      console.log("Unauthorized access attempt to /api/user/vouchers/sync - No valid session");
      return NextResponse.json(
        { error: 'Bạn cần đăng nhập để sử dụng tính năng này' },
        { status: 401 }
      );
    }
    
    const userEmail = session.user.email;
    console.log(`Processing voucher sync for user: ${userEmail}`);
    
    // Tải dữ liệu của người dùng
    const userData = loadUserData(userEmail);
    if (!userData) {
      // Nếu không tìm thấy dữ liệu người dùng, tạo dữ liệu mới cơ bản
      const newUserData: UserData = {
        profile: {
          id: session.user.id || "",
          name: session.user.name || "",
          email: userEmail,
          image: session.user.image || "",
          isAdmin: session.user.isAdmin || false,
          isActive: true,
          balance: 0,
          createdAt: new Date().toISOString(),
        },
        vouchers: [],
        metadata: {
          lastUpdated: new Date().toISOString(),
          version: "1.0"
        }
      };
      
      saveUserData(userEmail, newUserData);
      
      return NextResponse.json({
        success: true,
        message: `Đã tạo dữ liệu người dùng mới và chưa có voucher nào được sử dụng`,
        vouchers: []
      });
    }
    
    // Tải danh sách mã giảm giá
    const coupons = loadCoupons();
    
    // Tạo mảng vouchers nếu chưa có
    if (!userData.vouchers) {
      userData.vouchers = [];
    }
    
    // Đồng bộ thông tin voucher đã dùng
    let updatedCount = 0;
    
    for (const coupon of coupons) {
      if (coupon.userUsage && coupon.userUsage[userEmail] && coupon.userUsage[userEmail] > 0) {
        // Kiểm tra xem voucher đã có trong dữ liệu người dùng chưa
        const existingVoucher = userData.vouchers.find(v => v.code === coupon.code);
        
        if (existingVoucher) {
          // Cập nhật thông tin nếu đã tồn tại
          if (existingVoucher.usedCount !== coupon.userUsage[userEmail]) {
            existingVoucher.usedCount = coupon.userUsage[userEmail];
            existingVoucher.lastUsed = new Date().toISOString();
            updatedCount++;
          }
        } else {
          // Thêm mới nếu chưa tồn tại
          userData.vouchers.push({
            code: coupon.code,
            name: coupon.name,
            usedCount: coupon.userUsage[userEmail],
            lastUsed: new Date().toISOString()
          });
          updatedCount++;
        }
      }
    }
    
    // Lưu lại dữ liệu người dùng nếu có sự thay đổi
    if (updatedCount > 0) {
      saveUserData(userEmail, userData);
    }
    
    return NextResponse.json({
      success: true,
      message: `Đã đồng bộ ${updatedCount} voucher với dữ liệu người dùng`,
      vouchers: userData.vouchers
    });
  } catch (error) {
    console.error('Error syncing user vouchers:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi đồng bộ dữ liệu voucher' },
      { status: 500 }
    );
  }
} 