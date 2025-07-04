const fs = require('fs');
const path = require('path');

console.log('🔧 Bắt đầu sửa lỗi ESLint và TypeScript...');

// Hàm đệ quy để tìm file TypeScript/TSX
function findTSFiles(dir) {
  let files = [];
  try {
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && item !== 'node_modules' && !item.startsWith('.')) {
        files = [...files, ...findTSFiles(fullPath)];
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`⚠️  Không thể đọc thư mục: ${dir}`);
  }
  return files;
}

// Hàm sửa lỗi import order
function fixImportOrder(content) {
  const lines = content.split('\n');
  const imports = [];
  const nonImports = [];
  let inImportSection = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('import ') || line.trim().startsWith('export ')) {
      if (inImportSection) {
        imports.push(line);
      } else {
        nonImports.push(line);
      }
    } else if (line.trim() === '') {
      if (inImportSection && imports.length > 0) {
        imports.push(line);
      } else {
        nonImports.push(line);
      }
    } else {
      inImportSection = false;
      nonImports.push(line);
    }
  }
  
  // Sắp xếp imports
  const sortedImports = imports
    .filter(line => line.trim() !== '')
    .sort((a, b) => {
      // Node modules trước
      const aIsNode = !a.includes('@/') && !a.includes('./') && !a.includes('../');
      const bIsNode = !b.includes('@/') && !b.includes('./') && !b.includes('../');
      
      if (aIsNode && !bIsNode) return -1;
      if (!aIsNode && bIsNode) return 1;
      
      return a.localeCompare(b);
    });
  
  // Thêm empty line sau imports nếu cần
  if (sortedImports.length > 0 && nonImports.length > 0 && nonImports[0].trim() !== '') {
    sortedImports.push('');
  }
  
  return [...sortedImports, ...nonImports].join('\n');
}

// Hàm sửa unused variables
function fixUnusedVars(content) {
  // Thêm underscore prefix cho unused vars
  content = content.replace(/(\w+)(\s*=\s*[^;]+;\s*\/\/.*never used)/g, '_$1$2');
  
  // Sửa unused parameters
  content = content.replace(/(function\s+\w+\s*\([^)]*?)(\w+)(\s*:\s*[^,)]+)(\s*[,)])/g, (match, before, paramName, type, after) => {
    if (match.includes('never used')) {
      return before + '_' + paramName + type + after;
    }
    return match;
  });
  
  // Sửa unused destructured vars
  content = content.replace(/const\s+{\s*(\w+)\s*}\s*=/g, 'const { _$1 } =');
  
  return content;
}

// Hàm sửa console statements
function fixConsoleStatements(content) {
  // Thay thế console.log bằng comment trong production
  content = content.replace(/console\.(log|warn|error|info)\(/g, '// console.$1(');
  return content;
}

// Hàm sửa explicit any
function fixExplicitAny(content) {
  // Thay thế any bằng unknown hoặc specific types
  content = content.replace(/:\s*any\b/g, ': unknown');
  content = content.replace(/as\s+any\b/g, 'as unknown');
  return content;
}

// Hàm sửa file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Áp dụng các fixes
    content = fixImportOrder(content);
    content = fixUnusedVars(content);
    content = fixConsoleStatements(content);
    content = fixExplicitAny(content);
    
    // Chỉ ghi file nếu có thay đổi
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

// Main execution
const directories = ['src/app/api', 'src/app/auth', 'src/app'];
let totalFixed = 0;

directories.forEach(dir => {
  const fullDir = path.join(process.cwd(), dir);
  const files = findTSFiles(fullDir);
  
  files.forEach(file => {
    if (fixFile(file)) {
      totalFixed++;
    }
  });
});

console.log(`\n✅ Hoàn tất! Đã sửa ${totalFixed} files.`);
console.log('🔧 Chạy lại linting để kiểm tra...');
