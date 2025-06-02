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
  userLimit?: number;
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

export async function GET() {
  try {
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
    
    // Chỉ trả về thông tin cần thiết để hiển thị trong dropdown
    const simplifiedCoupons = publicCoupons.map(coupon => ({
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      endDate: coupon.endDate,
      minOrder: coupon.minOrder,
      userLimit: coupon.userLimit
    }));
    
    return NextResponse.json(
      {
        success: true,
        coupons: simplifiedCoupons
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