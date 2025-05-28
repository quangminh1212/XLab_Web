import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Transaction {
  orderId: string
  amount: number
  responseCode: string
  transactionNo: string
  bankCode?: string
  cardType?: string
  payDate?: string
  isValidSignature: boolean
  status: string
  createdAt: string
  updatedAt?: string
}

// Get transaction by order ID
function getTransaction(orderId: string): Transaction | null {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, 'transactions.json')
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      const transactions: Transaction[] = JSON.parse(data)
      
      return transactions.find(t => t.orderId === orderId) || null
    }
    
    return null
  } catch (error) {
    console.error('Error reading transactions:', error)
    return null
  }
}

// Verify payment with verification code (mock bank API check)
async function verifyWithBank(verificationCode: string, amount: number, orderId: string) {
  // Mock bank verification logic
  // In real implementation, this would call bank API
  
  // Simple validation: code should be at least 6 characters
  if (verificationCode.length < 6) {
    return { success: false, message: 'Mã xác thực không hợp lệ' }
  }
  
  // Mock some scenarios
  const mockTransactionId = `BANK_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  
  // 90% success rate for demo
  const isSuccess = Math.random() > 0.1
  
  if (isSuccess) {
    return {
      success: true,
      transactionId: mockTransactionId,
      message: 'Xác thực thành công'
    }
  } else {
    return {
      success: false,
      message: 'Không tìm thấy giao dịch tương ứng với mã xác thực'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, verificationCode, amount } = body

    if (!orderId || !verificationCode) {
      return NextResponse.json(
        { error: 'Missing orderId or verificationCode' },
        { status: 400 }
      )
    }

    // First check if we already have a confirmed transaction
    const existingTransaction = getTransaction(orderId)
    
    if (existingTransaction && existingTransaction.status === 'confirmed') {
      return NextResponse.json({
        success: true,
        message: 'Giao dịch đã được xác nhận từ ngân hàng',
        transaction: {
          orderId: existingTransaction.orderId,
          amount: existingTransaction.amount,
          transactionId: existingTransaction.transactionNo,
          status: 'confirmed',
          method: 'vnpay'
        }
      })
    }

    // If no confirmed transaction, try to verify with the verification code
    console.log('Verifying payment with code:', verificationCode, 'for order:', orderId)
    
    const verificationResult = await verifyWithBank(verificationCode, amount, orderId)
    
    if (verificationResult.success) {
      // Save manual verification transaction
      const transaction = {
        orderId,
        amount,
        responseCode: '00',
        transactionNo: verificationResult.transactionId,
        isValidSignature: true,
        status: 'manual_verified',
        createdAt: new Date().toISOString(),
        verificationCode,
        method: 'manual'
      }
      
      // Save to file
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
        
        transactions.push(transaction)
        fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2))
      } catch (error) {
        console.error('Error saving manual verification:', error)
      }

      return NextResponse.json({
        success: true,
        message: verificationResult.message,
        transaction: {
          orderId,
          amount,
          transactionId: verificationResult.transactionId,
          status: 'manual_verified',
          method: 'manual'
        }
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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 