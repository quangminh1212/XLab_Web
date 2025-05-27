import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';

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

// PATCH - Toggle trạng thái mã giảm giá
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const couponIndex = coupons.findIndex(c => c.id === params.id);
    
    if (couponIndex === -1) {
      return NextResponse.json(
        { error: 'Không tìm thấy mã giảm giá' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Giá trị isActive phải là boolean' },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái
    coupons[couponIndex] = {
      ...coupons[couponIndex],
      isActive,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: `Mã giảm giá đã được ${isActive ? 'kích hoạt' : 'vô hiệu hóa'} thành công`,
      coupon: coupons[couponIndex]
    });

  } catch (error) {
    console.error('Error toggling coupon status:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi cập nhật trạng thái mã giảm giá' },
      { status: 500 }
    );
  }
} 