import { NextRequest, NextResponse } from 'next/server';
import { getSheetDataFromCSV } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Test Google Sheets API called');

    const transactions = await getSheetDataFromCSV();

    console.log(`📈 Successfully loaded ${transactions.length} transactions`);

    return NextResponse.json({
      success: true,
      count: transactions.length,
      transactions,
      message: `Loaded ${transactions.length} transactions from Google Sheets`,
    });
  } catch (error) {
    console.error('❌ Error in test-sheets API:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch data from Google Sheets',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
