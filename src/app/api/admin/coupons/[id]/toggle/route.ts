import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
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
  type: 'percentage' | 'fixed' | 'cashback';
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
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading coupons:', error);
    return [];
  }
}

// Hàm lưu dữ liệu vào file
function saveCoupons(data: Coupon[]): boolean {
  try {
    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(couponsFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving coupons:', error);
    return false;
  }
}

// PATCH - Bật/tắt trạng thái mã giảm giá
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    const awaitedParams = await params;
    const id = awaitedParams.id;

    // Đọc dữ liệu từ file
    const coupons = loadCoupons();
    const couponIndex = coupons.findIndex((c) => c.id === id);

    if (couponIndex === -1) {
      return NextResponse.json({ error: 'Không tìm thấy mã giảm giá' }, { status: 404 });
    }

    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    // Cập nhật trạng thái
    coupons[couponIndex].isActive = isActive;
    coupons[couponIndex].updatedAt = new Date().toISOString();

    // Lưu thay đổi vào file
    saveCoupons(coupons);

    return NextResponse.json({
      success: true,
      message: `Mã giảm giá đã được ${isActive ? 'kích hoạt' : 'vô hiệu hóa'} thành công`,
      coupon: coupons[couponIndex],
    });
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi cập nhật trạng thái mã giảm giá' },
      { status: 500 },
    );
  }
}
