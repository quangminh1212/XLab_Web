import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../../auth/[...nextauth]/route';
import { getUserByEmail, getUserTransactions } from '@/lib/userService';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Lấy thông tin người dùng
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin người dùng' }, { status: 404 });
    }

    // Lấy lịch sử giao dịch
    const transactions = await getUserTransactions(user.id);

    // Sắp xếp theo thời gian mới nhất trước
    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      transactions: transactions,
    });
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
