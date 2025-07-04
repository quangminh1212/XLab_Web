const fs = require('fs');
const path = require('path');

console.log('🔧 Sửa tất cả console.log bị broken...');

// Hàm tìm tất cả file TypeScript/JavaScript
function findFiles(dir) {
  let files = [];
  try {
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && item !== 'node_modules' && !item.startsWith('.')) {
        files = [...files, ...findFiles(fullPath)];
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return files;
}

// Hàm sửa console.log bị broken
function fixBrokenConsole(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Pattern 1: // console.log('text', {\n  prop: value,\n  prop2: value2\n});
    content = content.replace(
      /\/\/ console\.(log|warn|error|info)\([^{]*\{\s*\n([^}]*\n)*\s*\}\);?/g,
      (match) => {
        // Comment out the entire block
        return match.split('\n').map(line => line.startsWith('//') ? line : '// ' + line).join('\n');
      }
    );
    
    // Pattern 2: // console.log('text', {\n  prop,\n  prop2,\n});
    content = content.replace(
      /\/\/ console\.(log|warn|error|info)\([^)]*,\s*\{\s*\n([^}]*\n)*\s*\}\);?/g,
      (match) => {
        return match.split('\n').map(line => line.startsWith('//') ? line : '// ' + line).join('\n');
      }
    );
    
    // Pattern 3: Multiline console.log with object
    content = content.replace(
      /\/\/ console\.(log|warn|error|info)\([^{]*\{[^}]*\n[^}]*\}/g,
      (match) => {
        return match.split('\n').map(line => line.trim().startsWith('//') ? line : '// ' + line.trim()).join('\n');
      }
    );
    
    // Pattern 4: Fix broken object literals in comments
    content = content.replace(
      /\/\/ console\.(log|warn|error|info)\([^)]*\n\s*([^,\n]+),?\s*\n/g,
      '// console.$1(/* $2 */);'
    );
    
    // Pattern 5: Remove standalone property lines that are not commented
    const lines = content.split('\n');
    const fixedLines = [];
    let inBrokenConsole = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Check if this is start of a broken console
      if (trimmed.startsWith('// console.') && trimmed.includes('{')) {
        inBrokenConsole = true;
        fixedLines.push(line);
      }
      // Check if this is end of broken console
      else if (inBrokenConsole && (trimmed.includes('});') || trimmed === '});')) {
        inBrokenConsole = false;
        fixedLines.push(line.startsWith('//') ? line : '// ' + line);
      }
      // If we're in a broken console block, comment everything
      else if (inBrokenConsole) {
        fixedLines.push(line.startsWith('//') ? line : '// ' + line);
      }
      // Normal line
      else {
        fixedLines.push(line);
      }
    }
    
    content = fixedLines.join('\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed console logs: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

// Tìm và sửa tất cả files
const allFiles = findFiles('src');
let fixedCount = 0;

allFiles.forEach(file => {
  if (fixBrokenConsole(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Đã sửa ${fixedCount} files có console.log bị broken.`);
console.log('🚀 Thử build lại...');
