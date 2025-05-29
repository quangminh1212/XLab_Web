import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getUserByEmail, createOrUpdateUser } from '@/lib/userService';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Lấy thông tin người dùng
    let user = await getUserByEmail(session.user.email);
    
    // Nếu chưa có trong database, tạo mới
    if (!user) {
      user = await createOrUpdateUser({
        email: session.user.email,
        name: session.user.name || '',
        image: session.user.image || '',
        isAdmin: false,
        isActive: true,
        balance: 0
      });
    }

    return NextResponse.json({
      balance: user.balance || 0
    });
    
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 