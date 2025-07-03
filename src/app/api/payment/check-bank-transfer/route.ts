import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { findTransactionByCode, getSheetDataFromCSV } from '@/lib/googleSheets';
import fs from 'fs/promises';
import path from 'path';

// Real bank transaction verification using Google Sheets

// Set this route to be dynamically rendered at request time
export const dynamic = "force-dynamic";

interface BankTransaction {
  transactionId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  description: string;
}

// User balance interface
interface UserBalance {
  [email: string]: number;
}

// Cache to avoid repeated verification of same transaction
const verifiedTransactions: Record<string, BankTransaction> = {};
// CLEAR CACHE FOR TESTING - Remove this line in production
const processedTransactions: Set<string> = new Set(); // Tránh xử lý lặp lại

// Function to get user balance
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

// Function to update user balance
const updateUserBalance = async (userEmail: string, amount: number): Promise<number> => {
  try {
    const balancePath = path.join(process.cwd(), 'data', 'balances.json');
    const dataDir = path.dirname(balancePath);

    // Ensure data directory exists
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    let balances: UserBalance = {};

    // Read existing balances
    try {
      const balanceData = await fs.readFile(balancePath, 'utf-8');
      balances = JSON.parse(balanceData);
    } catch (error) {
      // File doesn't exist, start with empty object
      balances = {};
    }

    // Update balance
    const currentBalance = balances[userEmail] || 0;
    const newBalance = currentBalance + amount;
    balances[userEmail] = newBalance;

    // Write back to file
    await fs.writeFile(balancePath, JSON.stringify(balances, null, 2));

    console.log(
      `💰 Balance updated for ${userEmail}: ${currentBalance} + ${amount} = ${newBalance}`,
    );
    return newBalance;
  } catch (error) {
    console.error('Error updating balance:', error);
    throw error;
  }
};

// Function to check bank transaction from Google Sheets
const checkBankTransaction = async (
  transactionId: string,
  expectedAmount?: number,
  bankCode?: string,
  accountNumber?: string,
): Promise<BankTransaction | null> => {
  try {
    // Check if already verified
    if (verifiedTransactions[transactionId]) {
      return verifiedTransactions[transactionId];
    }

    // Try to find transaction in Google Sheets
    let sheetTransaction = await findTransactionByCode(transactionId);

    // If API method fails, try CSV method as fallback
    if (!sheetTransaction) {
      console.log('Trying CSV method as fallback...');
      const allTransactions = await getSheetDataFromCSV();
      sheetTransaction =
        allTransactions.find(
          (transaction) =>
            transaction.description.includes(transactionId) && transaction.type === 'Tiền vào',
        ) || null;
    }

    if (sheetTransaction) {
      // Verify transaction details
      const isValidAccount = !accountNumber || sheetTransaction.accountNumber === accountNumber;
      const isValidAmount =
        !expectedAmount || Math.abs(sheetTransaction.amount - expectedAmount) < 1; // Allow 1 VND difference

      if (isValidAccount && isValidAmount) {
        const verifiedTransaction: BankTransaction = {
          transactionId,
          amount: sheetTransaction.amount,
          status: 'completed',
          timestamp: new Date(sheetTransaction.date),
          description: sheetTransaction.description,
        };

        // Cache the verified transaction
        verifiedTransactions[transactionId] = verifiedTransaction;

        return verifiedTransaction;
      } else {
        console.log('Transaction found but validation failed:', {
          expectedAmount,
          actualAmount: sheetTransaction.amount,
          expectedAccount: accountNumber,
          actualAccount: sheetTransaction.accountNumber,
        });
      }
    }

    return null;
  } catch (error) {
    console.error('Error checking bank transaction:', error);
    return null;
  }
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId, amount, bankCode, accountNumber } = await request.json();

    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }

    console.log('Checking transaction:', {
      transactionId,
      amount,
      bankCode,
      accountNumber,
      userEmail: session.user.email,
    });

    // Check bank transaction status from Google Sheets
    const bankTransaction = await checkBankTransaction(
      transactionId,
      amount,
      bankCode,
      accountNumber,
    );

    console.log('🔍 Bank transaction result:', {
      found: !!bankTransaction,
      transaction: bankTransaction,
      alreadyProcessed: processedTransactions.has(transactionId),
    });

    if (bankTransaction && bankTransaction.status === 'completed') {
      // Transaction found and verified
      console.log(`✅ Transaction verified for user ${session.user.email}:`, {
        transactionId,
        amount: bankTransaction.amount,
        description: bankTransaction.description,
        timestamp: bankTransaction.timestamp,
      });

      // Auto-add money to account if not already processed
      if (!processedTransactions.has(transactionId)) {
        try {
          const newBalance = await updateUserBalance(session.user.email, bankTransaction.amount);
          processedTransactions.add(transactionId); // Mark as processed

          console.log(
            `🎉 Auto-deposited ${bankTransaction.amount} VND to ${session.user.email}, new balance: ${newBalance}`,
          );
        } catch (error) {
          console.error('Error auto-depositing funds:', error);
          // Continue with response even if balance update fails
        }
      }

      return NextResponse.json({
        success: true,
        transaction: {
          id: transactionId,
          amount: bankTransaction.amount,
          type: 'deposit',
          method: 'bank_transfer',
          status: 'completed',
          description: bankTransaction.description,
          createdAt: bankTransaction.timestamp.toISOString(),
          verifiedAt: new Date().toISOString(),
        },
      });
    }

    // Transaction not found or validation failed
    console.log(`❌ Transaction not found or validation failed: ${transactionId}`);
    return NextResponse.json({
      success: false,
      status: 'pending',
      message:
        'Giao dịch chưa được tìm thấy hoặc đang chờ xử lý. Vui lòng đợi vài phút và thử lại.',
    });
  } catch (error) {
    console.error('Error checking bank transfer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
