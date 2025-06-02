import { NextResponse } from 'next/server';
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
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
  applicableProducts?: string[];
  isPublic: boolean;
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
    // Đọc dữ liệu từ file
    const allCoupons = loadCoupons();
    
    // Lọc chỉ lấy mã giảm giá công khai và còn hiệu lực
    const now = new Date();
    const publicCoupons = allCoupons.filter(coupon => 
      coupon.isPublic &&
      coupon.isActive &&
      new Date(coupon.startDate) <= now &&
      new Date(coupon.endDate) >= now
    );
    
    // Chỉ trả về thông tin cần thiết để hiển thị trong dropdown
    const simplifiedCoupons = publicCoupons.map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      endDate: coupon.endDate
    }));
    
    return NextResponse.json({
      success: true,
      coupons: simplifiedCoupons
    });
  } catch (error) {
    console.error('Error fetching public coupons:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tải danh sách mã giảm giá công khai' },
      { status: 500 }
    );
  }
} 