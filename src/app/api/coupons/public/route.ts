import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Tạo đường dẫn đến file lưu dữ liệu
const dataDir = path.join(process.cwd(), 'data');
const couponsFilePath = path.join(dataDir, 'coupons.json');
const usersDir = path.join(dataDir, 'users');

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
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
  applicableProducts?: string[];
  isPublic: boolean;
  userLimit?: number;
}

// Interface cho thông tin người dùng
interface UserData {
  email: string;
  vouchers?: {
    [couponId: string]: number;
  };
}

// Hàm đọc dữ liệu từ file
function loadCoupons(): Coupon[] {
  try {
    if (fs.existsSync(couponsFilePath)) {
      const data = fs.readFileSync(couponsFilePath, 'utf8');
      try {
        console.log("Loading coupons from file");
        const coupons = JSON.parse(data);
        console.log(`Found ${coupons.length} coupons total`);
        return coupons;
      } catch (parseError) {
        console.error('Error parsing JSON from coupons file:', parseError);
        return [];
      }
    }
    console.log("Coupons file does not exist");
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
        console.error('Error parsing JSON from user file:', parseError);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
}

export async function GET() {
  try {
    // Lấy thông tin phiên đăng nhập
    const session = await getServerSession(authOptions);
    
    // Đọc dữ liệu từ file
    const allCoupons = loadCoupons();
    
    // Lọc chỉ lấy mã giảm giá công khai và còn hiệu lực
    const now = new Date();
    const publicCoupons = allCoupons.filter(coupon => {
      const isPublic = coupon.isPublic === true;
      const isActive = coupon.isActive === true;
      const hasStarted = new Date(coupon.startDate) <= now;
      const notEnded = new Date(coupon.endDate) >= now;
      
      const result = isPublic && isActive && hasStarted && notEnded;
      if (!result) {
        console.log(`Filtering out coupon ${coupon.code}: isPublic=${isPublic}, isActive=${isActive}, hasStarted=${hasStarted}, notEnded=${notEnded}`);
      }
      return result;
    });
    
    console.log(`Returning ${publicCoupons.length} public active coupons`);
    
    // Nếu người dùng đã đăng nhập, thêm thông tin về việc sử dụng voucher
    let userData: UserData | null = null;
    if (session?.user?.email) {
      userData = loadUserData(session.user.email);
    }
    
    // Trả về thông tin đầy đủ để hiển thị trên trang public vouchers
    const fullCoupons = publicCoupons.map(coupon => {
      // Chuẩn bị thông tin cơ bản về voucher
      const voucherInfo = {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        minOrder: coupon.minOrder,
        maxDiscount: coupon.maxDiscount,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        userLimit: coupon.userLimit,
        applicableProducts: coupon.applicableProducts
      };
      
      // Thêm thông tin về việc sử dụng nếu người dùng đã đăng nhập
      if (userData && userData.vouchers && coupon.userLimit) {
        const usedCount = userData.vouchers[coupon.id] || 0;
        return {
          ...voucherInfo,
          userUsage: {
            current: usedCount,
            limit: coupon.userLimit
          }
        };
      }
      
      return voucherInfo;
    });
    
    return NextResponse.json(
      {
        success: true,
        coupons: fullCoupons
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching public coupons:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tải danh sách mã giảm giá công khai', details: String(error) },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        }
      }
    );
  }
} 