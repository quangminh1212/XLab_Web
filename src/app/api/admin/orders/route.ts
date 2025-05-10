import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Order } from '@/models/OrderModel';

export async function GET() {
  try {
    // Lấy thông tin phiên đăng nhập
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Kiểm tra quyền admin
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Trong môi trường thực tế:
    // - Kết nối đến database (SQL, MongoDB, ...)
    // - Truy vấn danh sách đơn hàng
    // - Trả về kết quả
    
    // Hiện tại trả về dữ liệu đơn hàng của người dùng hiện tại
    // Khi có database, phần này sẽ được thay thế bằng truy vấn từ database
    const realOrders: Order[] = [
      {
        id: 'ORD-20230601',
        userId: session.user.id || '1',
        userName: session.user.name || 'Admin',
        userEmail: session.user.email || 'admin@xlab.vn',
        items: [
          {
            productId: 'prod-vt',
            productName: 'VoiceTyping',
            quantity: 1,
            price: 990000
          }
        ],
        totalAmount: 990000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        createdAt: '2023-05-20T08:30:00Z',
        updatedAt: '2023-05-20T10:15:00Z'
      }
    ];

    return NextResponse.json({ 
      orders: realOrders
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 