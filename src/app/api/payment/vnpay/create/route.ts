import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const VNP_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html' // Test environment
const VNP_TMN_CODE = process.env.VNP_TMN_CODE || 'DEMO'
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || 'QWERTYUIOPASDFGHJKLZXCVBNM123456'
const VNP_RETURN_URL = (process.env.NEXTAUTH_URL || 'http://localhost:3000') + '/api/payment/vnpay/return'

function sortObject(obj: any) {
  const sorted: any = {}
  const str = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (let key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
  }
  return sorted
}

// Check if VNPay is properly configured
function isVNPayConfigured(): boolean {
  return !!(
    process.env.VNP_TMN_CODE && 
    process.env.VNP_HASH_SECRET && 
    process.env.VNP_TMN_CODE !== 'YOUR_TMN_CODE' &&
    process.env.VNP_HASH_SECRET !== 'YOUR_HASH_SECRET'
  )
}

export async function POST(request: NextRequest) {
  try {
    // Check VNPay configuration first
    if (!isVNPayConfigured()) {
      console.warn('VNPay not properly configured, using demo mode')
      return NextResponse.json({
        success: false,
        error: 'VNPay chưa được cấu hình. Vui lòng sử dụng phương thức chuyển khoản ngân hàng.',
        demo: true
      }, { status: 503 })
    }

    const body = await request.json()
    const { amount, orderId, orderInfo, bankCode } = body

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount <= 0 || amount > 1000000000) { // Max 1 billion VND
      return NextResponse.json(
        { error: 'Số tiền không hợp lệ' },
        { status: 400 }
      )
    }

    const ipAddr = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1'

    const createDate = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '')
    
    let vnp_Params: any = {}
    vnp_Params['vnp_Version'] = '2.1.0'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = VNP_TMN_CODE
    vnp_Params['vnp_Locale'] = 'vn'
    vnp_Params['vnp_CurrCode'] = 'VND'
    vnp_Params['vnp_TxnRef'] = orderId
    vnp_Params['vnp_OrderInfo'] = orderInfo || `Thanh toan don hang ${orderId}`
    vnp_Params['vnp_OrderType'] = 'other'
    vnp_Params['vnp_Amount'] = amount * 100 // VNPay expects amount in cents
    vnp_Params['vnp_ReturnUrl'] = VNP_RETURN_URL
    vnp_Params['vnp_IpAddr'] = ipAddr
    vnp_Params['vnp_CreateDate'] = createDate
    
    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode
    }

    vnp_Params = sortObject(vnp_Params)

    const signData = new URLSearchParams(vnp_Params).toString()
    const hmac = crypto.createHmac('sha512', VNP_HASH_SECRET)
    const signed = hmac.update(signData, 'utf-8').digest('hex')
    vnp_Params['vnp_SecureHash'] = signed

    const paymentUrl = VNP_URL + '?' + new URLSearchParams(vnp_Params).toString()

    console.log('VNPay payment created:', { orderId, amount, isConfigured: isVNPayConfigured() })

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId
    })

  } catch (error) {
    console.error('VNPay create error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 