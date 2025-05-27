import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Mock data store - trong thực tế sẽ dùng database
let coupons: any[] = [
  {
    id: '1',
    code: 'SUMMER2024',
    name: 'Giảm giá mùa hè',
    description: 'Mã giảm giá đặc biệt cho mùa hè 2024',
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
    applicableProducts: []
  },
  {
    id: '2',
    code: 'WELCOME50',
    name: 'Chào mừng thành viên mới',
    description: 'Ưu đãi cho khách hàng đăng ký mới',
    type: 'fixed',
    value: 50000,
    minOrder: 200000,
    usageLimit: 0,
    usedCount: 8,
    isActive: true,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    applicableProducts: []
  }
];

// GET - Lấy danh sách mã giảm giá
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    // Lọc theo query params nếu có
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredCoupons = [...coupons];

    if (status === 'active') {
      filteredCoupons = filteredCoupons.filter(coupon => coupon.isActive);
    } else if (status === 'inactive') {
      filteredCoupons = filteredCoupons.filter(coupon => !coupon.isActive);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredCoupons = filteredCoupons.filter(coupon => 
        coupon.code.toLowerCase().includes(searchLower) ||
        coupon.name.toLowerCase().includes(searchLower)
      );
    }

    // Sắp xếp theo ngày tạo mới nhất
    filteredCoupons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      coupons: filteredCoupons,
      total: filteredCoupons.length
    });

  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tải mã giảm giá' },
      { status: 500 }
    );
  }
}

// POST - Tạo mã giảm giá mới
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

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
      applicableProducts
    } = body;

    // Validation
    if (!code || !name || !type || !value || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Kiểm tra mã giảm giá đã tồn tại
    const existingCoupon = coupons.find(coupon => coupon.code === code.toUpperCase());
    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Mã giảm giá đã tồn tại' },
        { status: 400 }
      );
    }

    // Validation giá trị
    if (type === 'percentage' && (value < 0 || value > 100)) {
      return NextResponse.json(
        { error: 'Giá trị phần trăm phải từ 0 đến 100' },
        { status: 400 }
      );
    }

    if (type === 'fixed' && value < 0) {
      return NextResponse.json(
        { error: 'Giá trị giảm giá phải lớn hơn 0' },
        { status: 400 }
      );
    }

    // Validation thời gian
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return NextResponse.json(
        { error: 'Ngày kết thúc phải sau ngày bắt đầu' },
        { status: 400 }
      );
    }

    // Tạo mã giảm giá mới
    const newCoupon = {
      id: Date.now().toString(),
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
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      createdAt: new Date().toISOString(),
      applicableProducts: applicableProducts || []
    };

    coupons.push(newCoupon);

    return NextResponse.json({
      success: true,
      message: 'Mã giảm giá đã được tạo thành công',
      coupon: newCoupon
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tạo mã giảm giá' },
      { status: 500 }
    );
  }
} 