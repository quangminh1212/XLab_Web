const fs = require('fs');
const path = require('path');

console.log('Kiểm tra cấu hình Next.js...');

// Kiểm tra file trace
const tracePath = path.join(__dirname, '.next', 'trace');
console.log('Kiểm tra file trace:', fs.existsSync(tracePath) ? 'Tồn tại' : 'Không tồn tại');

// Đọc cấu hình Next.js
try {
  const configContent = fs.readFileSync(path.join(__dirname, 'next.config.js'), 'utf8');
  console.log('\nNội dung cấu hình Next.js:');
  console.log(configContent);
} catch (error) {
  console.error('Lỗi khi đọc file cấu hình:', error.message);
}

console.log('\nKiểm tra hoàn tất!'); 