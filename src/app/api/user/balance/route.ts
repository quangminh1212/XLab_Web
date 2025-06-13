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
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          message: 'You need to log in to access this resource' 
        }, 
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Check cache first
    const cached = balanceCache.get(userEmail);
    if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
      return NextResponse.json({
        balance: cached.balance,
        cached: true,
      });
    }

          try {
      console.log(`🔄 Syncing balance for user: ${userEmail}`);
      // Get synchronized balance from both systems
      const balance = await syncUserBalance(userEmail);
      console.log(`✅ Balance synced successfully: ${balance}`);

      // Kiểm tra giá trị balance trước khi trả về
      if (balance === undefined || balance === null || isNaN(balance)) {
        console.error(`⚠️ Invalid balance value returned: ${balance}, using 0 instead`);
        // Cache giá trị an toàn
        balanceCache.set(userEmail, { balance: 0, timestamp: Date.now() });
        
        return NextResponse.json({
          balance: 0,
          cached: false,
          warning: "Invalid balance value detected, using 0 as fallback"
        });
      }

      // Cache the result
      balanceCache.set(userEmail, { balance, timestamp: Date.now() });

      // Log response for debugging
      console.log(`📤 Sending balance response: ${balance}`);
      
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
