import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';

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

// Hàm đọc dữ liệu từ file
function loadCoupons(): Coupon[] {
  try {
    if (fs.existsSync(couponsFilePath)) {
      const data = fs.readFileSync(couponsFilePath, 'utf8');
      try {
        const coupons = JSON.parse(data);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderTotal } = body;
    
    console.log("Validating coupon:", code, "for orderTotal:", orderTotal);
    
    // Lấy thông tin session của người dùng
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập mã giảm giá' },
        { status: 400 }
      );
    }

    if (orderTotal === undefined || orderTotal === null || isNaN(orderTotal)) {
      return NextResponse.json(
        { success: false, error: 'Tổng giá trị đơn hàng không hợp lệ' },
        { status: 400 }
      );
    }

    // Tải danh sách mã giảm giá từ file
    const allCoupons = loadCoupons();
    console.log("Loaded coupons:", allCoupons.length);

    // Tìm mã giảm giá
    const coupon = allCoupons.find(c => 
      c.code.toUpperCase() === code.toUpperCase() && c.isActive
    );

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    // Kiểm tra thời gian
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    console.log("Coupon dates - Now:", now, "Start:", startDate, "End:", endDate);

    if (now < startDate) {
      return NextResponse.json(
        { success: false, error: 'Mã giảm giá chưa có hiệu lực' },
        { status: 400 }
      );
    }

    if (now > endDate) {
      return NextResponse.json(
        { success: false, error: 'Mã giảm giá đã hết hạn' },
        { status: 400 }
      );
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Đơn hàng phải tối thiểu ${coupon.minOrder.toLocaleString()}đ để sử dụng mã này` 
        },
        { status: 400 }
      );
    }

    // Kiểm tra số lần sử dụng tổng cộng
    if (coupon.usageLimit && coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: 'Mã giảm giá đã hết lượt sử dụng' },
        { status: 400 }
      );
    }
    
    // Kiểm tra số lần sử dụng của người dùng cụ thể
    if (userEmail && coupon.userLimit && coupon.userLimit > 0) {
      const userUsage = (coupon.userUsage || {})[userEmail] || 0;
      
      if (userUsage >= coupon.userLimit) {
        return NextResponse.json(
          { success: false, error: `Mỗi người chỉ được sử dụng mã này tối đa ${coupon.userLimit} lần` },
          { status: 400 }
        );
      }
    }

    // Kiểm tra nếu coupon chỉ dành riêng cho một số người dùng
    if (coupon.forUsers && coupon.forUsers.length > 0) {
      if (!userEmail || !coupon.forUsers.includes(userEmail)) {
        return NextResponse.json(
          { success: false, error: 'Mã giảm giá này không áp dụng cho tài khoản của bạn' },
          { status: 400 }
        );
      }
    }

    // Tính toán giảm giá
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (orderTotal * coupon.value) / 100;
      // Áp dụng giới hạn giảm giá tối đa nếu có
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.value;
    }

    // Đảm bảo giảm giá không vượt quá tổng đơn hàng
    discountAmount = Math.min(discountAmount, orderTotal);

    console.log("Coupon validated successfully. Discount amount:", discountAmount);

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        userLimit: coupon.userLimit,
        discountAmount
      }
    });

  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi khi kiểm tra mã giảm giá' },
      { status: 500 }
    );
  }
} 