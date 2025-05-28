import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// VNPay Configuration
const VNP_SECRET_KEY = process.env.VNPAY_SECRET_KEY || 'SANDBOX_SECRET_KEY'

// Hàm sắp xếp object theo alphabet để tạo hash
function sortObject(obj: Record<string, any>): Record<string, any> {
  const sorted: Record<string, any> = {}
  const keys = Object.keys(obj).sort()
  
  for (const key of keys) {
    sorted[key] = obj[key]
  }
  
  return sorted
}

// Hàm tạo secure hash để verify dữ liệu từ VNPay
function createSecureHash(data: string, secretKey: string): string {
  return crypto
    .createHmac('sha512', secretKey)
    .update(data, 'utf-8')
    .digest('hex')
}

// VNPay IPN - Webhook để nhận thông báo kết quả giao dịch
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Lấy tất cả parameters từ VNPay
    const vnp_Params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      vnp_Params[key] = value
    })

    console.log('🔔 VNPay IPN received:', vnp_Params)

    // Lấy secure hash từ VNPay
    const secureHash = vnp_Params['vnp_SecureHash']
    
    // Xóa hash khỏi params để verify
    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    // Sắp xếp params theo alphabet
    const sortedParams = sortObject(vnp_Params)
    
    // Tạo query string để hash
    const signData = new URLSearchParams(sortedParams).toString()
    console.log('📝 Sign data for verification:', signData)

    // Tạo hash để so sánh
    const signed = createSecureHash(signData, VNP_SECRET_KEY)
    
    console.log('🔐 Expected hash:', signed)
    console.log('🔐 Received hash:', secureHash)

    // Verify hash để đảm bảo dữ liệu từ VNPay
    if (secureHash === signed) {
      const orderId = vnp_Params['vnp_TxnRef']
      const responseCode = vnp_Params['vnp_ResponseCode']
      const transactionStatus = vnp_Params['vnp_TransactionStatus']
      const amount = vnp_Params['vnp_Amount']
      const transactionNo = vnp_Params['vnp_TransactionNo']
      const bankCode = vnp_Params['vnp_BankCode']
      const payDate = vnp_Params['vnp_PayDate']

      console.log('✅ Hash verification successful!')
      console.log('📦 Order ID:', orderId)
      console.log('🏦 Response Code:', responseCode)
      console.log('🔄 Transaction Status:', transactionStatus)

      // TODO: Cập nhật database với kết quả giao dịch
      // Ví dụ:
      // await updateOrderStatus(orderId, {
      //   status: responseCode === '00' ? 'paid' : 'failed',
      //   transactionNo,
      //   amount: parseInt(amount) / 100, // VNPay trả về amount * 100
      //   bankCode,
      //   payDate,
      //   responseCode,
      //   transactionStatus
      // })

      // Phản hồi thành công cho VNPay
      return NextResponse.json({
        RspCode: '00',
        Message: 'success'
      }, { status: 200 })
      
    } else {
      console.error('❌ Hash verification failed!')
      console.error('Expected:', signed)
      console.error('Received:', secureHash)
      
      // Phản hồi lỗi checksum cho VNPay
      return NextResponse.json({
        RspCode: '97',
        Message: 'Fail checksum'
      }, { status: 200 })
    }

  } catch (error) {
    console.error('💥 VNPay IPN Error:', error)
    
    return NextResponse.json({
      RspCode: '99',
      Message: 'Internal server error'
    }, { status: 200 })
  }
}

// Export GET function for POST requests as well (VNPay might use either)
export const POST = GET 