import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Tạo đường dẫn đến file lưu dữ liệu
const dataDir = path.join(process.cwd(), 'data');
const couponsFilePath = path.join(dataDir, 'coupons.json');

// Kiểm tra và tạo file coupons.json nếu chưa tồn tại
(() => {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(couponsFilePath)) {
      fs.writeFileSync(couponsFilePath, '[]', 'utf8');
      console.log('Created empty coupons.json file');
    } else {
      // Kiểm tra tính hợp lệ của file JSON
      try {
        const data = fs.readFileSync(couponsFilePath, 'utf8');
        JSON.parse(data);
      } catch (error) {
        console.error('Corrupted coupons.json file detected, creating backup and resetting');
        // Backup file hỏng
        const backupDir = path.join(dataDir, 'backups');
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const backupPath = path.join(backupDir, `coupons-corrupt-${timestamp}.bak`);
        fs.copyFileSync(couponsFilePath, backupPath);

        // Tạo file mới
        fs.writeFileSync(couponsFilePath, '[]', 'utf8');
      }
    }
  } catch (error) {
    console.error('Error initializing coupons.json:', error);
  }
})();

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
      try {
        return JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON from coupons file:', parseError);
        // Backup the corrupted file
        const backupDir = path.join(dataDir, 'backups');
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const backupPath = path.join(backupDir, `coupons-corrupt-${timestamp}.bak`);
        fs.writeFileSync(backupPath, data);
        console.log(`Corrupted file backed up to ${backupPath}`);

        // Create a new empty coupons file
        fs.writeFileSync(couponsFilePath, '[]', 'utf8');
        return [];
      }
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

    // Validate data là mảng trước khi lưu
    if (!Array.isArray(data)) {
      console.error('Invalid coupon data format - expected array');
      return false;
    }

    // Tạo backup trước khi ghi đè
    if (fs.existsSync(couponsFilePath)) {
      const backupDir = path.join(dataDir, 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const backupPath = path.join(backupDir, `coupons-${timestamp}.bak`);
      fs.copyFileSync(couponsFilePath, backupPath);
    }

    // Convert to string once to verify it can be serialized
    const jsonString = JSON.stringify(data, null, 2);

    // Write atomic by using a temporary file
    const tempFilePath = `${couponsFilePath}.temp`;
    fs.writeFileSync(tempFilePath, jsonString, 'utf8');

    // Rename temp file to actual file (atomic operation)
    fs.renameSync(tempFilePath, couponsFilePath);

    return true;
  } catch (error) {
    console.error('Error saving coupons:', error);
    return false;
  }
}

// GET - Lấy thông tin mã giảm giá theo ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    const awaitedParams = await params;
    const id = awaitedParams.id;

    // Đọc dữ liệu từ file
    const coupons = loadCoupons();
    const coupon = coupons.find((c) => c.id === id);

    if (!coupon) {
      return NextResponse.json({ error: 'Không tìm thấy mã giảm giá' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi tải mã giảm giá' }, { status: 500 });
  }
}

// PUT - Cập nhật mã giảm giá
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('PUT request received for coupon with params:', params);
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    const awaitedParams = await params;
    const id = awaitedParams.id;
    console.log('Processing update for coupon ID:', id);

    // Đọc dữ liệu từ file
    const coupons = loadCoupons();
    console.log('Loaded coupons:', coupons.length);

    const couponIndex = coupons.findIndex((c) => c.id === id);
    console.log('Coupon index in array:', couponIndex);

    if (couponIndex === -1) {
      console.log('Coupon not found for ID:', id);
      return NextResponse.json({ error: 'Không tìm thấy mã giảm giá' }, { status: 404 });
    }

    const body = await request.json();
    console.log('Update body:', body);

    const {
      code,
      name,
      description,
      type,
      value,
      minOrder,
      maxDiscount,
      usageLimit,
      usedCount,
      startDate,
      endDate,
      applicableProducts,
      isPublic,
    } = body;

    // Validation
    if (!code || !name || !type || !value || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 },
      );
    }

    // Kiểm tra mã giảm giá đã tồn tại (trừ mã hiện tại)
    const existingCoupon = coupons.find(
      (coupon) => coupon.code === code.toUpperCase() && coupon.id !== id,
    );
    if (existingCoupon) {
      return NextResponse.json({ error: 'Mã giảm giá đã tồn tại' }, { status: 400 });
    }

    // Validation giá trị
    if ((type === 'percentage' || type === 'cashback') && (value < 0 || value > 100)) {
      return NextResponse.json({ error: 'Giá trị phần trăm phải từ 0 đến 100' }, { status: 400 });
    }

    if (type === 'fixed' && value < 0) {
      return NextResponse.json({ error: 'Giá trị giảm giá phải lớn hơn 0' }, { status: 400 });
    }

    // Validation thời gian
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return NextResponse.json({ error: 'Ngày kết thúc phải sau ngày bắt đầu' }, { status: 400 });
    }

    // Cập nhật mã giảm giá
    const updatedCoupon = {
      ...coupons[couponIndex],
      code: code.toUpperCase(),
      name,
      description: description || '',
      type,
      value: Number(value),
      minOrder: minOrder ? Number(minOrder) : undefined,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      usedCount: usedCount !== undefined ? Number(usedCount) : coupons[couponIndex].usedCount,
      startDate: startDate.includes('T') ? startDate : `${startDate}T00:00:00.000Z`,
      endDate: endDate.includes('T') ? endDate : `${endDate}T23:59:59.999Z`,
      applicableProducts: applicableProducts || [],
      isPublic: typeof isPublic === 'boolean' ? isPublic : true,
      updatedAt: new Date().toISOString(),
    };

    coupons[couponIndex] = updatedCoupon;

    // Lưu thay đổi vào file
    saveCoupons(coupons);

    return NextResponse.json({
      success: true,
      message: 'Mã giảm giá đã được cập nhật thành công',
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi cập nhật mã giảm giá' }, { status: 500 });
  }
}

// DELETE - Xóa mã giảm giá
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const deletedCoupon = coupons[couponIndex];

    // Kiểm tra xem mã giảm giá đã được sử dụng chưa
    if (deletedCoupon.usedCount > 0) {
      return NextResponse.json(
        { error: 'Không thể xóa mã giảm giá đã được sử dụng. Vui lòng vô hiệu hóa thay vì xóa.' },
        { status: 400 },
      );
    }

    // Xóa mã giảm giá
    coupons.splice(couponIndex, 1);

    // Lưu thay đổi vào file
    saveCoupons(coupons);

    return NextResponse.json({
      success: true,
      message: 'Mã giảm giá đã được xóa thành công',
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi xóa mã giảm giá' }, { status: 500 });
  }
}
