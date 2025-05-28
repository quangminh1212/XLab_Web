#!/usr/bin/env node

// Test script for payment system
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Test data
const testOrder = {
  orderId: `TEST-${Date.now()}`,
  amount: 500000 // 500k VND
};

console.log('🧪 Testing XLab Payment System...\n');

// Test 1: VNPay Create Payment
async function testVNPayCreate() {
  console.log('1. Testing VNPay Create Payment...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/payment/vnpay/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: testOrder.amount,
        orderId: testOrder.orderId,
        orderInfo: `Test payment ${testOrder.orderId}`
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ VNPay Create: SUCCESS');
      console.log(`   Payment URL: ${result.paymentUrl.substring(0, 100)}...`);
    } else if (result.demo) {
      console.log('⚠️  VNPay Create: DEMO MODE (not configured)');
      console.log(`   Message: ${result.error}`);
    } else {
      console.log('❌ VNPay Create: FAILED');
      console.log(`   Error: ${result.error}`);
    }
  } catch (error) {
    console.log('❌ VNPay Create: ERROR');
    console.log(`   ${error.message}`);
  }
  
  console.log('');
}

// Test 2: Manual Bank Verification with different patterns
async function testBankVerification() {
  console.log('2. Testing Bank Verification...');
  
  const testCodes = [
    'FT2024123456789', // Vietnamese bank format
    '123456789ABC',    // MBBank format  
    'AB1234567890',    // SMS format
    '123456',          // Account reference
    '12345',           // Too short
    'VALIDCODE123456', // Standard format
    'INVALID',         // Invalid format
  ];
  
  for (const code of testCodes) {
    try {
      const response = await fetch(`${BASE_URL}/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: `${testOrder.orderId}-${code}`,
          verificationCode: code,
          amount: testOrder.amount
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Code "${code}": VERIFIED`);
        console.log(`   Transaction ID: ${result.transaction.transactionId}`);
      } else {
        console.log(`❌ Code "${code}": FAILED`);
        console.log(`   Message: ${result.message}`);
      }
    } catch (error) {
      console.log(`❌ Code "${code}": ERROR - ${error.message}`);
    }
  }
  
  console.log('');
}

// Test 3: Check transaction storage
async function testTransactionStorage() {
  console.log('3. Testing Transaction Storage...');
  
  const dataDir = path.join(process.cwd(), 'data');
  const transactionFile = path.join(dataDir, 'transactions.json');
  
  if (fs.existsSync(transactionFile)) {
    const data = fs.readFileSync(transactionFile, 'utf8');
    const transactions = JSON.parse(data);
    
    console.log(`✅ Transaction file exists with ${transactions.length} records`);
    
    if (transactions.length > 0) {
      const latest = transactions[transactions.length - 1];
      console.log(`   Latest: ${latest.orderId} - ${latest.status} - ${latest.createdAt}`);
    }
  } else {
    console.log('⚠️  No transaction file found yet');
  }
  
  console.log('');
}

// Test 4: Performance test
async function testPerformance() {
  console.log('4. Testing Performance...');
  
  const start = Date.now();
  
  // Run 5 parallel verification requests
  const promises = Array.from({length: 5}, (_, i) => 
    fetch(`${BASE_URL}/api/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: `PERF-${Date.now()}-${i}`,
        verificationCode: `PERF${i.toString().padStart(6, '0')}`,
        amount: testOrder.amount
      })
    })
  );
  
  try {
    await Promise.all(promises);
    const duration = Date.now() - start;
    console.log(`✅ Performance Test: ${duration}ms for 5 parallel requests`);
    console.log(`   Average: ${Math.round(duration/5)}ms per request`);
  } catch (error) {
    console.log(`❌ Performance Test: ERROR - ${error.message}`);
  }
  
  console.log('');
}

// Run all tests
async function runTests() {
  try {
    await testVNPayCreate();
    await testBankVerification();
    await testTransactionStorage();
    await testPerformance();
    
    console.log('🎉 Payment system testing completed!');
    
    // Show summary
    console.log('\n📊 Summary:');
    console.log('- VNPay Create: Check logs above');
    console.log('- Bank Verification: Multiple patterns tested');
    console.log('- Transaction Storage: File-based system');
    console.log('- Performance: Parallel request handling');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Main execution
(async () => {
  console.log(`Testing server at: ${BASE_URL}`);
  console.log(`Test Order ID: ${testOrder.orderId}`);
  console.log(`Test Amount: ${testOrder.amount.toLocaleString('vi-VN')} VND\n`);
  
  if (!(await checkServer())) {
    console.log('⚠️  Warning: Server might not be running at localhost:3000');
    console.log('   Make sure to run: npm run dev\n');
  }
  
  await runTests();
})(); 