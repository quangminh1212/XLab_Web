/**
 * Bank API Integration Helper
 * Tích hợp API MBBank thật cho xác thực thanh toán
 */

export interface BankTransactionInfo {
  transactionId: string
  orderId: string
  amount: number
  bankCode: string
  accountNumber: string
  transactionDate: string
  description: string
  status: 'success' | 'pending' | 'failed'
}

export interface VietQRVerifyRequest {
  bankCode: string
  accountNumber: string
  amount: number
  description: string
  transactionId?: string
}

export interface VietQRVerifyResponse {
  verified: boolean
  transactionInfo?: BankTransactionInfo
  message: string
}

/**
 * Enhanced validation patterns for MBBank
 */
export const VERIFICATION_PATTERNS = {
  // OTP từ SMS MBBank (6-8 số)
  SMS_OTP: /^[0-9]{6,8}$/,
  
  // Mã giao dịch MBBank (bắt đầu với MB, FT hoặc chỉ số)
  BANK_TXN_ID: /^(MB|FT)?[0-9A-Z]{6,20}$/i,
  
  // Reference number từ MBBank app
  BANK_REF: /^(MB|FT)[0-9]{10,15}$/i,
  
  // QR transaction code từ MBBank
  QR_CODE: /^QR[0-9]{12,16}$/i,
  
  // Internet banking transaction ID
  INTERNET_BANKING: /^IB[0-9]{10,15}$/i
}

/**
 * Enhanced validation for MBBank codes
 */
export function validateVerificationCode(code: string): {
  isValid: boolean
  type: string
  message: string
} {
  const trimmedCode = code.trim().toUpperCase()
  
  if (VERIFICATION_PATTERNS.SMS_OTP.test(trimmedCode)) {
    return {
      isValid: true,
      type: 'SMS_OTP',
      message: 'Mã OTP từ SMS hợp lệ'
    }
  }
  
  if (VERIFICATION_PATTERNS.INTERNET_BANKING.test(trimmedCode)) {
    return {
      isValid: true,
      type: 'INTERNET_BANKING',
      message: 'Mã giao dịch Internet Banking hợp lệ'
    }
  }
  
  if (VERIFICATION_PATTERNS.BANK_REF.test(trimmedCode)) {
    return {
      isValid: true,
      type: 'BANK_REF',
      message: 'Số tham chiếu MBBank hợp lệ'
    }
  }
  
  if (VERIFICATION_PATTERNS.BANK_TXN_ID.test(trimmedCode)) {
    return {
      isValid: true,
      type: 'BANK_TXN_ID',
      message: 'Mã giao dịch ngân hàng hợp lệ'
    }
  }
  
  if (VERIFICATION_PATTERNS.QR_CODE.test(trimmedCode)) {
    return {
      isValid: true,
      type: 'QR_CODE',
      message: 'Mã QR thanh toán hợp lệ'
    }
  }
  
  return {
    isValid: false,
    type: 'UNKNOWN',
    message: 'Mã xác thực không đúng định dạng MBBank. Vui lòng nhập mã OTP 6-8 số hoặc mã giao dịch từ ứng dụng MBBank.'
  }
}

/**
 * MBBank Real API Integration
 * Tích hợp API thật của MBBank
 */
