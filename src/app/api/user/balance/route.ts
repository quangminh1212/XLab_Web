import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncUserBalance } from '@/lib/userService';

// Balance cache với timeout 2 phút để giảm spam requests
const balanceCache = new Map<string, { balance: number; timestamp: number }>();
const CACHE_TIMEOUT = 120 * 1000; // 120 seconds (2 minutes)

// Cleanup cache mỗi 10 phút để tránh memory leak
setInterval(
  () => {
    const now = Date.now();
    balanceCache.forEach((cache, email) => {
      if (now - cache.timestamp > CACHE_TIMEOUT * 2) {
        // Remove after 4 minutes
        balanceCache.delete(email);
      }
    });
  },
  10 * 60 * 1000,
); // 10 minutes

export async function GET() {
  try {
    console.log('🔄 API: Balance request received');
    
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      console.log('❌ API: Balance request - Unauthorized');
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          message: 'You need to log in to access this resource' 
        }, 
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    console.log(`👤 API: Balance request for ${userEmail}`);

    // Check cache first
    const cached = balanceCache.get(userEmail);
    if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
      console.log(`📋 API: Returning cached balance for ${userEmail}: ${cached.balance}`);
      return NextResponse.json({
        balance: cached.balance,
        cached: true,
      });
    }

    try {
      // Get synchronized balance from both systems
      console.log(`🔄 API: Syncing balance for ${userEmail}`);
      const balance = await syncUserBalance(userEmail);
      console.log(`✅ API: Balance synced for ${userEmail}: ${balance}`);

      // Cache the result
      balanceCache.set(userEmail, { balance, timestamp: Date.now() });

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
          details: process.env.NODE_ENV === 'development' ? syncError : undefined
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
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}
