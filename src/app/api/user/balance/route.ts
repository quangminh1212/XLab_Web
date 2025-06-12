import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncUserBalance } from '@/lib/userService';

// Balance cache với timeout 2 phút để giảm spam requests
const balanceCache = new Map<string, { balance: number; timestamp: number }>();
const CACHE_TIMEOUT = 120 * 1000; // 120 seconds (2 minutes)
const API_TIMEOUT = 8000; // 8 seconds timeout
const DEBUG_MODE = true; // Enable debug mode

// Debug logger
function logDebug(message: string, data?: any) {
  if (DEBUG_MODE) {
    console.log(`[API:balance] ${message}`, data || '');
  }
}

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

// Helper function để xử lý timeout cho promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout after ${timeoutMs}ms: ${errorMessage}`));
    }, timeoutMs);
    
    promise
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

export async function GET() {
  const startTime = Date.now();
  logDebug('GET /api/user/balance request received');
  
  try {
    // Check authentication
    const sessionPromise = getServerSession(authOptions);
    let session;
    
    try {
      logDebug('Fetching session');
      session = await withTimeout(
        sessionPromise,
        API_TIMEOUT / 2,
        'Session fetch timeout'
      );
      logDebug('Session fetched', { user: session?.user?.email || 'none' });
    } catch (sessionError) {
      logDebug('Session fetch error', sessionError);
      return NextResponse.json(
        { 
          error: 'Session Error', 
          message: 'Failed to validate your session',
          details: sessionError instanceof Error ? sessionError.message : 'Unknown session error'
        }, 
        { status: 401 }
      );
    }

    if (!session || !session.user || !session.user.email) {
      logDebug('Unauthorized - no valid session');
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          message: 'You need to log in to access this resource' 
        }, 
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    logDebug(`Authorized user: ${userEmail}`);

    // Check cache first
    const cached = balanceCache.get(userEmail);
    if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
      logDebug(`Returning cached balance for ${userEmail}`, { balance: cached.balance });
      return NextResponse.json({
        balance: cached.balance,
        cached: true,
      });
    }

    try {
      // Get synchronized balance from both systems with timeout
      logDebug(`Syncing balance for ${userEmail}`);
      const balance = await withTimeout(
        syncUserBalance(userEmail),
        API_TIMEOUT,
        'Balance sync operation timed out'
      );
      logDebug(`Balance sync completed for ${userEmail}`, { balance });

      // Cache the result
      balanceCache.set(userEmail, { balance, timestamp: Date.now() });

      const responseTime = Date.now() - startTime;
      logDebug(`Returning fresh balance, response time: ${responseTime}ms`);
      
      return NextResponse.json({
        balance: balance,
        cached: false,
        responseTime
      });
    } catch (syncError) {
      console.error('Error syncing user balance:', syncError);
      logDebug(`Balance sync error for ${userEmail}`, syncError);
      
      // Nếu có cache cũ, trả về cache và thông báo lỗi
      if (cached) {
        logDebug(`Returning stale cache for ${userEmail} due to sync error`);
        return NextResponse.json({
          balance: cached.balance,
          cached: true,
          stale: true,
          syncError: syncError instanceof Error ? syncError.message : 'Failed to sync user balance'
        });
      }
      
      // Trả về lỗi chi tiết hơn để debug
      const errorDetail = {
        message: syncError instanceof Error ? syncError.message : 'Failed to sync user balance',
        stack: syncError instanceof Error ? syncError.stack : undefined,
        name: syncError instanceof Error ? syncError.name : 'Unknown',
        time: new Date().toISOString(),
        email: userEmail
      };
      
      logDebug('Detailed sync error', errorDetail);
      
      return NextResponse.json(
        { 
          error: 'Balance Sync Error', 
          message: errorDetail.message,
          details: process.env.NODE_ENV === 'development' ? errorDetail : undefined
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching user balance:', error);
    logDebug('Unexpected error in balance API', error);
    
    // Trả về lỗi chi tiết hơn để debug
    const errorDetail = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown',
      time: new Date().toISOString()
    };
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        message: errorDetail.message,
        details: process.env.NODE_ENV === 'development' ? errorDetail : undefined
      }, 
      { status: 500 }
    );
  }
}
