import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/authOptions';
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
    console.log('🔍 API DEBUG - GET /api/cart - Session:', session?.user?.email);

    if (!session?.user?.email) {
      console.log('🔍 API DEBUG - GET /api/cart - Unauthorized, no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cart = await getUserCart(session.user.email);
    
    // Make sure cart is always an array
    const safeCart = Array.isArray(cart) ? cart : [];
    
    // Check if we need to force-populate the cart with test data when empty
    if (safeCart.length === 0) {
      console.log('🔍 API DEBUG - GET /api/cart - Cart is empty, adding fallback data');
      
      // Check if user's data file has cart items that aren't being returned
      try {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'data', 'users', `${session.user.email.replace(/[^a-zA-Z0-9@.-]/g, '_')}.json`);
        
        if (fs.existsSync(filePath)) {
          const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (userData.cart && userData.cart.length > 0) {
            console.log('🔍 API DEBUG - GET /api/cart - Found cart data in user file:', userData.cart.length, 'items');
            // Return the cart data from the file directly
            return NextResponse.json({
              success: true,
              message: 'Cart retrieved from user file directly',
              cart: userData.cart,
            });
          }
        }
      } catch (fileError) {
        console.error('Error reading user file directly:', fileError);
      }
    }
    
    console.log('🔍 API DEBUG - GET /api/cart - Cart retrieved:', safeCart.length, 'items');

    return NextResponse.json({
      success: true,
      message: 'Cart retrieved successfully',
      cart: safeCart,
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
    console.log('🔍 API DEBUG - PUT /api/cart - Session:', session?.user?.email);

    if (!session?.user?.email) {
      console.log('🔍 API DEBUG - PUT /api/cart - Unauthorized, no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('🔍 API DEBUG - PUT /api/cart - Request data:', data);
    const { cart } = data;

    if (!Array.isArray(cart)) {
      console.log('🔍 API DEBUG - PUT /api/cart - Invalid cart data, not an array');
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
    }

    await updateUserCartSync(session.user.email, cart);
    console.log('🔍 API DEBUG - PUT /api/cart - Cart updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      cart: cart,
    });
  } catch (error: any) {
    console.error('Error updating cart:', error);
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
