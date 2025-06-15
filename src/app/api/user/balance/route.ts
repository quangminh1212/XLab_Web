import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncUserBalance } from '@/lib/userService';

// Balance cache với timeout giảm xuống để tăng tính realtime
const balanceCache = new Map<string, { balance: number; timestamp: number }>();
const CACHE_TIMEOUT = 10 * 1000; // 10 seconds (giảm xuống còn 10s)

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
    const forceRefresh = url.searchParams.has('t') || url.searchParams.has('force');
    
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
    
    console.log(`📊 Balance request for ${userEmail}, force=${forceRefresh}`);

    // Đảm bảo lấy được số dư ngay lập tức
    try {
      // Check cache first if not forced to refresh
      const cached = balanceCache.get(userEmail);
      if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
        console.log(`📊 Using cached balance for ${userEmail}: ${cached.balance}`);
        return NextResponse.json({
          balance: Number(cached.balance) || 0,
          cached: true,
        });
      }

      // Get synchronized balance directly (simplified for speed)
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
    } catch (error) {
      console.error('Error fetching user balance:', error);
      
      // Vẫn trả về cached value nếu có lỗi
      const cachedFallback = balanceCache.get(userEmail);

      return NextResponse.json(
        { 
          balance: cachedFallback ? cachedFallback.balance : 0,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          cached: !!cachedFallback,
        }, 
        { status: 200 } // Vẫn trả về 200 để UI có thể hiển thị
      );
    }
  } catch (error) {
    console.error('Error in balance API:', error);
    return NextResponse.json(
      { 
        balance: 0,
        error: 'Internal Server Error', 
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      }, 
      { status: 200 } // Vẫn trả về 200 để UI có thể hiển thị
    );
  }
}
