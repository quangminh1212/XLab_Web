import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getUserData } from '@/lib/userDataManager';
import fs from 'fs/promises';
import path from 'path';

// User balance interface
interface UserBalance {
  [email: string]: number;
}

// Function to get user balance from file
const getUserBalance = async (userEmail: string): Promise<number> => {
  try {
    const balancePath = path.join(process.cwd(), 'data', 'balances.json');
    
    try {
      const balanceData = await fs.readFile(balancePath, 'utf-8');
      const balances: UserBalance = JSON.parse(balanceData);
      return balances[userEmail] || 0;
    } catch (error) {
      // File doesn't exist, return 0
      return 0;
    }
  } catch (error) {
    console.error('Error reading balance:', error);
    return 0;
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get balance from secure user data first, fallback to old system
    const userData = await getUserData(session.user.email);
    let balance = 0;
    
    if (userData) {
      balance = userData.profile.balance;
    } else {
      // Fallback to old balance system
      balance = await getUserBalance(session.user.email);
    }

    return NextResponse.json({
      balance: balance
    });
    
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 