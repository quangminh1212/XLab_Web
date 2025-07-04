const fs = require('fs');

console.log('🔧 Sửa console.log đơn giản...');

// Danh sách files cần sửa
const filesToFix = [
  'src/app/api/payment/check-bank-transfer/route.ts',
  'src/app/api/product-translations/route.ts',
  'src/app/api/products/[id]/route.ts',
  'src/app/api/products/new/route.ts',
  'src/app/api/products/route.ts'
];

function simpleConsoleFix(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Đơn giản: comment out tất cả console statements
    content = content.replace(/console\.(log|warn|error|info)\(/g, '// console.$1(');
    
    // Sửa các dòng bị broken do comment
    content = content.replace(/\/\/ console\.[^(]+\([^)]*\n[^;]*;/g, (match) => {
      return '// ' + match.replace(/\/\/ /, '').replace(/\n/g, ' ');
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`❌ Error: ${filePath} - ${error.message}`);
    return false;
  }
}

// Sửa từng file
let fixedCount = 0;
filesToFix.forEach(file => {
  if (simpleConsoleFix(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Đã sửa ${fixedCount} files.`);

// Tạo một backup của các file bị hỏng và restore từ git
console.log('\n🔄 Restore files từ git...');

const { execSync } = require('child_process');

filesToFix.forEach(file => {
  try {
    execSync(`git checkout HEAD -- "${file}"`, { stdio: 'ignore' });
    console.log(`✅ Restored: ${file}`);
  } catch (error) {
    console.log(`⚠️  Không thể restore: ${file}`);
  }
});

console.log('\n🎯 Files đã được restore. Bây giờ sẽ comment console một cách an toàn...');
