const https = require('https');
const http = require('http');

console.log('🧪 TESTING API ENDPOINTS');
console.log('=========================\n');

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test cases
const tests = [
  {
    name: 'Products API - Get all products',
    url: `${BASE_URL}/api/products`,
    expectedStatus: 200,
    test: (data) => data.success === true && Array.isArray(data.data)
  },
  {
    name: 'Products API - Check data',
    url: `${BASE_URL}/api/products/check-data`,
    expectedStatus: 200,
    test: (data) => typeof data.totalProducts === 'number'
  },
  {
    name: 'Public Coupons API',
    url: `${BASE_URL}/api/coupons/public`,
    expectedStatus: 200,
    test: (data) => data.success === true && Array.isArray(data.coupons)
  },
  {
    name: 'Cart API - Unauthorized access',
    url: `${BASE_URL}/api/cart`,
    expectedStatus: 401,
    test: (data) => data.error === 'Unauthorized'
  },
  {
    name: 'Admin Users API - Unauthorized access',
    url: `${BASE_URL}/api/admin/users`,
    expectedStatus: 401,
    test: (data) => data.error === 'Unauthorized'
  },
  {
    name: 'Debug Cart API - Development only',
    url: `${BASE_URL}/api/debug/cart`,
    expectedStatus: 401, // Should be unauthorized without session
    test: (data) => data.error === 'Unauthorized'
  }
];

// Run tests
async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log('Running API endpoint tests...\n');

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const result = await makeRequest(test.url);
      
      const statusMatch = result.status === test.expectedStatus;
      const dataMatch = test.test ? test.test(result.data) : true;
      
      if (statusMatch && dataMatch) {
        console.log(`  ✅ PASS - Status: ${result.status}`);
        passed++;
      } else {
        console.log(`  ❌ FAIL - Expected status: ${test.expectedStatus}, Got: ${result.status}`);
        console.log(`  📄 Response:`, JSON.stringify(result.data, null, 2));
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ ERROR - ${error.message}`);
      failed++;
    }
    console.log('');
  }

  // Summary
  console.log('📋 TEST SUMMARY');
  console.log('================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All API endpoint tests passed!');
  } else {
    console.log(`\n⚠️ ${failed} test(s) failed. Check the output above for details.`);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    console.log('Checking if development server is running...');
    await makeRequest(`${BASE_URL}/api/products/check-data`);
    console.log('✅ Server is running\n');
    return true;
  } catch (error) {
    console.log('❌ Server is not running or not accessible');
    console.log('💡 Please start the development server with: npm run dev');
    console.log('🔗 Then access: http://localhost:3000\n');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    await runTests();
  } else {
    console.log('⏭️ Skipping API tests - server not available');
  }
}

main().catch(console.error);
