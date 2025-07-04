const fs = require('fs');
const path = require('path');

console.log('🔧 Sửa lỗi import...');

// Hàm sửa lỗi import trong file
function fixImportErrors(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Sửa lỗi import bị duplicate hoặc broken
    // Pattern: import {\nimport { ... } from '...';
    content = content.replace(/import\s*\{\s*\nimport\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?\s*\n\s*([^}]*)\}\s*from\s*['"]([^'"]+)['"];?/g, 
      (match, p1, p2, p3, p4) => {
        if (p2 === p4) {
          // Same module, merge imports
          return `import { ${p1.trim()}, ${p3.trim()} } from '${p2}';`;
        } else {
          // Different modules, separate imports
          return `import { ${p1.trim()} } from '${p2}';\nimport { ${p3.trim()} } from '${p4}';`;
        }
      });
    
    // Sửa lỗi import statement bị broken
    content = content.replace(/import\s*\{\s*\n\s*import\s*\{/g, 'import {');
    
    // Sửa lỗi comment trong import
    content = content.replace(/\/\/ (import\s*\{[^}]*\})\s*from\s*['"][^'"]+['"];?/g, '$1');
    
    // Sửa lỗi export bị comment
    content = content.replace(/\/\/ (export\s*\{[^}]*\})\s*from\s*['"][^'"]+['"];?/g, '$1');
    
    // Sửa lỗi const bị comment
    content = content.replace(/\/\/ (const\s+\w+\s*=)/g, '$1');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

// Danh sách files có lỗi
const problematicFiles = [
  'src/app/api/admin/users/route.ts',
  'src/app/api/cart/route.ts',
  'src/app/api/user/deposit/route.ts'
];

let fixedCount = 0;

// Sửa từng file
problematicFiles.forEach(file => {
  if (fixImportErrors(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Đã sửa ${fixedCount} files có lỗi import.`);

// Kiểm tra file check-bank-transfer có lỗi ở dòng 136
const checkBankFile = 'src/app/api/payment/check-bank-transfer/route.ts';
if (fs.existsSync(checkBankFile)) {
  let content = fs.readFileSync(checkBankFile, 'utf8');
  const lines = content.split('\n');
  
  // Tìm và sửa lỗi ở dòng 136
  if (lines[135]) {
    console.log(`Dòng 136: ${lines[135]}`);
    
    // Sửa lỗi syntax
    if (lines[135].includes('// console.')) {
      lines[135] = lines[135].replace(/\/\/ console\.[^(]+\([^)]*\)[^;]*$/, '// console.log("Fixed");');
      
      const newContent = lines.join('\n');
      fs.writeFileSync(checkBankFile, newContent, 'utf8');
      console.log('✅ Fixed line 136 in check-bank-transfer');
      fixedCount++;
    }
  }
}

console.log(`\n🎯 Tổng cộng đã sửa ${fixedCount} files.`);
console.log('🚀 Thử chạy npm run lint lại...');
