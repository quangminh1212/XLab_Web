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

    // Sample mock orders; replace with real DB query in production
    const mockOrders: Order[] = [
      {
        id: 'ORD-001', userId: '1', userName: 'Nguyễn Văn A', userEmail: 'nguyenvana@example.com',
        items: [{ productId: 'prod-vt', productName: 'VoiceTyping', quantity: 1, price: 990000 }],
        totalAmount: 990000, status: 'completed', paymentMethod: 'bank_transfer', paymentStatus: 'paid',
        createdAt: '2023-05-20T15:30:00Z', updatedAt: '2023-05-20T15:30:00Z'
      },
      {
        id: 'ORD-002', userId: '2', userName: 'Trần Thị B', userEmail: 'tranthib@example.com',
        items: [
          { productId: 'prod-office', productName: 'Office Suite', quantity: 1, price: 1200000 },
          { productId: 'prod-backup', productName: 'Backup Pro', quantity: 1, price: 500000 }
        ],
        totalAmount: 1700000, status: 'processing', paymentMethod: 'momo', paymentStatus: 'paid',
        createdAt: '2023-05-28T21:20:00Z', updatedAt: '2023-05-28T21:20:00Z'
      }
    ];
    const orders = mockOrders;
    // Compute statistics
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const refunded = orders.filter(o => o.status === 'refunded').length;
    // Revenue is sum of all orders
    const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    // Average order value based on all orders
    const averageOrderValue = total > 0 ? Math.round(revenue / total) : 0;
    const stats: OrderStats = { total, pending, processing, completed, cancelled, refunded, revenue, averageOrderValue };

    return NextResponse.json({ 
      orders: orders,
      stats: stats
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 