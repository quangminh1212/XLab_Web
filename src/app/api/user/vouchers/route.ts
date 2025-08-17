import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/authOptions';

// Tạo đường dẫn đến file lưu dữ liệu
const dataDir = path.join(process.cwd(), 'data');
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
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
  applicableProducts?: string[];
  isPublic: boolean;
  forUsers?: string[]; // Danh sách email của người dùng được áp dụng
  userLimit?: number;
  userUsage?: Record<string, number>;
}

// Hàm đọc dữ liệu từ file
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

export async function GET() {
  try {
    // Lấy thông tin session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Bạn cần đăng nhập để xem voucher cá nhân' },
        { status: 401 },
      );
    }

    const userEmail = session.user.email;

    // Đọc dữ liệu từ file
    const allCoupons = loadCoupons();

    // Lọc các voucher công khai và voucher dành riêng cho người dùng
    const now = new Date();

    const userVouchers = allCoupons.filter((coupon) => {
      // Kiểm tra nếu voucher còn hiệu lực
      const isActive =
        coupon.isActive && new Date(coupon.startDate) <= now && new Date(coupon.endDate) >= now;

      if (!isActive) return false;

      // Lấy voucher công khai hoặc voucher có forUsers chứa email của user
      return coupon.isPublic || (coupon.forUsers && coupon.forUsers.includes(userEmail));
    });

    // Chỉ trả về thông tin cần thiết
    const simplifiedVouchers = userVouchers.map((coupon) => ({
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      endDate: coupon.endDate,
      isPublic: coupon.isPublic,
      minOrder: coupon.minOrder,
      userLimit: coupon.userLimit,
      userUsage: userEmail
        ? {
            current: (coupon.userUsage && coupon.userUsage[userEmail]) || 0,
            limit: coupon.userLimit || 0,
          }
        : undefined,
    }));

    return NextResponse.json({
      success: true,
      vouchers: simplifiedVouchers,
    });
  } catch (error) {
    console.error('Error fetching user vouchers:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi tải danh sách voucher' }, { status: 500 });
  }
}
