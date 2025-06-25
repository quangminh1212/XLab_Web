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

// Global request counter and timestamp tracker to prevent excessive calls
let requestCounter = 0;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second minimum between API calls (reduced from 5 seconds)
const CACHED_CART_DATA: CartItem[] = []; // Keep a cached empty cart for rapid responses

// Get cart items từ user data
export async function GET(request: Request) {
  try {
    const timestamp = Date.now();
    const session = await getServerSession(authOptions);
    requestCounter++;
    
    // Add artificial delay to prevent rapid requests
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!session?.user?.email) {
      console.log(`[${timestamp}] ❌ CART API - Unauthorized request #${requestCounter}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if we've had too many requests recently
    if (timestamp - lastRequestTime < MIN_REQUEST_INTERVAL && requestCounter > 2) {
      console.log(`[${timestamp}] 🛑 CART API - RATE LIMITED - Too many requests (${requestCounter} requests, last at ${lastRequestTime})`);
      
      // Just return the cached cart data to avoid database hits
      return NextResponse.json({
        success: true,
        message: 'Rate limited - using cached cart data',
        cart: CACHED_CART_DATA,
      });
    }
    
    console.log(`[${timestamp}] 🔄 CART API - Getting cart for user: ${session.user.email} (request #${requestCounter})`);
    
    // On first few requests, actually get the cart and cache it
    if (requestCounter <= 2 || timestamp - lastRequestTime >= MIN_REQUEST_INTERVAL) {
      const cart = await getUserCart(session.user.email);
      console.log(`[${timestamp}] ✅ CART API - Retrieved cart for user: ${session.user.email}, items: ${cart.length}`);
      
      // Update the cached cart and last request time
      CACHED_CART_DATA.length = 0;
      CACHED_CART_DATA.push(...cart);
      lastRequestTime = timestamp;
      
      return NextResponse.json({
        success: true,
        message: 'Cart retrieved successfully',
        cart: cart,
      });
    } else {
      console.log(`[${timestamp}] 🔄 CART API - Using cached cart data for ${session.user.email}`);
      return NextResponse.json({
        success: true,
        message: 'Using cached cart data',
        cart: CACHED_CART_DATA,
      });
    }
  } catch (error: any) {
    const timestamp = Date.now();
    console.error(`[${timestamp}] ❌ Error getting cart:`, error);
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
    const { cart, forceEmpty = false } = data;

    if (!Array.isArray(cart)) {
      console.log('❌ Cart API - Invalid cart data:', cart);
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
    }
    
    // Prevent accidental empty cart updates without explicit confirmation
    if (cart.length === 0 && !forceEmpty) {
      // Get the current cart to check if it has items
      const currentCart = await getUserCart(session.user.email);
      if (currentCart.length > 0) {
        console.log('⚠️ Cart API - Attempted to clear non-empty cart without confirmation:', { 
          currentItems: currentCart.length
        });
        return NextResponse.json({ 
          success: false, 
          message: 'Empty cart update rejected. Use forceEmpty:true to explicitly clear the cart.',
          cart: currentCart
        }, { status: 400 });
      }
    }
    
    // Ensure each cart item has the required fields
    const validCart = cart.map(item => ({
      ...item,
      id: item.id || '',
      name: item.name || '',
      price: item.price || 0,
      quantity: item.quantity || 1,
      uniqueKey: item.uniqueKey || `${item.id}_${item.version || 'default'}_${Date.now()}`
    }));

    console.log(`✅ Cart API - Updating cart for ${session.user.email}:`, { 
      itemCount: validCart.length,
      items: validCart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity }))
    });

    await updateUserCartSync(session.user.email, validCart);
    console.log(`✅ Cart API - Cart updated successfully for ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      cart: validCart,
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
