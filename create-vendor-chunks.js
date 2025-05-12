const fs = require('fs');
const path = require('path');

// Các đường dẫn đến thư mục vendor-chunks
const vendorPaths = [
  path.join(__dirname, '.next', 'server', 'vendor-chunks'),
  path.join(__dirname, '.next', 'server', 'server', 'vendor-chunks')
];

// Tạo thư mục nếu chưa tồn tại
vendorPaths.forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Đã tạo thư mục: ${dir}`);
    } catch (err) {
      console.error(`Không thể tạo thư mục ${dir}:`, err.message);
    }
  }
});

// Tạo file tailwind-merge.js trong mỗi thư mục
vendorPaths.forEach(dir => {
  const filePath = path.join(dir, 'tailwind-merge.js');
  try {
    fs.writeFileSync(filePath, 'module.exports = {};', 'utf8');
    console.log(`Đã tạo file: ${filePath}`);
  } catch (err) {
    console.error(`Không thể tạo file ${filePath}:`, err.message);
  }
});

console.log('Đã tạo các file vendor-chunks thành công!'); 