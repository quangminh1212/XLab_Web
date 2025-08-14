import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import fs from 'fs';
import path from 'path';

// Tạo đường dẫn đến file lưu dữ liệu
const dataDir = path.join(process.cwd(), 'data');
const couponsFilePath = path.join(dataDir, 'coupons.json');

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

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
}

// Initial sample data
const initialCoupons: Coupon[] = [
  {
    id: '1',
    code: 'SUMMER2024',
    name: 'Summer Discount',
    description: 'Special discount for Summer 2024',
    type: 'percentage',
    value: 20,
    minOrder: 100000,
    maxDiscount: 500000,
    usageLimit: 100,
    usedCount: 15,
    isActive: true,
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-08-31T23:59:59Z',
    createdAt: '2024-05-01T00:00:00Z',
    applicableProducts: [],
    isPublic: true,
  },
  {
    id: '2',
    code: 'WELCOME50',
    name: 'Welcome offer for new members',
    description: 'Welcome offer for new members',
    type: 'fixed',
    value: 50000,
    minOrder: 200000,
    usageLimit: 0,
    usedCount: 8,
    isActive: true,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    applicableProducts: [],
    isPublic: true,
  },
];

// Hàm đọc dữ liệu từ file hoặc sử dụng dữ liệu mẫu nếu file không tồn tại
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
        fs.writeFileSync(couponsFilePath, JSON.stringify(initialCoupons, null, 2), 'utf8');
        return initialCoupons;
      }
    }
    // Nếu file không tồn tại, lưu dữ liệu mẫu vào file
    fs.writeFileSync(couponsFilePath, JSON.stringify(initialCoupons, null, 2), 'utf8');
    return initialCoupons;
  } catch (error) {
    console.error('Error loading coupons:', error);
    return initialCoupons;
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

// Mock data store - đọc từ file nếu có, nếu không sử dụng dữ liệu mẫu
let coupons: Coupon[] = loadCoupons();

// GET - Lấy danh sách mã giảm giá
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    // Đọc lại dữ liệu từ file để đảm bảo lấy phiên bản mới nhất
    coupons = loadCoupons();

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tải danh sách mã giảm giá' },
      { status: 500 },
    );
  }
}

// POST - Tạo mã giảm giá mới
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
    }

    // Đọc lại dữ liệu từ file để đảm bảo dữ liệu mới nhất
    coupons = loadCoupons();

    const body = await request.json();
    const {
      code,
      name,
      description,
      type,
      value,
      minOrder,
      maxDiscount,
      usageLimit,
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

    // Kiểm tra mã giảm giá đã tồn tại
    const existingCoupon = coupons.find((coupon) => coupon.code === code.toUpperCase());
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

    // Tạo ID mới
    const newId = (
      coupons.length > 0 ? Math.max(...coupons.map((c) => parseInt(c.id))) + 1 : 1
    ).toString();

    // Tạo mã giảm giá mới
    const newCoupon: Coupon = {
      id: newId,
      code: code.toUpperCase(),
      name,
      description: description || '',
      type,
      value: Number(value),
      minOrder: minOrder ? Number(minOrder) : undefined,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      usedCount: 0,
      isActive: true,
      startDate: startDate.includes('T') ? startDate : `${startDate}T00:00:00.000Z`,
      endDate: endDate.includes('T') ? endDate : `${endDate}T23:59:59.999Z`,
      createdAt: new Date().toISOString(),
      applicableProducts: applicableProducts || [],
      isPublic: typeof isPublic === 'boolean' ? isPublic : true,
    };

    // Thêm mã giảm giá mới vào danh sách
    coupons.push(newCoupon);

    // Lưu thay đổi vào file
    saveCoupons(coupons);

    return NextResponse.json({
      success: true,
      message: 'Mã giảm giá đã được tạo thành công',
      coupon: newCoupon,
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi khi tạo mã giảm giá' }, { status: 500 });
  }
}
