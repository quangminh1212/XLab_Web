import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// VNPay Configuration
const VNP_VERSION = '2.1.0'
const VNP_COMMAND_QUERY = 'querydr'
const VNP_TMN_CODE = process.env.VNPAY_TMN_CODE || 'SANDBOX_TEST'
const VNP_SECRET_KEY = process.env.VNPAY_SECRET_KEY || 'SANDBOX_SECRET_KEY'
const VNP_API_URL = process.env.VNPAY_API_URL || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
const PAYMENT_DEMO_MODE = process.env.PAYMENT_DEMO_MODE === 'true'

// Hàm tạo secure hash theo chuẩn VNPay
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

// API để query trạng thái giao dịch từ VNPay
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, transactionDate, amount } = body

    if (!orderId || !transactionDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Kiểm tra nếu ở demo mode hoặc không có credentials thật
    const isDemo = PAYMENT_DEMO_MODE || 
                   VNP_TMN_CODE === 'DEMO_MODE' || 
                   VNP_TMN_CODE === 'SANDBOX_TEST' ||
                   process.env.NODE_ENV === 'development'

    if (isDemo) {
      console.log('🎭 Running in DEMO MODE - Simulating VNPay response')
      
      // Giả lập thời gian xử lý
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Giả lập response thành công
      return NextResponse.json({
        success: true,
        status: '00', // Thành công
        statusText: 'Giao dịch thanh toán thành công (Demo)',
        transactionNo: `DEMO${Date.now()}`,
        amount: amount || 29800000,
        bankCode: 'DEMO_BANK',
        payDate: formatDateTime(new Date()),
        isDemo: true,
        message: 'Đây là giao dịch demo - không có tiền thật được chuyển'
      })
    }

    // Tạo request ID unique
    const requestId = `REQ${Date.now()}`
    const createDate = formatDateTime(new Date())
    const ipAddr = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1'

    // Tạo dữ liệu để hash
    const dataToHash = [
      requestId,
      VNP_VERSION,
      VNP_COMMAND_QUERY,
      VNP_TMN_CODE,
      orderId,
      transactionDate,
      createDate,
      ipAddr,
      `Payment for order ${orderId}`
    ].join('|')

    const secureHash = createSecureHash(dataToHash, VNP_SECRET_KEY)

    // Payload gửi tới VNPay
    const vnpayPayload = {
      vnp_RequestId: requestId,
      vnp_Version: VNP_VERSION,
      vnp_Command: VNP_COMMAND_QUERY,
      vnp_TmnCode: VNP_TMN_CODE,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Payment for order ${orderId}`,
      vnp_TransactionDate: transactionDate,
      vnp_CreateDate: createDate,
      vnp_IpAddr: ipAddr,
      vnp_SecureHash: secureHash
    }

    console.log('VNPay Query Request:', vnpayPayload)

    // Gọi API VNPay
    const vnpayResponse = await fetch(VNP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vnpayPayload)
    })

    const vnpayResult = await vnpayResponse.json()
    console.log('VNPay Query Response:', vnpayResult)

    // Xử lý response từ VNPay
    if (vnpayResult.vnp_ResponseCode === '00') {
      // Kiểm tra trạng thái giao dịch
      const transactionStatus = vnpayResult.vnp_TransactionStatus
      
      return NextResponse.json({
        success: true,
        status: transactionStatus,
        statusText: getTransactionStatusText(transactionStatus),
        transactionNo: vnpayResult.vnp_TransactionNo,
        amount: vnpayResult.vnp_Amount,
        bankCode: vnpayResult.vnp_BankCode,
        payDate: vnpayResult.vnp_PayDate,
        data: vnpayResult
      })
    } else {
      // Nếu có lỗi từ VNPay nhưng đang ở dev mode, fallback sang demo
      if (process.env.NODE_ENV === 'development' && vnpayResult.vnp_ResponseCode === '02') {
        console.log('⚠️ VNPay API error in development - falling back to demo mode')
        
        return NextResponse.json({
          success: true,
          status: '00',
          statusText: 'Giao dịch thành công (Fallback demo)',
          transactionNo: `FALLBACK${Date.now()}`,
          amount: amount || 29800000,
          bankCode: 'FALLBACK_BANK',
          payDate: formatDateTime(new Date()),
          isDemo: true,
          message: 'VNPay API không khả dụng - sử dụng demo mode'
        })
      }

      return NextResponse.json({
        success: false,
        error: vnpayResult.vnp_Message || 'Unknown error from VNPay',
        code: vnpayResult.vnp_ResponseCode
      })
    }

  } catch (error) {
    console.error('VNPay API Error:', error)
    
    // Fallback demo mode cho tất cả lỗi trong development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Error in development - using demo response')
      
      // Giả lập trạng thái thành công sau 1 giây
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return NextResponse.json({
        success: true,
        status: '00', // Thành công
        statusText: 'Giao dịch thanh toán thành công (Error fallback)',
        transactionNo: `ERR${Date.now()}`,
        amount: 29800000, // Demo amount
        bankCode: 'ERROR_FALLBACK',
        payDate: formatDateTime(new Date()),
        isDemo: true
      })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Hàm chuyển đổi mã trạng thái thành text
function getTransactionStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    '00': 'Giao dịch thanh toán thành công',
    '01': 'Giao dịch chưa hoàn tất',
    '02': 'Giao dịch bị lỗi',
    '04': 'Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)',
    '05': 'VNPAY đang xử lý giao dịch này (GD hoàn tiền)',
    '06': 'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)',
    '07': 'Giao dịch bị nghi ngờ gian lận',
    '09': 'GD Hoàn trả bị từ chối'
  }
  
  return statusMap[status] || 'Trạng thái không xác định'
} 