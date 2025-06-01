import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncUserBalance } from '@/lib/userService';

// Balance cache với timeout 60s để giảm spam requests
const balanceCache = new Map<string, { balance: number; timestamp: number }>();
const CACHE_TIMEOUT = 60 * 1000; // 60 seconds

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Check cache first
    const cached = balanceCache.get(userEmail);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TIMEOUT) {
      return NextResponse.json({
        balance: cached.balance,
        cached: true
      });
    }

    // Get synchronized balance from both systems
    const balance = await syncUserBalance(userEmail);
    
    // Cache the result
    balanceCache.set(userEmail, { balance, timestamp: Date.now() });

    return NextResponse.json({
      balance: balance,
      cached: false
    });
    
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 