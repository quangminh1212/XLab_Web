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

// Hàm lấy text mô tả từ response code
function getResponseCodeText(code: string): string {
  const codeMap: Record<string, string> = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng',
    '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch',
    '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa',
    '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)',
    '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
    '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày',
    '75': 'Ngân hàng thanh toán đang bảo trì',
    '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định',
    '97': 'Lỗi checksum - Dữ liệu không hợp lệ',
    '99': 'Các lỗi khác'
  }
  
  return codeMap[code] || 'Mã lỗi không xác định'
}

// VNPay Return URL - Xử lý khi VNPay redirect về
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Lấy tất cả parameters từ VNPay
    const vnp_Params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      vnp_Params[key] = value
    })

    console.log('🔙 VNPay Return URL received:', vnp_Params)

    // Lấy secure hash từ VNPay
    const secureHash = vnp_Params['vnp_SecureHash']
    
    // Xóa hash khỏi params để verify
    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    // Sắp xếp params theo alphabet
    const sortedParams = sortObject(vnp_Params)
    
    // Tạo query string để hash
    const signData = new URLSearchParams(sortedParams).toString()
    
    // Tạo hash để so sánh
    const signed = createSecureHash(signData, VNP_SECRET_KEY)
    
    const responseCode = vnp_Params['vnp_ResponseCode'] || '99'
    const orderId = vnp_Params['vnp_TxnRef']
    const amount = vnp_Params['vnp_Amount']
    const transactionNo = vnp_Params['vnp_TransactionNo']
    const bankCode = vnp_Params['vnp_BankCode']

    let result = {
      success: false,
      responseCode,
      message: '',
      orderId,
      amount: amount ? parseInt(amount) / 100 : 0, // VNPay trả về amount * 100
      transactionNo,
      bankCode,
      isValidChecksum: false
    }

    // Verify hash để đảm bảo dữ liệu từ VNPay
    if (secureHash === signed) {
      console.log('✅ Return URL - Hash verification successful!')
      result.isValidChecksum = true
      
      if (responseCode === '00') {
        result.success = true
        result.message = 'Thanh toán thành công!'
      } else {
        result.message = getResponseCodeText(responseCode)
      }
      
    } else {
      console.error('❌ Return URL - Hash verification failed!')
      result.message = 'Lỗi xác thực dữ liệu - Giao dịch không hợp lệ'
      result.responseCode = '97'
    }

    console.log('📊 Payment result:', result)

    // Redirect về trang kết quả với thông tin giao dịch
    const resultUrl = new URL('/payment/result', request.url)
    resultUrl.searchParams.set('success', result.success.toString())
    resultUrl.searchParams.set('message', result.message)
    resultUrl.searchParams.set('orderId', result.orderId || '')
    resultUrl.searchParams.set('amount', result.amount.toString())
    resultUrl.searchParams.set('transactionNo', result.transactionNo || '')
    resultUrl.searchParams.set('responseCode', result.responseCode)

    // Redirect về trang kết quả
    return NextResponse.redirect(resultUrl.toString())

  } catch (error) {
    console.error('💥 VNPay Return URL Error:', error)
    
    // Redirect về trang lỗi
    const errorUrl = new URL('/payment/result', request.url)
    errorUrl.searchParams.set('success', 'false')
    errorUrl.searchParams.set('message', 'Lỗi hệ thống khi xử lý kết quả thanh toán')
    errorUrl.searchParams.set('responseCode', '99')

    return NextResponse.redirect(errorUrl.toString())
  }
} 