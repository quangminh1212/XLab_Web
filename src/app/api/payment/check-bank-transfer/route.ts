import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock bank API - In production, integrate with real bank APIs
interface BankTransaction {
  transactionId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  description: string;
}

// Mock database of completed transactions
const mockCompletedTransactions: Record<string, BankTransaction> = {};

// Mock function to simulate bank API response
const checkBankTransaction = async (
  transactionId: string,
  amount: number,
  bankCode: string,
  accountNumber: string
): Promise<BankTransaction | null> => {
  // In production, this would call actual bank APIs
  // For demo purposes, we'll simulate a random success after some time
  
  // Check if transaction already exists
  if (mockCompletedTransactions[transactionId]) {
    return mockCompletedTransactions[transactionId];
  }

  // Simulate random transaction completion (10% chance each check)
  const isCompleted = Math.random() < 0.1;
  
  if (isCompleted) {
    const transaction: BankTransaction = {
      transactionId,
      amount,
      status: 'completed',
      timestamp: new Date(),
      description: `Nạp tiền qua chuyển khoản ${bankCode}`
    };
    
    mockCompletedTransactions[transactionId] = transaction;
    return transaction;
  }

  return null;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { transactionId, amount, bankCode, accountNumber } = await request.json();

    if (!transactionId || !amount || !bankCode || !accountNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check bank transaction status
    const bankTransaction = await checkBankTransaction(
      transactionId,
      amount,
      bankCode,
      accountNumber
    );

    if (bankTransaction && bankTransaction.status === 'completed') {
      // Transaction completed - update user balance
      try {
        // In production, update database here
        console.log(`Processing deposit for user ${session.user.email}:`, {
          amount,
          transactionId,
          method: 'bank_transfer'
        });

        // Mock successful balance update
        return NextResponse.json({
          success: true,
          transaction: {
            id: transactionId,
            amount,
            type: 'deposit',
            method: 'bank_transfer',
            status: 'completed',
            description: `Nạp tiền qua chuyển khoản ${bankCode}`,
            createdAt: bankTransaction.timestamp.toISOString()
          }
        });

      } catch (error) {
        console.error('Error updating balance:', error);
        return NextResponse.json(
          { error: 'Failed to update balance' },
          { status: 500 }
        );
      }
    }

    // Transaction not found or still pending
    return NextResponse.json({
      success: false,
      status: 'pending',
      message: 'Transaction not found or still pending'
    });

  } catch (error) {
    console.error('Error checking bank transfer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 