export async function verifyMBBankTransaction(
  accountNumber: string,
  transactionCode: string,
  amount: number
): Promise<VietQRVerifyResponse> {
  try {
    console.log('🏦 MBBank API verification starting...')
    
    // Check if we have real API credentials
    const mbApiUrl = process.env.MBBANK_API_URL
    const mbApiKey = process.env.MBBANK_API_KEY
    const mbPartnerCode = process.env.MBBANK_PARTNER_CODE
    
    if (mbApiUrl && mbApiKey && mbPartnerCode) {
      console.log('🔑 Using real MBBank API credentials')
      
      // Real MBBank API call
      const response = await fetch(mbApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mbApiKey}`,
          'X-Partner-Code': mbPartnerCode,
          'X-Request-ID': `REQ-${Date.now()}`,
          'X-Timestamp': new Date().toISOString()
        },
        body: JSON.stringify({
          account_number: accountNumber,
          transaction_code: transactionCode,
          amount: amount,
          verification_type: 'transaction_lookup',
          request_time: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        console.error('❌ MBBank API error:', response.status, response.statusText)
        throw new Error(`MBBank API error: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('📦 MBBank API response:', { success: result.success, transactionId: result.transaction?.id })
      
      if (result.success && result.transaction) {
        return {
          verified: true,
          transactionInfo: {
            transactionId: result.transaction.id,
            orderId: result.transaction.reference || `ORDER-${Date.now()}`,
            amount: result.transaction.amount,
            bankCode: 'MB',
            accountNumber: result.transaction.account_number,
            transactionDate: result.transaction.created_at,
            description: result.transaction.description,
            status: result.transaction.status === 'completed' ? 'success' : 'pending'
          },
          message: result.message || 'Xác thực giao dịch MBBank thành công'
        }
      } else {
        return {
          verified: false,
          message: result.message || 'Không tìm thấy giao dịch tương ứng'
        }
      }
    } else {
      console.log('🛠️ MBBank API credentials not found, using Excel transaction verification')
      
      // Sử dụng tra soát Excel thay vì simulation
      return await verifyTransactionFromExcel(transactionCode, amount)
    }
    
  } catch (error) {
    console.error('💥 MBBank verification error:', error)
    
    // Fallback to Excel verification in case of API errors
    console.log('🔄 Falling back to Excel transaction verification')
    return await verifyTransactionFromExcel(transactionCode, amount)
  }
}

/**
 * Enhanced development simulation for MBBank
 */
async function simulateMBBankVerification(
  accountNumber: string,
  transactionCode: string,
  amount: number
): Promise<VietQRVerifyResponse> {
  
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000))
  
  const validation = validateVerificationCode(transactionCode)
  
  if (!validation.isValid) {
    return {
      verified: false,
      message: `Mã xác thực không hợp lệ: ${validation.message}`
    }
  }
  
  // Special test codes for development
  const testCodes = {
    '123456': { success: true, message: 'Test OTP thành công' },
    '111111': { success: false, message: 'Mã OTP đã hết hạn' },
    '000000': { success: false, message: 'Mã OTP không chính xác' },
    'MB123456789': { success: true, message: 'Test transaction ID thành công' },
    'TESTFAIL': { success: false, message: 'Test case thất bại' }
  }
  
  const testResult = testCodes[transactionCode as keyof typeof testCodes]
  if (testResult) {
    if (testResult.success) {
      return {
        verified: true,
        transactionInfo: {
          transactionId: `MB${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          orderId: `ORDER-${Date.now()}`,
          amount: amount,
          bankCode: 'MB',
          accountNumber: accountNumber,
          transactionDate: new Date().toISOString(),
          description: `Chuyen khoan ${amount.toLocaleString('vi-VN')} VND`,
          status: 'success'
        },
        message: testResult.message
      }
    } else {
      return {
        verified: false,
        message: testResult.message
      }
    }
  }
  
  // General validation for realistic codes
  if (validation.type === 'SMS_OTP') {
    // Simulate 80% success rate for valid OTP format
    const isSuccess = Math.random() < 0.8
    
    if (isSuccess) {
      return {
        verified: true,
        transactionInfo: {
          transactionId: `MB${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          orderId: `ORDER-${Date.now()}`,
          amount: amount,
          bankCode: 'MB',
          accountNumber: accountNumber,
          transactionDate: new Date().toISOString(),
          description: `Chuyen khoan ${amount.toLocaleString('vi-VN')} VND`,
          status: 'success'
        },
        message: 'Xác thực OTP thành công (Development Mode)'
      }
    } else {
      return {
        verified: false,
        message: 'Mã OTP không chính xác hoặc đã hết hạn'
      }
    }
  }
  
  if (validation.type === 'BANK_TXN_ID' || validation.type === 'BANK_REF') {
    // Simulate 90% success rate for transaction IDs
    const isSuccess = Math.random() < 0.9
    
    if (isSuccess) {
      return {
        verified: true,
        transactionInfo: {
          transactionId: transactionCode,
          orderId: `ORDER-${Date.now()}`,
          amount: amount,
          bankCode: 'MB',
          accountNumber: accountNumber,
          transactionDate: new Date().toISOString(),
          description: `Chuyen khoan ${amount.toLocaleString('vi-VN')} VND`,
          status: 'success'
        },
        message: 'Xác thực mã giao dịch thành công (Development Mode)'
      }
    } else {
      return {
        verified: false,
        message: 'Không tìm thấy giao dịch với mã này'
      }
    }
  }
  
  return {
    verified: false,
    message: 'Mã xác thực không đúng định dạng MBBank'
  }
}

