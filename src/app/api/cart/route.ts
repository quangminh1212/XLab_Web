import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  getUserCart,
  updateUserCart,
  updateUserCartSync,
  addToUserCart,
  removeFromUserCart,
  clearUserCart,
} from '@/lib/userService';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: string[];
  version?: string;
  uniqueKey?: string;
}

// Get cart items từ user data
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await getUserCart(session.user.email);

    return NextResponse.json({
      success: true,
      message: 'Cart retrieved successfully',
      cart: cart,
    });
  } catch (error: any) {
    console.error('Error getting cart:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Update cart (overwrite entire cart)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('🔄 Cart API - PUT request received', { 
      hasSession: !!session,
      userEmail: session?.user?.email 
    });

    if (!session?.user?.email) {
      console.log('❌ Cart API - Unauthorized: No valid session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { cart } = data;

    if (!Array.isArray(cart)) {
      console.log('❌ Cart API - Invalid cart data:', cart);
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
    }

    console.log(`✅ Cart API - Updating cart for ${session.user.email}:`, { 
      itemCount: cart.length,
      items: cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity }))
    });

    await updateUserCartSync(session.user.email, cart);
    console.log(`✅ Cart API - Cart updated successfully for ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      cart: cart,
    });
  } catch (error: any) {
    console.error('❌ Cart API - Error updating cart:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Add item to cart
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { item } = data;

    if (!item || !item.id) {
      return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
    }

    await addToUserCart(session.user.email, item);
    const updatedCart = await getUserCart(session.user.email);

    return NextResponse.json({
      success: true,
      message: 'Item added to cart successfully',
      cart: updatedCart,
    });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Clear the cart
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await clearUserCart(session.user.email);

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
