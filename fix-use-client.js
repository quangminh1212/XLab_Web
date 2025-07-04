const fs = require('fs');
const path = require('path');

// Danh sách các file cần sửa
const filesToFix = [
  'src/app/checkout/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/language-test/page.tsx',
  'src/app/login/page.tsx',
  'src/app/notifications/page.tsx',
  'src/app/page.tsx',
  'src/app/payment/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/products/[id]/page.tsx',
  'src/app/products/page.tsx',
  'src/app/search/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/orders/[id]/page.tsx',
  'src/app/orders/history/page.tsx',
  'src/app/orders/page.tsx',
  'src/app/payment/checkout/page.tsx',
  'src/app/payment/success/page.tsx',
  'src/app/products/[id]/ProductDetail.tsx',
  'src/app/products/[id]/fallback.tsx',
  'src/app/register/page.tsx',
  'src/app/services/page.tsx',
  'src/app/testimonials/page.tsx',
  'src/app/products/[id]/VoiceTypingDemo.tsx',
  'src/app/vouchers/page.tsx',
  'src/app/vouchers/public/page.tsx',
  'src/app/vouchers/used/page.tsx'
];

function fixUseClientDirective(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Tìm vị trí của 'use client'
    let useClientIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === "'use client';") {
        useClientIndex = i;
        break;
      }
    }
    
    if (useClientIndex === -1) {
      console.log(`⚠️  No 'use client' found in: ${filePath}`);
      return;
    }
    
    if (useClientIndex === 0) {
      console.log(`✅ Already correct: ${filePath}`);
      return;
    }
    
    // Xóa 'use client' từ vị trí hiện tại
    lines.splice(useClientIndex, 1);
    
    // Thêm 'use client' vào đầu file
    lines.unshift("'use client';");
    lines.unshift(""); // Thêm dòng trống sau 'use client'
    
    // Ghi lại file
    const newContent = lines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✅ Fixed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log('🔧 Fixing "use client" directive positions...\n');

filesToFix.forEach(filePath => {
  fixUseClientDirective(filePath);
});

console.log('\n✅ Done! All files have been processed.');
