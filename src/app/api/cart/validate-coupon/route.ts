import { NextRequest, NextResponse } from 'next/server';

// Import coupons data từ admin coupons route (trong thực tế sẽ dùng database)
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
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
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
    endDate: '2025-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    applicableProducts: []
  },
  // Thêm các mã cũ để tương thích
  {
    id: '3',
    code: 'WELCOME10',
    name: 'Giảm 10% cho đơn hàng đầu tiên',
    description: 'Ưu đãi cho khách hàng mới',
    type: 'percentage',
    value: 10,
    minOrder: 50000,
    usageLimit: 0,
    usedCount: 0,
    isActive: true,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    applicableProducts: []
  },
  {
    id: '4',
    code: 'FREESHIP',
    name: 'Miễn phí vận chuyển',
    description: 'Miễn phí vận chuyển (30.000đ)',
    type: 'fixed',
    value: 30000,
    minOrder: 0,
    usageLimit: 0,
    usedCount: 0,
    isActive: true,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    applicableProducts: []
  },
  {
    id: '5',
    code: 'XLAB20',
    name: 'Giảm 20% cho sản phẩm XLab',
    description: 'Giảm 20% cho các sản phẩm XLab',
    type: 'percentage',
    value: 20,
    minOrder: 100000,
    usageLimit: 0,
    usedCount: 0,
    isActive: true,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    applicableProducts: []
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderTotal } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập mã giảm giá' },
        { status: 400 }
      );
    }

    // Tìm mã giảm giá
    const coupon = coupons.find(c => 
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

    if (now < startDate || now > endDate) {
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

    // Kiểm tra số lần sử dụng
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: 'Mã giảm giá đã hết lượt sử dụng' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
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