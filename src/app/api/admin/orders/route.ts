import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { Order, OrderStats } from '@/models/OrderModel';

export async function GET() {
  try {
    // Kiểm tra xác thực
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra vai trò admin
    const isAdmin = session.user.isAdmin === true;
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // CHÚ Ý: Đây là dữ liệu mẫu
    // Trong ứng dụng thực tế, đây sẽ là truy vấn đến cơ sở dữ liệu
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        userId: '1',
        userName: 'Nguyễn Văn A',
        userEmail: 'nguyenvana@example.com',
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
        createdAt: '2023-05-20T15:30:00Z',
        updatedAt: '2023-05-20T15:30:00Z'
      },
      {
        id: 'ORD-002',
        userId: '2',
        userName: 'Trần Thị B',
        userEmail: 'tranthib@example.com',
        items: [
          {
            productId: 'prod-office',
            productName: 'Office Suite',
            quantity: 1,
            price: 1200000
          },
          {
            productId: 'prod-backup',
            productName: 'Backup Pro',
            quantity: 1,
            price: 500000
          }
        ],
        totalAmount: 1700000,
        status: 'processing',
        paymentMethod: 'momo',
        paymentStatus: 'paid',
        createdAt: '2023-05-28T21:20:00Z',
        updatedAt: '2023-05-28T21:20:00Z'
      },
      {
        id: 'ORD-003',
        userId: '3',
        userName: 'Lê Văn C',
        userEmail: 'levanc@example.com',
        items: [
          {
            productId: 'prod-secure',
            productName: 'Secure Vault',
            quantity: 1,
            price: 850000
          }
        ],
        totalAmount: 850000,
        status: 'pending',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'pending',
        createdAt: '2023-05-29T16:45:00Z',
        updatedAt: '2023-05-29T16:45:00Z'
      },
      {
        id: 'ORD-004',
        userId: '4',
        userName: 'Phạm Thị D',
        userEmail: 'phamthid@example.com',
        items: [
          {
            productId: 'prod-design',
            productName: 'Design Master',
            quantity: 1,
            price: 1500000
          }
        ],
        totalAmount: 1500000,
        status: 'cancelled',
        paymentMethod: 'credit_card',
        paymentStatus: 'refunded',
        createdAt: '2023-05-15T23:30:00Z',
        updatedAt: '2023-05-15T23:30:00Z'
      },
      {
        id: 'ORD-005',
        userId: '5',
        userName: 'Hoàng Văn E',
        userEmail: 'hoangvane@example.com',
        items: [
          {
            productId: 'prod-vt',
            productName: 'VoiceTyping',
            quantity: 2,
            price: 990000
          }
        ],
        totalAmount: 1980000,
        status: 'completed',
        paymentMethod: 'zalopay',
        paymentStatus: 'paid',
        createdAt: '2023-05-25T18:10:00Z',
        updatedAt: '2023-05-25T18:10:00Z'
      }
    ];

    // Tính toán thống kê
    const totalOrders = 5;
    const pendingOrders = 1; // Chờ xử lý
    const processingOrders = 1; // Đang xử lý
    const completedOrders = 2; // Hoàn thành
    const cancelledOrders = 1; // Đã hủy
    const refundedOrders = 0; // Hoàn tiền
    
    // Tổng doanh thu: 990.000 + 1.980.000 = 2.970.000đ
    const revenue = 2970000;
    
    // Giá trị trung bình đơn hàng
    const averageOrderValue = revenue / completedOrders;

    const stats: OrderStats = {
      total: totalOrders,
      pending: pendingOrders,
      processing: processingOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
      refunded: refundedOrders,
      revenue,
      averageOrderValue
    };

    return NextResponse.json({ 
      orders: mockOrders,
      stats: stats
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 