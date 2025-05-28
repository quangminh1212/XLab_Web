import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// VNPay Configuration
const VNP_VERSION = '2.1.0'
const VNP_COMMAND = 'pay'
const VNP_TMN_CODE = process.env.VNPAY_TMN_CODE || 'SANDBOX_TEST'
const VNP_SECRET_KEY = process.env.VNPAY_SECRET_KEY || 'SANDBOX_SECRET_KEY'
const VNP_URL = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
const VNP_RETURN_URL = process.env.VNP_RETURN_URL || 'http://localhost:3000/api/payment/vnpay/return'
const VNP_IPN_URL = process.env.VNP_IPN_URL || 'http://localhost:3000/api/payment/vnpay/ipn'

// Hàm sắp xếp object theo alphabet
function sortObject(obj: Record<string, any>): Record<string, any> {
  const sorted: Record<string, any> = {}
  const keys = Object.keys(obj).sort()
  
  for (const key of keys) {
    sorted[key] = obj[key]
  }
  
  return sorted
}

// Hàm tạo secure hash
function createSecureHash(data: string, secretKey: string): string {
  return crypto
    .createHmac('sha512', secretKey)
    .update(data, 'utf-8')
    .digest('hex')
}

// Hàm format thời gian theo chuẩn VNPay (yyyyMMddHHmmss)
function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

// API tạo URL thanh toán VNPay
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId, orderInfo, ipAddr, locale = 'vn', bankCode } = body

    // Validation
    if (!amount || !orderId || !orderInfo) {
      return NextResponse.json(
        { error: 'Missing required parameters: amount, orderId, orderInfo' },
        { status: 400 }
      )
    }

    // Tạo các tham số VNPay
    const createDate = formatDateTime(new Date())
    const expireDate = formatDateTime(new Date(Date.now() + 15 * 60 * 1000)) // 15 phút

    // VNPay parameters
    const vnpParams: Record<string, string> = {
      vnp_Version: VNP_VERSION,
      vnp_Command: VNP_COMMAND,
      vnp_TmnCode: VNP_TMN_CODE,
      vnp_Amount: (amount * 100).toString(), // VNPay yêu cầu amount * 100
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Locale: locale,
      vnp_ReturnUrl: VNP_RETURN_URL,
      vnp_IpAddr: ipAddr || '127.0.0.1',
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate
    }

    // Thêm bank code nếu có
    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode
    }

    console.log('🎯 Creating VNPay payment URL with params:', vnpParams)

    // Sắp xếp params theo alphabet
    const sortedParams = sortObject(vnpParams)
    
    // Tạo query string để hash
    const signData = new URLSearchParams(sortedParams).toString()
    console.log('📝 Sign data:', signData)

    // Tạo secure hash
    const secureHash = createSecureHash(signData, VNP_SECRET_KEY)
    
    // Thêm hash vào params
    sortedParams.vnp_SecureHash = secureHash

    // Tạo payment URL
    const paymentUrl = `${VNP_URL}?${new URLSearchParams(sortedParams).toString()}`

    console.log('✅ VNPay payment URL created successfully')
    console.log('🔗 Payment URL:', paymentUrl)

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId,
      amount,
      expireDate,
      message: 'Payment URL created successfully'
    })

  } catch (error) {
    console.error('💥 VNPay Create Payment URL Error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create payment URL',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 