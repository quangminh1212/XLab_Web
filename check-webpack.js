/**
 * Script kiểm tra các toán tử trong file webpack có thể gây lỗi trên Windows
 */
const fs = require('fs');
const path = require('path');

function checkLogicalOperators(content, filePath) {
  const hasLogicalAssignment = 
    content.includes('||=') || 
    content.includes('&&=') || 
    content.includes('??=');
  
  const hasNullishCoalescing = content.includes('??');
  
  if (hasLogicalAssignment || hasNullishCoalescing) {
    console.log(`⚠️ ${filePath} chứa toán tử có thể gây lỗi:`);
    if (content.includes('||=')) console.log('  - Toán tử ||=');
    if (content.includes('&&=')) console.log('  - Toán tử &&=');
    if (content.includes('??=')) console.log('  - Toán tử ??=');
    if (content.includes('??') && !content.includes('??=')) console.log('  - Toán tử ??');
    return true;
  }
  
  return false;
}

// Hàm lấy tất cả các file .js trong một thư mục và các thư mục con
function getAllJsFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      
      try {
        if (fs.statSync(filePath).isDirectory()) {
          arrayOfFiles = getAllJsFiles(filePath, arrayOfFiles);
        } else if (file.endsWith('.js')) {
          arrayOfFiles.push(filePath);
        }
      } catch (error) {
        // Bỏ qua lỗi đọc file/thư mục
      }
    });
  } catch (error) {
    console.error(`❌ Lỗi khi duyệt thư mục ${dirPath}: ${error.message}`);
  }
  
  return arrayOfFiles;
}

try {
  console.log('🔍 Bắt đầu kiểm tra các file webpack...');
  
  // Danh sách các file cần kiểm tra
  const filesToCheck = [
    // File webpack.js chính - thường là nguồn của lỗi
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'webpack.js'),
    // Các file webpack khác có thể gây lỗi
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'server', 'config-utils.js'),
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'bundle5.js'),
    path.join(process.cwd(), 'node_modules', 'webpack', 'lib', 'javascript', 'JavascriptParser.js'),
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'bundle4.js'),
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'bundle3.js'),
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'bundle-webpack.js'),
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack', 'bundle-webpack-context.js'),
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'build', 'webpack-config.js')
  ];
  
  let problemCount = 0;
  
  // Kiểm tra từng file trong danh sách
  for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) {
      console.log(`ℹ️ File không tồn tại: ${filePath}`);
      continue;
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (checkLogicalOperators(content, filePath)) {
        problemCount++;
      }
    } catch (err) {
      console.error(`❌ Lỗi khi đọc file ${filePath}: ${err.message}`);
    }
  }
  
  // Các thư mục chính cần kiểm tra
  const dirsToCheck = [
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', 'webpack'),
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'server'),
    path.join(process.cwd(), 'node_modules', 'next', 'dist', 'build')
  ];
  
  // Duyệt tất cả các file JS trong các thư mục
  for (const dir of dirsToCheck) {
    if (fs.existsSync(dir)) {
      console.log(`\n🔍 Kiểm tra thư mục: ${dir}`);
      
      // Lấy tất cả file JS trong thư mục và các thư mục con
      const jsFiles = getAllJsFiles(dir);
      console.log(`ℹ️ Tìm thấy ${jsFiles.length} file .js`);
      
      // Kiểm tra từng file
      for (const filePath of jsFiles) {
        // Bỏ qua các file đã kiểm tra ở trên
        if (filesToCheck.includes(filePath)) continue;
        
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          if (checkLogicalOperators(content, filePath)) {
            problemCount++;
          }
        } catch (err) {
          // Bỏ qua lỗi đọc file
        }
      }
    } else {
      console.log(`ℹ️ Thư mục không tồn tại: ${dir}`);
    }
  }
  
  console.log(`\n✅ Hoàn tất kiểm tra. Tìm thấy ${problemCount} file có khả năng gây lỗi.`);
  
  if (problemCount > 0) {
    console.log(`\n⚠️ Đề xuất: Chạy lệnh 'node fix-webpack-direct.js' để sửa các lỗi này.`);
  } else {
    console.log(`\n✅ Tuyệt vời! Không tìm thấy file nào có khả năng gây lỗi.`);
  }
} catch (error) {
  console.error(`❌ Lỗi: ${error.message}`);
} 