import { google } from 'googleapis';

// Google Sheets configuration
const SPREADSHEET_ID = '1TOKHwtD13QAiQXXB5T_WkARkmT-LonO5s-BjWhj9okA';
const RANGE = 'Trang tính1!A:K'; // Read all columns A to K

interface SheetTransaction {
  bank: string; // Column A
  date: string; // Column B
  accountNumber: string; // Column C
  accountHolder: string; // Column D
  code: string; // Column E
  description: string; // Column F - Nội dung thanh toán
  type: string; // Column G
  amount: number; // Column H - Số tiền
  reference: string; // Column I
  balance: number; // Column J
}

// Primary method using CSV export (works without API key for public sheets)
export async function getSheetDataFromCSV(): Promise<SheetTransaction[]> {
  try {
    // Google Sheets can be exported as CSV using this URL format
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`;

    console.log('Fetching transaction data from Google Sheets...');
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV data: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = csvText.split('\n').map((row) => {
      // Handle CSV parsing with quoted fields
      const fields: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim());

      return fields;
    });

    const transactions: SheetTransaction[] = [];

    // Skip header row and process data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Skip empty rows
      if (!row[0] || row[0].trim() === '') continue;

      // Ensure we have minimum required data
      if (row[0] && row[5] && row[7]) {
        try {
          const amount = parseFloat(row[7]?.replace(/[^\d.-]/g, '') || '0');
          const balance = parseFloat(row[9]?.replace(/[^\d.-]/g, '') || '0');

          transactions.push({
            bank: row[0]?.trim() || '',
            date: row[1]?.trim() || '',
            accountNumber: row[2]?.trim() || '',
            accountHolder: row[3]?.trim() || '',
            code: row[4]?.trim() || '',
            description: row[5]?.trim() || '', // Column F - Nội dung thanh toán
            type: row[6]?.trim() || '',
            amount: amount, // Column H - Số tiền
            reference: row[8]?.trim() || '',
            balance: balance,
          });
        } catch (error) {
          console.warn('Error parsing row:', i, row, error);
        }
      }
    }

    console.log(`✅ Loaded ${transactions.length} transactions from Google Sheets`);
    return transactions;
  } catch (error) {
    console.error('Error reading CSV data:', error);
    return [];
  }
}

export async function findTransactionByCode(
  transactionCode: string,
): Promise<SheetTransaction | null> {
  try {
    console.log(`🔍 Searching for transaction code: ${transactionCode}`);
    const transactions = await getSheetDataFromCSV();

    // Search for transaction code in description field (Column F)
    const foundTransaction = transactions.find((transaction) => {
      const includesCode = transaction.description.includes(transactionCode);
      const isIncoming = transaction.type === 'Tiền vào';

      console.log(
        `Checking transaction: ${transaction.description} | Type: ${transaction.type} | Includes code: ${includesCode} | Is incoming: ${isIncoming}`,
      );

      return includesCode && isIncoming;
    });

    if (foundTransaction) {
      console.log(`✅ Found transaction:`, foundTransaction);
    } else {
      console.log(`❌ Transaction not found for code: ${transactionCode}`);
    }

    return foundTransaction || null;
  } catch (error) {
    console.error('Error finding transaction:', error);
    return null;
  }
}

// Fallback method using Google Sheets API (requires API key)
export async function getGoogleSheetsData(): Promise<SheetTransaction[]> {
  try {
    // This method requires GOOGLE_SHEETS_API_KEY environment variable
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    if (!apiKey) {
      console.log('No Google Sheets API key found, using CSV method instead');
      return getSheetDataFromCSV();
    }

    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      key: apiKey,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and convert to objects
    const transactions: SheetTransaction[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[1] && row[5] && row[7]) {
        transactions.push({
          bank: row[0] || '',
          date: row[1] || '',
          accountNumber: row[2] || '',
          accountHolder: row[3] || '',
          code: row[4] || '',
          description: row[5] || '',
          type: row[6] || '',
          amount: parseFloat(row[7]) || 0,
          reference: row[8] || '',
          balance: parseFloat(row[9]) || 0,
        });
      }
    }

    return transactions;
  } catch (error) {
    console.error('Error reading Google Sheets via API:', error);

    // Fallback to CSV method
    return getSheetDataFromCSV();
  }
}
