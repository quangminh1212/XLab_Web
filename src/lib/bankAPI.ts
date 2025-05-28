/**
 * Bank API Integration Helper
 * Tích hợp các API ngân hàng thật cho xác thực thanh toán
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
 * Xác thực giao dịch qua VietQR API
 * Đây là ví dụ cho API thật - cần đăng ký tài khoản với nhà cung cấp
 */
export async function verifyVietQRTransaction(
  verifyData: VietQRVerifyRequest
): Promise<VietQRVerifyResponse> {
  try {
    // API VietQR thật (cần đăng ký và có API key)
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
 * Xác thực giao dịch qua MBBank API
 * Ví dụ tích hợp với API ngân hàng cụ thể
 */
export async function verifyMBBankTransaction(
  accountNumber: string,
  transactionCode: string,
  amount: number
): Promise<VietQRVerifyResponse> {
  try {
    // API MBBank (cần partnership agreement)
    const apiUrl = process.env.MBBANK_API_URL || 'https://api.mbbank.com.vn/v1/verify'
    const apiKey = process.env.MBBANK_API_KEY || ''
    
    if (!apiKey) {
      throw new Error('MBBank API key not configured')
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Partner-Code': process.env.MBBANK_PARTNER_CODE || ''
      },
      body: JSON.stringify({
        account_number: accountNumber,
        transaction_code: transactionCode,
        amount: amount,
        verification_type: 'otp'
      })
    })
    
    if (!response.ok) {
      throw new Error(`MBBank API error: ${response.status}`)
    }
    
    const result = await response.json()
    
    return {
      verified: result.success === true,
      transactionInfo: result.transaction ? {
        transactionId: result.transaction.id,
        orderId: result.transaction.reference,
        amount: result.transaction.amount,
        bankCode: 'MB',
        accountNumber: result.transaction.account_number,
        transactionDate: result.transaction.created_at,
        description: result.transaction.description,
        status: result.transaction.status
      } : undefined,
      message: result.message || 'Xác thực thành công'
    }
    
  } catch (error) {
    console.error('MBBank verification error:', error)
    return {
      verified: false,
      message: 'Không thể xác thực với MBBank API'
    }
  }
}

/**
 * SMS OTP Verification
 * Xác thực OTP qua SMS
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
 * Xác thực webhook từ ngân hàng
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
 * Enhanced validation patterns for different verification codes
 */
export const VERIFICATION_PATTERNS = {
  // OTP từ SMS (6-8 số)
  SMS_OTP: /^[0-9]{6,8}$/,
  
  // Mã giao dịch ngân hàng (6-20 ký tự alphanumeric)
  BANK_TXN_ID: /^[A-Z0-9]{6,20}$/i,
  
  // Reference number từ app banking
  BANK_REF: /^(FT|MB|VCB|TCB|ACB)[0-9]{10,15}$/i,
  
  // QR transaction code
  QR_CODE: /^QR[0-9]{12,16}$/i
}

/**
 * Validate verification code format
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
      message: 'Mã OTP hợp lệ'
    }
  }
  
  if (VERIFICATION_PATTERNS.BANK_TXN_ID.test(trimmedCode)) {
    return {
      isValid: true,
      type: 'BANK_TXN_ID',
      message: 'Mã giao dịch ngân hàng hợp lệ'
    }
  }
  
  if (VERIFICATION_PATTERNS.BANK_REF.test(trimmedCode)) {
    return {
      isValid: true,
      type: 'BANK_REF',
      message: 'Số tham chiếu ngân hàng hợp lệ'
    }
  }
  
  if (VERIFICATION_PATTERNS.QR_CODE.test(trimmedCode)) {
    return {
      isValid: true,
      type: 'QR_CODE',
      message: 'Mã QR hợp lệ'
    }
  }
  
  return {
    isValid: false,
    type: 'UNKNOWN',
    message: 'Mã xác thực không đúng định dạng'
  }
} 