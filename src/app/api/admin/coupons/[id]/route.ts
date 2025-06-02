import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

// Mock data store - trong thực tế sẽ dùng database
// Import từ file route cha để có cùng data
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
    applicableProducts: [],
    isPublic: true
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
    applicableProducts: [],
    isPublic: true
  }
];

// GET - Lấy thông tin mã giảm giá theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const awaitedParams = await params;
    const id = awaitedParams.id;
    
    const coupon = coupons.find(c => c.id === id);
    
    if (!coupon) {
      return NextResponse.json(
        { error: 'Không tìm thấy mã giảm giá' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon
    });

  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tải mã giảm giá' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật mã giảm giá
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const awaitedParams = await params;
    const id = awaitedParams.id;
    
    const couponIndex = coupons.findIndex(c => c.id === id);
    
    if (couponIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy mã giảm giá' },
        { status: 404 }
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
      applicableProducts,
      isPublic
    } = body;

    // Validation
    if (!code || !name || !type || !value || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Kiểm tra mã giảm giá đã tồn tại (trừ mã hiện tại)
    const existingCoupon = coupons.find(coupon => 
      coupon.code === code.toUpperCase() && coupon.id !== id
    );
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
      startDate: startDate.includes('T') ? startDate : `${startDate}T00:00:00.000Z`,
      endDate: endDate.includes('T') ? endDate : `${endDate}T23:59:59.999Z`,
      applicableProducts: applicableProducts || [],
      isPublic: typeof isPublic === 'boolean' ? isPublic : true,
      updatedAt: new Date().toISOString()
    };

    coupons[couponIndex] = updatedCoupon;

    return NextResponse.json({
      success: true,
      message: 'Mã giảm giá đã được cập nhật thành công',
      coupon: updatedCoupon
    });

  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi cập nhật mã giảm giá' },
      { status: 500 }
    );
  }
}

// DELETE - Xóa mã giảm giá
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const awaitedParams = await params;
    const id = awaitedParams.id;
    
    const couponIndex = coupons.findIndex(c => c.id === id);
    
    if (couponIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy mã giảm giá' },
        { status: 404 }
      );
    }

    const deletedCoupon = coupons[couponIndex];
    
    // Kiểm tra xem mã giảm giá đã được sử dụng chưa
    if (deletedCoupon.usedCount > 0) {
      return NextResponse.json(
        { error: 'Không thể xóa mã giảm giá đã được sử dụng. Vui lòng vô hiệu hóa thay vì xóa.' },
        { status: 400 }
      );
    }

    // Xóa mã giảm giá
    coupons.splice(couponIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Mã giảm giá đã được xóa thành công'
    });

  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xóa mã giảm giá' },
      { status: 500 }
    );
  }
} 