import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { removeFromUserCart, getUserCart } from '@/lib/userService';

// Remove item from cart
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { uniqueKey } = data;

    if (!uniqueKey) {
      return NextResponse.json({ error: 'UniqueKey is required' }, { status: 400 });
    }

    await removeFromUserCart(session.user.email, uniqueKey);
    const updatedCart = await getUserCart(session.user.email);

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: updatedCart,
    });
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
