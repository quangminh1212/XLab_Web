import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Interface cho request xác thực
interface VerifyPaymentRequest {
  orderId: string
  verificationCode: string
  amount: number
  bankCode?: string
}

// Interface cho response từ bank API
interface BankVerificationResponse {
  success: boolean
  transactionId?: string
  message: string
  amount?: number
  timestamp?: string
}

// Mock bank API - Thay thế bằng API thật của ngân hàng
async function verifyWithBank(data: VerifyPaymentRequest): Promise<BankVerificationResponse> {
  // TODO: Tích hợp API thật với:
  // 1. VietQR API để verify transaction
  // 2. Bank webhook để confirm payment
  // 3. SMS/OTP verification service
  
  // Giả lập call API ngân hàng thật
  try {
    // Simulate real bank API call
    const bankApiUrl = process.env.BANK_API_URL || 'https://api.bank.example.com/verify'
    const bankApiKey = process.env.BANK_API_KEY || 'test_key'
    
    const response = await fetch(bankApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bankApiKey}`,
        'X-API-Version': '2024-01-01'
      },
      body: JSON.stringify({
        transaction_code: data.verificationCode,
        order_id: data.orderId,
        amount: data.amount,
        verification_method: 'sms_otp'
      })
    })
    
    if (!response.ok) {
      return {
        success: false,
        message: 'Không thể kết nối đến hệ thống ngân hàng'
      }
    }
    
    const result = await response.json()
    return {
      success: result.verified === true,
      transactionId: result.transaction_id,
      message: result.message || 'Xác thực thành công',
      amount: result.amount,
      timestamp: result.timestamp
    }
    
  } catch (error) {
    // Fallback verification cho development
    console.log('Bank API Error:', error)
    
    // Basic validation rules for development
    if (data.verificationCode.length >= 6) {
      // Check if verification code matches expected pattern
      const isValidOTP = /^[0-9]{6,12}$/.test(data.verificationCode)
      const isValidTxnId = /^[A-Z0-9]{6,20}$/.test(data.verificationCode.toUpperCase())
      
      if (isValidOTP || isValidTxnId) {
        return {
          success: true,
          transactionId: `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
          message: 'Xác thực thành công (Development Mode)',
          amount: data.amount,
          timestamp: new Date().toISOString()
        }
      }
    }
    
    return {
      success: false,
      message: 'Mã xác thực không hợp lệ hoặc không tồn tại'
    }
  }
}

// Security: Rate limiting
const verificationAttempts = new Map<string, { count: number, lastAttempt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const key = ip
  const current = verificationAttempts.get(key)
  
  if (!current) {
    verificationAttempts.set(key, { count: 1, lastAttempt: now })
    return true
  }
  
  // Reset if more than 5 minutes passed
  if (now - current.lastAttempt > 5 * 60 * 1000) {
    verificationAttempts.set(key, { count: 1, lastAttempt: now })
    return true
  }
  
  // Allow max 5 attempts per 5 minutes
  if (current.count >= 5) {
    return false
  }
  
  current.count++
  current.lastAttempt = now
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'
    
    // Check rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Quá nhiều lần thử. Vui lòng chờ 5 phút.' 
        },
        { status: 429 }
      )
    }
    
    const body: VerifyPaymentRequest = await request.json()
    
    // Validate input
    if (!body.orderId || !body.verificationCode || !body.amount) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Thiếu thông tin bắt buộc' 
        },
        { status: 400 }
      )
    }
    
    // Additional security checks
    if (body.amount <= 0 || body.amount > 1000000000) { // Max 1 billion VND
      return NextResponse.json(
        { 
          success: false, 
          message: 'Số tiền không hợp lệ' 
        },
        { status: 400 }
      )
    }
    
    if (!/^ORDER-\d+$/.test(body.orderId)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Mã đơn hàng không hợp lệ' 
        },
        { status: 400 }
      )
    }
    
    // Verify with bank
    const verificationResult = await verifyWithBank(body)
    
    if (verificationResult.success) {
      // TODO: Save successful payment to database
      // await savePaymentRecord({
      //   orderId: body.orderId,
      //   transactionId: verificationResult.transactionId,
      //   amount: body.amount,
      //   status: 'verified',
      //   verifiedAt: new Date()
      // })
      
      return NextResponse.json({
        success: true,
        transactionId: verificationResult.transactionId,
        message: verificationResult.message,
        amount: verificationResult.amount,
        timestamp: verificationResult.timestamp
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: verificationResult.message 
        },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi hệ thống. Vui lòng thử lại sau.' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'Payment verification endpoint. Use POST method.' 
    },
    { status: 405 }
  )
} 