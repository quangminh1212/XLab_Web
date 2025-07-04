const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const searchDirectory = path.join(__dirname, '..', 'src');

async function fixTaxPropertyUsage() {
  try {
    console.log('Scanning files for tax property issues...');
    
    // Tìm tất cả các file .tsx trong thư mục src
    const files = await glob('**/*.tsx', { cwd: searchDirectory });
    let fixedFiles = 0;
    
    for (const file of files) {
      const filePath = path.join(searchDirectory, file);
      const content = await readFile(filePath, 'utf8');
      
      // Tìm kiếm mẫu dạng "{ subtotal, tax } = calculateCartTotals"
      const regex = /\{\s*([^}]*)\btax\b([^}]*)\}\s*=\s*calculateCartTotals/g;
      
      if (regex.test(content)) {
        console.log(`Found issue in ${file}, fixing...`);
        
        // Reset regex và thay thế tất cả các trường hợp
        const fixedContent = content.replace(
          /\{\s*([^}]*)\btax\b([^}]*)\}\s*=\s*calculateCartTotals/g,
          (match, before, after) => {
            // Giữ lại subtotal nếu có và bỏ tax
            const hasBefore = before && before.includes('subtotal');
            const hasAfter = after && after.includes('subtotal');
            
            if (hasBefore || hasAfter) {
              return '{ subtotal } = calculateCartTotals';
            } else {
              return '{ subtotal } = calculateCartTotals';
            }
          }
        );
        
        // Nếu file đã được sửa, ghi lại
        if (fixedContent !== content) {
          await writeFile(filePath, fixedContent, 'utf8');
          fixedFiles++;
          console.log(`Fixed file: ${file}`);
          
          // Thêm dòng tax = 0 sau dòng được sửa nếu chưa có
          const fixedLines = fixedContent.split('\n');
          for (let i = 0; i < fixedLines.length; i++) {
            if (fixedLines[i].includes('{ subtotal } = calculateCartTotals')) {
              // Kiểm tra xem 2 dòng tiếp theo có chứa 'tax = 0' không
              const nextTwoLines = fixedLines.slice(i + 1, i + 3).join(' ');
              
              if (!nextTwoLines.includes('tax = 0')) {
                console.log(`  Adding tax = 0 declaration after line ${i + 1}`);
                
                // Thêm khai báo tax = 0
                const whitespace = fixedLines[i].match(/^(\s*)/)[1] || '  ';
                fixedLines.splice(i + 1, 0, `${whitespace}const tax = 0;`);
                
                await writeFile(filePath, fixedLines.join('\n'), 'utf8');
              }
              
              break;
            }
          }
        }
      }
    }
    
    console.log(`\nFixed ${fixedFiles} files with tax property issues.`);
    
  } catch (error) {
    console.error('Error fixing files:', error);
  }
}

fixTaxPropertyUsage(); 