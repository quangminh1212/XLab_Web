import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncUserBalance } from '@/lib/userService';

// Cải thiện balance cache với thời gian giữ ngắn hơn
const balanceCache = new Map<string, { balance: number; timestamp: number }>();
const CACHE_TIMEOUT = 60 * 1000; // 60 seconds (1 minute)
const MIN_CACHE_TIMEOUT = 5 * 1000; // 5 seconds - thời gian tối thiểu giữa các request

// Cleanup cache mỗi 5 phút
setInterval(
  () => {
    const now = Date.now();
    balanceCache.forEach((cache, email) => {
      if (now - cache.timestamp > CACHE_TIMEOUT * 2) {
        // Remove after 2 minutes
        balanceCache.delete(email);
      }
    });
  },
  5 * 60 * 1000, // 5 minutes
);

export async function GET() {
  try {
    // Performance timer
    const startTime = Date.now();

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

    // Check cache first - always return cache if available
    const cached = balanceCache.get(userEmail);
    const now = Date.now();
    
    // Return cache immediately if less than MIN_CACHE_TIMEOUT has passed
    if (cached && now - cached.timestamp < MIN_CACHE_TIMEOUT) {
      return NextResponse.json({
        balance: cached.balance,
        cached: true,
        timestamp: cached.timestamp,
        responseTime: Date.now() - startTime,
      });
    }
    
    // Return cache and refresh in background if less than CACHE_TIMEOUT has passed
    if (cached && now - cached.timestamp < CACHE_TIMEOUT) {
      // Trigger background sync if cache is older than 30 seconds
      if (now - cached.timestamp > 30 * 1000) {
        // Don't await - let it run in the background
        syncUserBalance(userEmail)
          .then((newBalance) => {
            balanceCache.set(userEmail, { balance: newBalance, timestamp: Date.now() });
          })
          .catch((error) => {
            console.error(`Background balance sync failed for ${userEmail}:`, error);
          });
      }
      
      return NextResponse.json({
        balance: cached.balance,
        cached: true,
        timestamp: cached.timestamp,
        responseTime: Date.now() - startTime,
      });
    }

    try {
      // Use timeout to prevent hanging requests
      const timeoutPromise = new Promise<number>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Balance sync timed out after 5 seconds'));
        }, 5000);
      });
      
      // Get synchronized balance from both systems
      const balancePromise = syncUserBalance(userEmail);
      
      // Race between timeout and actual balance fetch
      const balance = await Promise.race([balancePromise, timeoutPromise]);

      // Cache the result
      balanceCache.set(userEmail, { balance, timestamp: now });

      return NextResponse.json({
        balance: balance,
        cached: false,
        responseTime: Date.now() - startTime,
      });
    } catch (syncError) {
      console.error('Error syncing user balance:', syncError);
      
      // Return cached data if available, even if expired
      if (cached) {
        return NextResponse.json({
          balance: cached.balance,
          cached: true,
          stale: true,
          error: 'Using stale cache due to sync error',
          timestamp: cached.timestamp,
          responseTime: Date.now() - startTime,
        });
      }
      
      return NextResponse.json(
        { 
          error: 'Balance Sync Error', 
          message: syncError instanceof Error ? syncError.message : 'Failed to sync user balance',
          responseTime: Date.now() - startTime,
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
      }, 
      { status: 500 }
    );
  }
}