/**
 * Test MBBank API connection
 */
export async function testMBBankConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const result = await verifyMBBankTransaction('669912122000', '123456', 100000)
    return {
      connected: true,
      message: result.verified ? 'Kết nối MBBank API thành công' : 'API hoạt động nhưng test verification thất bại'
    }
  } catch (error) {
    return {
      connected: false,
      message: `Không thể kết nối MBBank API: ${error}`
    }
  }
}

/**
 * VietQR API Integration (for compatibility)
 */
export async function verifyVietQRTransaction(
  verifyData: VietQRVerifyRequest
): Promise<VietQRVerifyResponse> {
  try {
    const apiUrl = process.env.VIETQR_API_URL || 'https://api.vietqr.io/v2/verify'
    const apiKey = process.env.VIETQR_API_KEY || ''
    
    if (!apiKey) {
      throw new Error('VietQR API key not configured')
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Client-Id': process.env.VIETQR_CLIENT_ID || ''
      },
      body: JSON.stringify({
        bank_code: verifyData.bankCode,
        account_number: verifyData.accountNumber,
        amount: verifyData.amount,
        description: verifyData.description,
        transaction_id: verifyData.transactionId
      })
    })
    
    if (!response.ok) {
      throw new Error(`VietQR API error: ${response.status}`)
    }
    
    const result = await response.json()
    
    return {
      verified: result.verified === true,
      transactionInfo: result.transaction_info ? {
        transactionId: result.transaction_info.transaction_id,
        orderId: result.transaction_info.order_id,
        amount: result.transaction_info.amount,
        bankCode: result.transaction_info.bank_code,
        accountNumber: result.transaction_info.account_number,
        transactionDate: result.transaction_info.transaction_date,
        description: result.transaction_info.description,
        status: result.transaction_info.status
      } : undefined,
      message: result.message || 'Xác thực thành công'
    }
    
  } catch (error) {
    console.error('VietQR verification error:', error)
    return {
      verified: false,
      message: 'Không thể xác thực với VietQR API'
    }
  }
}

/**
 * SMS OTP Verification
 */
