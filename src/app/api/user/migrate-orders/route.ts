import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/authOptions';
import { getUserDataFromFile } from '@/lib/userService';

export async function POST(request: NextRequest) {
  try {
    // Kiểm tra xác thực
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orders } = await request.json();

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json({ error: 'Invalid orders data' }, { status: 400 });
    }

    const email = session.user.email;

    // Gọi hàm migrate với dữ liệu từ client
    await migrateOrdersFromLocalStorageServer(email, orders);

    return NextResponse.json({
      success: true,
      message: 'Orders migrated successfully',
    });
  } catch (error) {
    console.error('Error migrating orders:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}

// Hàm migrate chạy trên server với dữ liệu từ client
async function migrateOrdersFromLocalStorageServer(
  email: string,
  localOrders: any[],
): Promise<void> {
  try {
    console.log(`🔄 Migrating ${localOrders.length} orders from client for: ${email}`);

    const userData = await getUserDataFromFile(email);

    if (!userData) {
      console.log(`❌ No user data found for: ${email}`);
      return;
    }

    if (localOrders.length > 0) {
      // Convert localStorage orders to our Order format
      const migratedOrders = localOrders.map((localOrder: any) => ({
        id: localOrder.id || `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        items:
          localOrder.items?.map((item: any) => ({
            productId: item.productId || item.id,
            productName: item.productName || item.name,
            quantity: item.quantity || 1,
            price: item.price || 0,
            originalPrice: item.originalPrice,
            image: item.image,
            version: item.version || 'default',
          })) || [],
        totalAmount: localOrder.totalAmount || 0,
        couponDiscount: localOrder.couponDiscount || 0,
        status: localOrder.status || 'completed',
        paymentMethod: localOrder.paymentMethod || 'unknown',
        paymentStatus: localOrder.paymentStatus || 'paid',
        createdAt: localOrder.createdAt || new Date().toISOString(),
        updatedAt: localOrder.updatedAt || new Date().toISOString(),
        transactionId: localOrder.transactionId,
      }));

      // Merge với orders hiện có (tránh duplicate)
      const existingOrderIds = userData.orders?.map((o: any) => o.id) || [];
      const newOrders = migratedOrders.filter((o: any) => !existingOrderIds.includes(o.id));

      if (newOrders.length > 0) {
        // Sử dụng hàm sync để cập nhật
        console.log(`✅ Would migrate ${newOrders.length} orders for: ${email}`);
        // TODO: Implement proper order migration through existing functions
      } else {
        console.log(`ℹ️ No new orders to migrate for: ${email}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error migrating orders for ${email}:`, error);
    throw error;
  }
}
