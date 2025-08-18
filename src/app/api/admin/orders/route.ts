import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

import { authOptions } from '@/lib/authOptions';
import { Order, OrderStats } from '@/models/OrderModel';

// Function to load user data from JSON files
function loadUserData() {
  const dataDir = path.join(process.cwd(), 'data/users');
  if (!fs.existsSync(dataDir)) {
    return [];
  }

  const userFiles = fs.readdirSync(dataDir).filter((file) => file.endsWith('.json'));
  const userData = [];

  for (const file of userFiles) {
    try {
      const filePath = path.join(dataDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      userData.push(data);
    } catch (error) {
      console.error(`Error reading user file ${file}:`, error);
    }
  }

  return userData;
}

// Function to calculate order statistics
function calculateOrderStats(userData: any[]): OrderStats {
  // Initialize stats object
  const stats: OrderStats = {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0,
    revenue: 0,
    averageOrderValue: 0,
  };

  // Process all users' orders
  userData.forEach((user) => {
    // Tính doanh thu từ đơn hàng
    if (user.orders && Array.isArray(user.orders)) {
      // Count orders
      stats.total += user.orders.length;

      // Process each order
      user.orders.forEach((order: any) => {
        // Count by status
        if (order.status === 'pending') stats.pending++;
        else if (order.status === 'processing') stats.processing++;
        else if (order.status === 'completed') stats.completed++;
        else if (order.status === 'cancelled') stats.cancelled++;
        else if (order.status === 'refunded') stats.refunded++;

        // Add to revenue if order is completed and paid
        if (order.status === 'completed' && order.paymentStatus === 'paid') {
          stats.revenue += order.totalAmount;
        }
      });
    }
    
    // Tính doanh thu tiềm năng từ giỏ hàng
    if (user.cart && Array.isArray(user.cart)) {
      user.cart.forEach((item: any) => {
        if (item.price && item.quantity) {
          stats.revenue += item.price * item.quantity;
        }
      });
    }
  });

  // Calculate average order value
  stats.averageOrderValue = stats.total > 0 ? Math.round(stats.revenue / stats.total) : 0;

  return stats;
}

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

    // Load all user data from JSON files
    const userData = loadUserData();

    // Extract all orders from user data
    const orders: Order[] = [];
    userData.forEach((user) => {
      if (user.orders && Array.isArray(user.orders)) {
        // Add user information to each order
        const userOrders = user.orders.map((order: any) => ({
          ...order,
          userName: user.profile?.name || 'Unknown',
          userEmail: user.profile?.email || 'unknown@example.com',
        }));
        orders.push(...userOrders);
      }
    });

    // Calculate order statistics
    const stats = calculateOrderStats(userData);

    // No need for mock data anymore as we have real data in the user JSON files
    // This ensures we always show real data instead of placeholder data

    return NextResponse.json({
      orders: orders,
      stats: stats,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
