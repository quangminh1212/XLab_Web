import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncUserBalance } from '@/lib/userService';

// Balance cache với timeout giảm xuống để tăng tính realtime
const balanceCache = new Map<string, { balance: number; timestamp: number }>();
const CACHE_TIMEOUT = 15 * 1000; // 15 seconds (giảm xuống còn 15s từ 30s)

// Flag để track API calls đang xử lý
const pendingRequests = new Map<string, boolean>();

// Cleanup cache mỗi 5 phút để tránh memory leak
setInterval(
  () => {
    const now = Date.now();
    balanceCache.forEach((cache, email) => {
      if (now - cache.timestamp > CACHE_TIMEOUT * 2) {
        // Remove after double the cache timeout
        balanceCache.delete(email);
      }
    });

    // Clear any stuck pending requests
    pendingRequests.forEach((pending, key) => {
      // Clear any request pending for more than 30 seconds
      if (pendingRequests.get(key)) {
        pendingRequests.delete(key);
      }
    });
  },
  5 * 60 * 1000, // 5 minutes
);

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
    const requestId = `${userEmail}-${Date.now()}`;

    // Thêm timeout để đảm bảo không bị mắc kẹt
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        // Trả về balance cached nếu request bị timeout
        const cached = balanceCache.get(userEmail);
        if (cached) {
          console.log(`⏰ Balance request timed out for ${userEmail}, using cached value`);
          pendingRequests.delete(requestId);
          reject(new Error('Balance request timed out'));
        }
      }, 5000); // 5 seconds timeout
    });

    // Check cache first if not forced to refresh
    const cached = balanceCache.get(userEmail);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
      return NextResponse.json({
        balance: Number(cached.balance) || 0,
        cached: true,
      });
    }

    // Nếu có request đang xử lý cho user này, trả về cached value để tránh overload
    if (pendingRequests.get(userEmail) && !forceRefresh) {
      console.log(`⚠️ Already processing balance request for ${userEmail}, using cached value`);
      return NextResponse.json({
        balance: cached ? Number(cached.balance) : 0,
        cached: true,
      });
    }

    // Đánh dấu là đang xử lý request
    pendingRequests.set(userEmail, true);

    try {
      // Race giữa thực tế fetch và timeout
      try {
        // Get synchronized balance from both systems
        let balance = await Promise.race([
          syncUserBalance(userEmail),
          timeoutPromise
        ]) as number;
        
        // Ensure balance is a number
        balance = Number(balance) || 0;

        // Cache the result
        balanceCache.set(userEmail, { balance, timestamp: Date.now() });
        
        console.log(`Balance API: Retrieved balance for ${userEmail}: ${balance}`);

        // Xóa flag đánh dấu xử lý
        pendingRequests.delete(userEmail);

        return NextResponse.json({
          balance: balance,
          cached: false,
        });
      } catch (timeoutError) {
        // Nếu timeout, dùng cached value
        const cachedFallback = balanceCache.get(userEmail);
        return NextResponse.json({
          balance: cachedFallback ? cachedFallback.balance : 0,
          cached: true,
          timeout: true
        });
      }
    } catch (syncError) {
      console.error('Error syncing user balance:', syncError);
      
      // Xóa flag đánh dấu xử lý
      pendingRequests.delete(userEmail);

      // Vẫn trả về cached value nếu có lỗi
      const cachedFallback = balanceCache.get(userEmail);

      return NextResponse.json(
        { 
          error: 'Balance Sync Error', 
          message: syncError instanceof Error ? syncError.message : 'Failed to sync user balance',
          details: process.env.NODE_ENV === 'development' ? syncError : undefined,
          balance: cachedFallback ? cachedFallback.balance : 0
        }, 
        { status: syncError instanceof Error ? 500 : 200 }
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
