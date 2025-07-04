const fs = require('fs');
const path = require('path');

console.log('🔧 Sửa "use client" directive...');

// Hàm tìm tất cả file React components
function findReactFiles(dir) {
  let files = [];
  try {
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && item !== 'node_modules' && !item.startsWith('.')) {
        files = [...files, ...findReactFiles(fullPath)];
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.jsx'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return files;
}

// Hàm sửa use client directive
function fixUseClient(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Kiểm tra xem file có 'use client' không
    if (!content.includes("'use client'")) {
      return false;
    }
    
    // Loại bỏ 'use client' từ vị trí hiện tại
    content = content.replace(/\n\s*'use client';\s*\n/g, '\n');
    content = content.replace(/'use client';\s*\n/g, '');
    
    // Thêm 'use client' vào đầu file
    if (!content.startsWith("'use client';")) {
      content = "'use client';\n\n" + content;
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed use client: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

// Tìm tất cả React files trong src/app
const reactFiles = findReactFiles('src/app');

let fixedCount = 0;
reactFiles.forEach(file => {
  if (fixUseClient(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Đã sửa ${fixedCount} files có 'use client' directive.`);

// Sửa các file cụ thể được liệt kê trong lỗi
const specificFiles = [
  'src/app/about/layout.tsx',
  'src/app/about/page.tsx',
  'src/app/account/deposit/page.tsx',
  'src/app/account/page.tsx',
  'src/app/admin/coupons/page.tsx'
];

let specificFixed = 0;
specificFiles.forEach(file => {
  if (fixUseClient(file)) {
    specificFixed++;
  }
});

console.log(`✅ Đã sửa ${specificFixed} files cụ thể.`);

console.log('\n🎯 Tất cả "use client" directive đã được di chuyển lên đầu file!');
console.log('🚀 Thử build lại...');
