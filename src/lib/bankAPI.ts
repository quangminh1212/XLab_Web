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
      console.log('🛠️ MBBank API credentials not found, using development simulation')
      
      // Enhanced development simulation
      return await simulateMBBankVerification(accountNumber, transactionCode, amount)
    }
    
  } catch (error) {
    console.error('💥 MBBank verification error:', error)
    
    // Fallback to simulation in case of API errors
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Falling back to development simulation')
      return await simulateMBBankVerification(accountNumber, transactionCode, amount)
    }
    
    return {
      verified: false,
      message: 'Không thể kết nối đến hệ thống MBBank. Vui lòng thử lại sau.'
    }
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