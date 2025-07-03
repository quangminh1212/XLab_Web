const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const readFile = promisify(fs.readFile);

const searchDirectory = path.join(__dirname, 'src');

async function findTaxPropertyUsage() {
  try {
    // Tìm tất cả các file .tsx trong thư mục src
    const files = await glob('**/*.tsx', { cwd: searchDirectory });
    let foundIssues = 0;

    console.log('Checking files for calculateCartTotals with tax property...');

    for (const file of files) {
      const filePath = path.join(searchDirectory, file);
      const content = await readFile(filePath, 'utf8');

      // Tìm mẫu "{ subtotal, tax } = calculateCartTotals" hoặc tương tự
      if (content.includes('tax') && content.includes('calculateCartTotals')) {
        const regex = /\{\s*[^}]*\btax\b[^}]*\}\s*=\s*calculateCartTotals/g;
        const matches = content.match(regex);
        
        if (matches) {
          console.log(`\n[ERROR] Found tax property usage in ${file}:`);
          foundIssues += matches.length;
          
          matches.forEach(match => {
            console.log(`  - ${match.trim()}`);
            
            // Tìm dòng chứa lỗi
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes(match.trim())) {
                console.log(`    Line ${i + 1}: ${lines[i].trim()}`);
                break;
              }
            }
          });
        }
      }
    }

    if (foundIssues === 0) {
      console.log('No issues found! All calculateCartTotals calls are correct.');
    } else {
      console.log(`\nFound ${foundIssues} issue(s) that need to be fixed.`);
    }
  } catch (error) {
    console.error('Error scanning files:', error);
  }
}

findTaxPropertyUsage(); 