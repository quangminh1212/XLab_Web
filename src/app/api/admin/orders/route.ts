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

    // CHÚ Ý: Code này trả về dữ liệu rỗng vì chưa có đơn hàng thực tế
    // Trong ứng dụng thực tế, đây sẽ là truy vấn đến cơ sở dữ liệu
    
    const orders: Order[] = [];

    // Thống kê rỗng
    const stats: OrderStats = {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
      refunded: 0,
      revenue: 0,
      averageOrderValue: 0
    };

    return NextResponse.json({ 
      orders: orders,
      stats: stats
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 