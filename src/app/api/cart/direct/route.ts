import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Simple in-memory cache to prevent excessive file reads
type CacheEntry = {
  timestamp: number;
  data: any;
};

const CACHE_TTL = 60 * 1000; // 60 seconds cache time
const cartCache = new Map<string, CacheEntry>();

// API route to directly read cart data from file, bypassing any middleware or service layer
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Sanitize email for filename
    const fileName = session.user.email.replace(/[^a-zA-Z0-9@.-]/g, '_') + '.json';
    const filePath = path.join(process.cwd(), 'data', 'users', fileName);
    
    // Check if we have a recent cache entry
    const cacheKey = `cart_${session.user.email}`;
    const cached = cartCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp < CACHE_TTL)) {
      console.log(`🔧 Direct cart API - Using cached data for ${session.user.email}`);
      return NextResponse.json({
        success: true,
        message: 'Cart data retrieved from cache',
        fileName,
        cart: cached.data.cart || [],
        cached: true
      });
    }
    
    console.log(`🔧 Direct cart API - Checking file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`🔧 Direct cart API - File not found`);
      return NextResponse.json({ 
        error: 'User data file not found', 
        success: false,
        cart: []
      }, { status: 200 });
    }
    
    // Read file directly from filesystem
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const userData = JSON.parse(fileContents);
    
    // Extract cart data
    const cart = userData.cart || [];
    
    console.log(`🔧 Direct cart API - Successfully retrieved ${cart.length} cart items`);
    
    // Cache the result
    cartCache.set(cacheKey, {
      timestamp: now,
      data: userData
    });
    
    // Return direct file data
    return NextResponse.json({
      success: true,
      message: 'Cart data retrieved directly from file',
      fileName,
      cart
    });
  } catch (error) {
    console.error('Error in direct cart API:', error);
    return NextResponse.json({ 
      error: 'Server error reading cart data',
      success: false,
      cart: []
    }, { status: 200 }); // Still return 200 to prevent client errors
  }
} 