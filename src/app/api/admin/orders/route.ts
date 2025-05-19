import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { Order, OrderStats } from '@/models/OrderModel';
import fs from 'fs';
import path from 'path';

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

    // Đọc dữ liệu đơn hàng từ file
    const dataFilePath = path.join(process.cwd(), 'src/data/orders.json');
    let orders: Order[] = [];
    try {
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        orders = JSON.parse(fileContent);
      }
    } catch (fileError) {
      console.error('Error reading orders data:', fileError);
      orders = [];
    }

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