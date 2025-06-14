import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncUserBalance } from '@/lib/userService';

// Balance cache với timeout giảm xuống để tăng tính realtime
const balanceCache = new Map<string, { balance: number; timestamp: number }>();
const CACHE_TIMEOUT = 30 * 1000; // 30 seconds (giảm từ 2 phút xuống 30s)

// Cleanup cache mỗi 10 phút để tránh memory leak
setInterval(
  () => {
    const now = Date.now();
    balanceCache.forEach((cache, email) => {
      if (now - cache.timestamp > CACHE_TIMEOUT * 2) {
        // Remove after double the cache timeout
        balanceCache.delete(email);
      }
    });
  },
  10 * 60 * 1000,
); // 10 minutes

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    // Check for force refresh parameter
    const forceRefresh = url.searchParams.has('t');
    
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          message: 'You need to log in to access this resource',
          balance: 0
        }, 
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Check cache first if not forced to refresh
    const cached = balanceCache.get(userEmail);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
      return NextResponse.json({
        balance: Number(cached.balance) || 0,
        cached: true,
      });
    }

    try {
      // Get synchronized balance from both systems
      let balance = await syncUserBalance(userEmail);
      
      // Ensure balance is a number
      balance = Number(balance) || 0;

      // Cache the result
      balanceCache.set(userEmail, { balance, timestamp: Date.now() });
      
      console.log(`Balance API: Retrieved balance for ${userEmail}: ${balance}`);

      return NextResponse.json({
        balance: balance,
        cached: false,
      });
    } catch (syncError) {
      console.error('Error syncing user balance:', syncError);
      return NextResponse.json(
        { 
          error: 'Balance Sync Error', 
          message: syncError instanceof Error ? syncError.message : 'Failed to sync user balance',
          details: process.env.NODE_ENV === 'development' ? syncError : undefined,
          balance: 0
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
        balance: 0
      }, 
      { status: 500 }
    );
  }
}
