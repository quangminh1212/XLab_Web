import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { verifyMBBankTransaction, validateVerificationCode } from '@/lib/bankAPI'

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

// Real MBBank verification
async function verifyWithMBBank(data: VerifyPaymentRequest): Promise<BankVerificationResponse> {
  try {
    console.log('🏦 Starting MBBank verification:', {
      orderId: data.orderId,
      amount: data.amount,
      codeLength: data.verificationCode.length
    })

    // Validate verification code format first
    const validation = validateVerificationCode(data.verificationCode)
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.message
      }
    }

    console.log('✅ Code format valid:', validation.type)

    // Use real MBBank API
    const result = await verifyMBBankTransaction(
      '669912122000', // Account number from PaymentForm
      data.verificationCode,
      data.amount
    )

    if (result.verified && result.transactionInfo) {
      console.log('✅ MBBank verification successful:', result.transactionInfo.transactionId)
      return {
        success: true,
        transactionId: result.transactionInfo.transactionId,
        message: result.message,
        amount: result.transactionInfo.amount,
        timestamp: result.transactionInfo.transactionDate
      }
    } else {
      console.log('❌ MBBank verification failed:', result.message)
      return {
        success: false,
        message: result.message
      }
    }

  } catch (error) {
    console.error('💥 MBBank verification error:', error)
    
    // Development fallback with enhanced validation
    if (process.env.NODE_ENV === 'development') {
      console.log('🛠️ Using development fallback mode')
      
      const validation = validateVerificationCode(data.verificationCode)
      if (validation.isValid) {
        // Simulate realistic transaction processing
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
        
        return {
          success: true,
          transactionId: `MB${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
          message: `Xác thực thành công (Dev Mode - ${validation.type})`,
          amount: data.amount,
          timestamp: new Date().toISOString()
        }
      } else {
        return {
          success: false,
          message: 'Mã xác thực không đúng định dạng MBBank'
        }
      }
    }
    
    return {
      success: false,
      message: 'Không thể kết nối đến MBBank. Vui lòng thử lại sau.'
    }
  }
}

// Security: Enhanced rate limiting
const verificationAttempts = new Map<string, { count: number, lastAttempt: number, blocked: boolean }>()

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now()
  const key = ip
  const current = verificationAttempts.get(key)
  
  if (!current) {
    verificationAttempts.set(key, { count: 1, lastAttempt: now, blocked: false })
    return { allowed: true }
  }
  
  // Check if blocked (24 hour block after too many attempts)
  if (current.blocked && now - current.lastAttempt < 24 * 60 * 60 * 1000) {
    return { 
      allowed: false, 
      message: 'IP đã bị khóa do quá nhiều lần thử sai. Vui lòng chờ 24 giờ.' 
    }
  }
  
  // Reset if more than 5 minutes passed
  if (now - current.lastAttempt > 5 * 60 * 1000) {
    verificationAttempts.set(key, { count: 1, lastAttempt: now, blocked: false })
    return { allowed: true }
  }
  
  // Block after 10 failed attempts
  if (current.count >= 10) {
    current.blocked = true
    current.lastAttempt = now
    return { 
      allowed: false, 
      message: 'Quá nhiều lần thử sai. IP đã bị khóa 24 giờ.' 
    }
  }
  
  // Warn after 5 attempts
  if (current.count >= 5) {
    current.count++
    current.lastAttempt = now
    return { 
      allowed: false, 
      message: `Quá nhiều lần thử (${current.count}/10). Vui lòng chờ 5 phút hoặc kiểm tra lại mã xác thực.` 
    }
  }
  
  current.count++
  current.lastAttempt = now
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'
    
    console.log('🔐 Payment verification request from IP:', ip)
    
    // Check rate limiting
    const rateCheck = checkRateLimit(ip)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: rateCheck.message 
        },
        { status: 429 }
      )
    }
    
    const body: VerifyPaymentRequest = await request.json()
    
    // Enhanced input validation
    if (!body.orderId || !body.verificationCode || !body.amount) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Thiếu thông tin bắt buộc: orderId, verificationCode, amount' 
        },
        { status: 400 }
      )
    }
    
    // Security checks
    if (body.amount <= 0 || body.amount > 1000000000) { // Max 1 billion VND
      return NextResponse.json(
        { 
          success: false, 
          message: 'Số tiền không hợp lệ (0 < amount <= 1,000,000,000 VND)' 
        },
        { status: 400 }
      )
    }
    
    if (!/^ORDER-\d+$/.test(body.orderId)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Mã đơn hàng không hợp lệ (format: ORDER-xxxxxxxxxx)' 
        },
        { status: 400 }
      )
    }

    // Clean verification code
    body.verificationCode = body.verificationCode.trim().toUpperCase()
    
    if (body.verificationCode.length < 6 || body.verificationCode.length > 20) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Mã xác thực phải có độ dài từ 6-20 ký tự' 
        },
        { status: 400 }
      )
    }
    
    console.log('📋 Verification request details:', {
      orderId: body.orderId,
      amount: body.amount,
      codeType: body.verificationCode.substring(0, 2) + '...'
    })
    
    // Verify with MBBank
    const verificationResult = await verifyWithMBBank(body)
    
    if (verificationResult.success) {
      console.log('✅ Payment verification successful:', verificationResult.transactionId)
      
      // TODO: Save successful payment to database
      // await savePaymentToDatabase({
      //   orderId: body.orderId,
      //   transactionId: verificationResult.transactionId,
      //   amount: body.amount,
      //   bankCode: 'MB',
      //   status: 'verified',
      //   verifiedAt: new Date(),
      //   ipAddress: ip,
      //   metadata: {
      //     verificationMethod: 'mbbank_api',
      //     processingTime: Date.now() - startTime
      //   }
      // })
      
      // Reset rate limit counter on success
      verificationAttempts.delete(ip)
      
      return NextResponse.json({
        success: true,
        transactionId: verificationResult.transactionId,
        message: verificationResult.message,
        amount: verificationResult.amount,
        timestamp: verificationResult.timestamp,
        bankCode: 'MB'
      })
    } else {
      console.log('❌ Payment verification failed:', verificationResult.message)
      
      return NextResponse.json(
        { 
          success: false, 
          message: verificationResult.message 
        },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('💥 Payment verification system error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Lỗi hệ thống xác thực. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'test-excel') {
      // Test tra soát Excel
      const verificationCode = searchParams.get('code') || 'FT25149200931766'
      const amount = parseFloat(searchParams.get('amount') || '4000')
      
      console.log('🧪 Testing Excel verification:', { verificationCode, amount })
      
      const { fetchTransactionData, verifyTransactionFromExcel } = await import('@/lib/bankAPI')
      
      // Lấy danh sách giao dịch
      const transactions = await fetchTransactionData()
      
      // Test verification
      const verificationResult = await verifyTransactionFromExcel(verificationCode, amount)
      
      return NextResponse.json({
        message: 'Excel Transaction Verification Test',
        testParams: { verificationCode, amount },
        availableTransactions: transactions.length,
        transactionSample: transactions.slice(0, 3),
        verificationResult: verificationResult,
        timestamp: new Date().toISOString()
      })
    }
    
    if (action === 'list-transactions') {
      // Liệt kê tất cả giao dịch
      const { fetchTransactionData } = await import('@/lib/bankAPI')
      const transactions = await fetchTransactionData()
      
      return NextResponse.json({
        message: 'Available Transactions',
        count: transactions.length,
        transactions: transactions,
        timestamp: new Date().toISOString()
      })
    }
    
    // Default response
    return NextResponse.json(
      { 
        message: 'MBBank Payment Verification API',
        status: 'active',
        version: '2.0',
        methods: ['POST'],
        description: 'Use POST method to verify payment transactions',
        testEndpoints: {
          'test-excel': '?action=test-excel&code=FT25149200931766&amount=4000',
          'list-transactions': '?action=list-transactions'
        },
        features: [
          'Real MBBank API integration',
          'Excel/Google Sheets transaction verification',
          'Enhanced validation patterns',
          'Rate limiting & security'
        ]
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('💥 API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Unable to process request'
      },
      { status: 500 }
    )
  }
} 