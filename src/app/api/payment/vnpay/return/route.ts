import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || 'YOUR_HASH_SECRET'

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

// Save transaction to file
function saveTransaction(transaction: any) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    const filePath = path.join(dataDir, 'transactions.json')
    let transactions = []
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      transactions = JSON.parse(data)
    }
    
    transactions.push({
      ...transaction,
      createdAt: new Date().toISOString()
    })
    
    fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2))
    console.log('Transaction saved:', transaction.vnp_TxnRef)
  } catch (error) {
    console.error('Error saving transaction:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    let vnp_Params: any = {}
    
    // Extract all VNPay parameters
    searchParams.forEach((value, key) => {
      vnp_Params[key] = value
    })

    const secureHash = vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = sortObject(vnp_Params)
    
    const signData = new URLSearchParams(vnp_Params).toString()
    const hmac = crypto.createHmac('sha512', VNP_HASH_SECRET)
    const signed = hmac.update(signData, 'utf-8').digest('hex')

    const isValidSignature = secureHash === signed
    const responseCode = vnp_Params['vnp_ResponseCode']
    const orderId = vnp_Params['vnp_TxnRef']
    const amount = parseInt(vnp_Params['vnp_Amount']) / 100 // Convert back from cents
    const transactionNo = vnp_Params['vnp_TransactionNo']
    
    // Save transaction to file
    saveTransaction({
      orderId,
      amount,
      responseCode,
      transactionNo,
      bankCode: vnp_Params['vnp_BankCode'],
      cardType: vnp_Params['vnp_CardType'],
      payDate: vnp_Params['vnp_PayDate'],
      isValidSignature,
      status: responseCode === '00' ? 'success' : 'failed',
      rawData: vnp_Params
    })

    if (!isValidSignature) {
      console.error('Invalid signature for transaction:', orderId)
      return NextResponse.redirect(
        new URL(`/payment/result?status=error&message=Invalid signature&orderId=${orderId}`, request.url)
      )
    }

    if (responseCode === '00') {
      // Payment successful
      console.log('Payment successful:', orderId, 'Amount:', amount, 'Transaction:', transactionNo)
      return NextResponse.redirect(
        new URL(`/payment/result?status=success&orderId=${orderId}&amount=${amount}&transactionId=${transactionNo}`, request.url)
      )
    } else {
      // Payment failed
      console.log('Payment failed:', orderId, 'Response code:', responseCode)
      return NextResponse.redirect(
        new URL(`/payment/result?status=failed&orderId=${orderId}&responseCode=${responseCode}`, request.url)
      )
    }

  } catch (error) {
    console.error('VNPay return error:', error)
    return NextResponse.redirect(
      new URL('/payment/result?status=error&message=Processing error', request.url)
    )
  }
} 