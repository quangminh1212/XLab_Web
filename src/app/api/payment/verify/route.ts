import { NextRequest, NextResponse } from 'next/server';

import { findTransactionByCode, getSheetDataFromCSV } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const code = url.searchParams.get('code') || url.searchParams.get('transactionId');
    const amountParam = url.searchParams.get('amount');

    // Compatibility-only endpoint for development/testing
    if (action !== 'test-excel') {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ error: 'Missing transaction code' }, { status: 400 });
    }

    const expectedAmount = amountParam ? Number(amountParam) : undefined;

    // Try via API helper first
    let sheetTransaction = await findTransactionByCode(code);

    // Fallback to CSV method if not found
    if (!sheetTransaction) {
      const all = await getSheetDataFromCSV();
      sheetTransaction =
        all.find(
          (t: any) => typeof t?.description === 'string' && t.description.includes(code) && t?.type === 'Tiền vào',
        ) || null;
    }

    if (sheetTransaction) {
      const isValidAmount =
        expectedAmount == null || Math.abs(Number(sheetTransaction.amount) - expectedAmount) < 1; // allow 1 VND diff

      if (isValidAmount) {
        return NextResponse.json({
          success: true,
          transaction: {
            id: code,
            amount: Number(sheetTransaction.amount),
            type: 'deposit',
            method: 'bank_transfer',
            status: 'completed',
            description: sheetTransaction.description,
            createdAt: new Date(sheetTransaction.date).toISOString(),
            verifiedAt: new Date().toISOString(),
          },
        });
      }
    }

    return NextResponse.json({
      success: false,
      status: 'pending',
      message: 'Giao dịch chưa được tìm thấy hoặc đang chờ xử lý. Vui lòng đợi vài phút và thử lại.',
    });
  } catch (error) {
    console.error('Error in /api/payment/verify:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

