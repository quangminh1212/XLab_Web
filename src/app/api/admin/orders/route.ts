import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { Order, OrderStats } from '@/models/OrderModel';
import fs from 'fs';
import path from 'path';

// Function to load user data from JSON files
function loadUserData() {
  const dataDir = path.join(process.cwd(), 'data/users');
  if (!fs.existsSync(dataDir)) {
    return [];
  }

  const userFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
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
    averageOrderValue: 0
  };

  // Process all users' orders
  userData.forEach(user => {
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
    userData.forEach(user => {
      if (user.orders && Array.isArray(user.orders)) {
        // Add user information to each order
        const userOrders = user.orders.map((order: any) => ({
          ...order,
          userName: user.profile?.name || 'Unknown',
          userEmail: user.profile?.email || 'unknown@example.com'
        }));
        orders.push(...userOrders);
      }
    });

    // Calculate order statistics
    const stats = calculateOrderStats(userData);

    // If no user data was found, include mock data
    if (orders.length === 0) {
      // Generate mock orders for testing
      const mockOrders: Order[] = [
        {
          id: 'XL-' + Math.floor(100000 + Math.random() * 900000).toString(),
          userId: 'mock-user',
          userName: 'Test User',
          userEmail: 'test@example.com',
          items: [
            {
              productId: 'chatgpt',
              productName: 'ChatGPT',
              quantity: 1,
              price: 149000,
              image: '/images/products/chatgpt/thumbnail.png'
            }
          ],
          totalAmount: 149000,
          status: 'completed' as const,
          paymentMethod: 'bank_transfer' as const,
          paymentStatus: 'paid' as const,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'XL-' + Math.floor(100000 + Math.random() * 900000).toString(),
          userId: 'mock-user',
          userName: 'Test User',
          userEmail: 'test@example.com',
          items: [
            {
              productId: 'grok',
              productName: 'Grok',
              quantity: 2,
              price: 149000,
              image: '/images/products/grok/thumbnail.png'
            }
          ],
          totalAmount: 298000,
          status: 'completed' as const,
          paymentMethod: 'momo' as const,
          paymentStatus: 'paid' as const,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      // Update stats with mock data
      if (stats.total === 0) {
        stats.total = mockOrders.length;
        stats.completed = mockOrders.length;
        stats.revenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        stats.averageOrderValue = Math.round(stats.revenue / stats.total);
      }
      
      // Add mock orders to the response if no real orders exist
      if (orders.length === 0) {
        orders.push(...mockOrders);
      }
    }

    return NextResponse.json({ 
      orders: orders,
      stats: stats
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 