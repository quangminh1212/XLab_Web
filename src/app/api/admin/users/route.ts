import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/authOptions';
import {
  getUsers,
  getAllUserEmails,
  getUserDataFromFile,
  getUserOrderStats,
} from '@/lib/userService';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Lấy thông tin phiên đăng nhập
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kiểm tra quyền admin
    const currentUser = await getUserDataFromFile(session.user.email);
    if (!currentUser || !currentUser.profile.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Lấy danh sách user từ cả hai nguồn
    const usersFromJson = await getUsers();
    const userEmailsFromFiles = await getAllUserEmails();

    // Merge và tạo danh sách user hoàn chỉnh
    const allUserEmails = Array.from(
      new Set([...usersFromJson.map((u) => u.email), ...userEmailsFromFiles]),
    );

    const users = [];

    for (const email of allUserEmails) {
      // Ưu tiên lấy từ file riêng
      const userData = await getUserDataFromFile(email);
      if (userData) {
        // Lấy thống kê đơn hàng từ file
        const orderStats = await getUserOrderStats(email);

        const userWithStats = {
          ...userData.profile,
          purchasedProducts: orderStats.totalProducts,
          totalSpent: orderStats.totalSpent,
          totalOrders: orderStats.totalOrders,
        };

        users.push(userWithStats);
      } else {
        // Fallback từ users.json
        const userFromJson = usersFromJson.find((u) => u.email === email);
        if (userFromJson) {
          const userWithStats = {
            ...userFromJson,
            purchasedProducts: 0,
            totalSpent: 0,
            totalOrders: 0,
          };
          users.push(userWithStats);
        }
      }
    }

    // Tính thống kê
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
      newThisMonth: users.filter((u) => {
        const createdAt = new Date(u.createdAt);
        return createdAt >= startOfMonth;
      }).length,
      admins: users.filter((u) => u.isAdmin).length,
    };

    return NextResponse.json({
      users: users.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
      stats,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