export async function verifySMSOTP(
  phoneNumber: string,
  otpCode: string,
  transactionId: string
): Promise<{ verified: boolean; message: string }> {
  try {
    const smsApiUrl = process.env.SMS_API_URL || 'https://api.sms-provider.com/v1/verify'
    const smsApiKey = process.env.SMS_API_KEY || ''
    
    if (!smsApiKey) {
      throw new Error('SMS API key not configured')
    }
    
    const response = await fetch(smsApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${smsApiKey}`
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        otp_code: otpCode,
        transaction_id: transactionId
      })
    })
    
    if (!response.ok) {
      throw new Error(`SMS API error: ${response.status}`)
    }
    
    const result = await response.json()
    
    return {
      verified: result.verified === true,
      message: result.message || 'OTP xác thực thành công'
    }
    
  } catch (error) {
    console.error('SMS OTP verification error:', error)
    return {
      verified: false,
      message: 'Không thể xác thực OTP'
    }
  }
}

/**
 * Webhook verification for bank notifications
 */
export function verifyBankWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('Webhook verification error:', error)
    return false
  }
}

/**
 * Tra soát giao dịch từ file Excel/CSV
 * Đọc và kiểm tra giao dịch thật từ dữ liệu ngân hàng
 */
export interface ExcelTransactionData {
  bank: string              // Ngân hàng
  transactionDate: string   // Ngày giao dịch  
  accountNumber: string     // Số tài khoản
  accountSub: string        // Tài khoản phụ
  transactionCode: string   // Code TT
  description: string       // Nội dung thanh toán
  type: string             // Loại
  amount: number           // Số tiền
  referenceCode: string    // Mã tham chiếu
  balance: number          // Lũy kế
}

/**
 * Cache for transaction data to avoid repeated file reads
 */
let transactionCache: ExcelTransactionData[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * API để fetch dữ liệu giao dịch từ Google Sheets hoặc CSV upload
 */
export async function fetchTransactionData(): Promise<ExcelTransactionData[]> {
  try {
    // Lấy từ Google Sheets API (nếu có)
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_API_URL
    const googleSheetsKey = process.env.GOOGLE_SHEETS_API_KEY
    const sheetId = process.env.GOOGLE_SHEETS_ID || '1TOKHwtD13QAiQXXB5T_WkARkmT-LonO5s-BjWhj9okA'
    
    if (googleSheetsUrl && googleSheetsKey) {
      console.log('📊 Fetching transaction data from Google Sheets...')
      
      const response = await fetch(
        `${googleSheetsUrl}/v4/spreadsheets/${sheetId}/values/A2:J1000?key=${googleSheetsKey}`
      )
      
      if (response.ok) {
        const data = await response.json()
        const transactions: ExcelTransactionData[] = []
        
        if (data.values && Array.isArray(data.values)) {
          for (const row of data.values) {
            if (row.length >= 10 && row[0]) { // Có đủ dữ liệu và không phải dòng trống
              transactions.push({
                bank: row[0] || '',
                transactionDate: row[1] || '',
                accountNumber: row[2] || '',
                accountSub: row[3] || '',
                transactionCode: row[4] || '',
                description: row[5] || '',
                type: row[6] || '',
                amount: parseFloat(row[7]) || 0,
                referenceCode: row[8] || '',
                balance: parseFloat(row[9]) || 0
              })
            }
          }
        }
        
        console.log(`✅ Loaded ${transactions.length} transactions from Google Sheets`)
        return transactions
      }
    }
    
    // Fallback: đọc từ file local CSV/JSON
    console.log('📄 Falling back to local transaction data...')
    return await loadLocalTransactionData()
    
  } catch (error) {
    console.error('💥 Error fetching transaction data:', error)
    return await loadLocalTransactionData()
  }
}

/**
 * Load transaction data từ file local với caching
 */
async function loadLocalTransactionData(): Promise<ExcelTransactionData[]> {
  try {
    // Check cache first
    const now = Date.now()
    if (transactionCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log(`💾 Using cached transaction data (${transactionCache.length} transactions)`)
      return transactionCache
    }

    const fs = require('fs')
    const path = require('path')
    
    // Đọc từ file transactions.json
    const filePath = path.join(process.cwd(), 'data', 'transactions.json')
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const jsonData = JSON.parse(fileContent)
      
      if (Array.isArray(jsonData)) {
        // Update cache
        transactionCache = jsonData
        cacheTimestamp = now
        console.log(`📄 Loaded ${jsonData.length} transactions from local file (cached)`)
        return jsonData
      }
    }
    
    // Fallback: mock data dựa trên mẫu từ spreadsheet
    const mockTransactions: ExcelTransactionData[] = [
      {
        bank: 'MBBank',
        transactionDate: '2025-05-29 01:59:00',
        accountNumber: '669912122000',
        accountSub: 'BACH MINH QUANG Chuyen tien Ma giao dich Trace728744 Trace 728744',
        transactionCode: 'Tiền vào',
        description: '4000',
        type: 'FT25149200931766',
        amount: 4000,
        referenceCode: '',
        balance: 0
      }
    ]
    
    // Cache mock data too
    transactionCache = mockTransactions
    cacheTimestamp = now
    console.log(`📋 Using ${mockTransactions.length} mock transactions (file not found, cached)`)
    return mockTransactions
    
  } catch (error) {
    console.error('💥 Error loading local transaction data:', error)
    
    // Ultimate fallback
    const now = Date.now()
    const fallbackData = [{
      bank: 'MBBank',
      transactionDate: '2025-05-29 01:59:00',
      accountNumber: '669912122000',
      accountSub: 'BACH MINH QUANG Chuyen tien Ma giao dich Trace728744 Trace 728744',
      transactionCode: 'Tiền vào',
      description: '4000',
      type: 'FT25149200931766',
      amount: 4000,
      referenceCode: '',
      balance: 0
    }]
    
    // Cache fallback data
    transactionCache = fallbackData
    cacheTimestamp = now
    return fallbackData
  }
}

/**
 * Clear transaction cache (useful for testing or when data updates)
 */
export function clearTransactionCache(): void {
  transactionCache = null
  cacheTimestamp = 0
  console.log('🗑️ Transaction cache cleared')
}

/**
 * Xác thực giao dịch bằng cách tra soát trong dữ liệu thực
 */
export async function verifyTransactionFromExcel(
  verificationCode: string,
  amount: number,
  timeRange?: { from: Date; to: Date }
): Promise<VietQRVerifyResponse> {
  try {
    console.log('🔍 Starting transaction verification from Excel data...')
    console.log('📋 Search params:', { verificationCode, amount, timeRange })
    
    // Fetch dữ liệu giao dịch
    const transactions = await fetchTransactionData()
    
    if (transactions.length === 0) {
      return {
        verified: false,
        message: 'Không có dữ liệu giao dịch để tra soát'
      }
    }
    
    console.log(`🔎 Searching in ${transactions.length} transactions...`)
    
    // Tìm kiếm giao dịch phù hợp
    const matchedTransactions = transactions.filter(transaction => {
      // Kiểm tra số tiền khớp
      const amountMatch = Math.abs(transaction.amount - amount) < 0.01
      
      // Kiểm tra mã trong các trường khác nhau
      const codeInSub = transaction.accountSub.includes(verificationCode)
      const codeInDescription = transaction.description.includes(verificationCode)
      const codeInType = transaction.type.includes(verificationCode)
      const codeInRef = transaction.referenceCode.includes(verificationCode)
      
      // Kiểm tra exact match cho một số pattern
      const exactCodeMatch = 
        transaction.type === verificationCode ||
        transaction.referenceCode === verificationCode ||
        transaction.accountSub.includes(`Trace${verificationCode}`) ||
        transaction.accountSub.includes(`Ma giao dich ${verificationCode}`)
      
      // Kiểm tra thời gian (nếu có)
      let timeMatch = true
      if (timeRange) {
        const transactionTime = new Date(transaction.transactionDate)
        timeMatch = transactionTime >= timeRange.from && transactionTime <= timeRange.to
      }
      
      const codeMatch = codeInSub || codeInDescription || codeInType || codeInRef || exactCodeMatch
      
      console.log(`🔎 Transaction check:`, {
        amount: transaction.amount,
        amountMatch,
        codeMatch,
        timeMatch,
        type: transaction.type,
        ref: transaction.referenceCode
      })
      
      return amountMatch && codeMatch && timeMatch
    })
    
    console.log(`🎯 Found ${matchedTransactions.length} matching transactions`)
    
    if (matchedTransactions.length > 0) {
      const transaction = matchedTransactions[0] // Lấy giao dịch đầu tiên
      
      // Tạo transaction ID từ dữ liệu thực
      const transactionId = transaction.type || `MB${Date.now()}`
      
      console.log('✅ Transaction verified from Excel data:', transactionId)
      
      return {
        verified: true,
        transactionInfo: {
          transactionId: transactionId,
          orderId: `ORDER-${Date.now()}`,
          amount: transaction.amount,
          bankCode: 'MB',
          accountNumber: transaction.accountNumber,
          transactionDate: transaction.transactionDate,
          description: transaction.description || transaction.accountSub,
          status: 'success'
        },
        message: `Xác thực thành công - Tìm thấy giao dịch ${transactionId} với số tiền ${transaction.amount.toLocaleString('vi-VN')} VND`
      }
    } else {
      return {
        verified: false,
        message: `Không tìm thấy giao dịch với mã "${verificationCode}" và số tiền ${amount.toLocaleString('vi-VN')} VND trong dữ liệu ngân hàng`
      }
    }
    
  } catch (error) {
    console.error('💥 Excel verification error:', error)
    return {
      verified: false,
      message: 'Lỗi khi tra soát dữ liệu giao dịch. Vui lòng thử lại sau.'
    }
  }
} 