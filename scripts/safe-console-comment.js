const fs = require('fs');

console.log('🔧 Comment console.log một cách an toàn...');

function safeCommentConsole(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Chỉ comment những dòng console.log đơn giản
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
      const trimmed = line.trim();
      
      // Chỉ comment những dòng console đơn giản (không có object hoặc multiline)
      if (trimmed.startsWith('console.') && 
          trimmed.includes('(') && 
          trimmed.includes(')') && 
          trimmed.includes(';') &&
          !trimmed.includes('{') &&
          !trimmed.includes('`')) {
        return line.replace('console.', '// console.');
      }
      
      return line;
    });
    
    content = fixedLines.join('\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Safely commented: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`❌ Error: ${filePath} - ${error.message}`);
    return false;
  }
}

// Tìm tất cả file trong src/app/api
function findApiFiles(dir) {
  let files = [];
  try {
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && item !== 'node_modules') {
        files = [...files, ...findApiFiles(fullPath)];
      } else if (stat.isFile() && item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore
  }
  return files;
}

const path = require('path');
const apiFiles = findApiFiles('src/app/api');

let fixedCount = 0;
apiFiles.forEach(file => {
  if (safeCommentConsole(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Đã comment console trong ${fixedCount} files.`);
console.log('🚀 Thử build lại...');
