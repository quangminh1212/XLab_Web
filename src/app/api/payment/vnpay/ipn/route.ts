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

// Update transaction status in file
function updateTransactionStatus(orderId: string, status: string, ipnData: any) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, 'transactions.json')
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      let transactions = JSON.parse(data)
      
      const transactionIndex = transactions.findIndex((t: any) => t.orderId === orderId)
      if (transactionIndex !== -1) {
        transactions[transactionIndex].status = status
        transactions[transactionIndex].ipnData = ipnData
        transactions[transactionIndex].updatedAt = new Date().toISOString()
        
        fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2))
        console.log('Transaction status updated:', orderId, 'to', status)
      }
    }
  } catch (error) {
    console.error('Error updating transaction status:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let vnp_Params = body

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
    const amount = parseInt(vnp_Params['vnp_Amount']) / 100
    const transactionNo = vnp_Params['vnp_TransactionNo']

    console.log('VNPay IPN received:', {
      orderId,
      responseCode,
      amount,
      transactionNo,
      isValidSignature
    })

    if (!isValidSignature) {
      console.error('Invalid signature in IPN:', orderId)
      return NextResponse.json({
        RspCode: '97',
        Message: 'Invalid signature'
      })
    }

    if (responseCode === '00') {
      // Payment confirmed by bank
      updateTransactionStatus(orderId, 'confirmed', vnp_Params)
      
      console.log('Payment confirmed by bank:', orderId)
      return NextResponse.json({
        RspCode: '00',
        Message: 'Confirm Success'
      })
    } else {
      // Payment failed
      updateTransactionStatus(orderId, 'failed', vnp_Params)
      
      console.log('Payment failed in IPN:', orderId, 'Response code:', responseCode)
      return NextResponse.json({
        RspCode: '00',
        Message: 'Confirm Success'
      })
    }

  } catch (error) {
    console.error('VNPay IPN error:', error)
    return NextResponse.json({
      RspCode: '99',
      Message: 'Unknown error'
    })
  }
} 