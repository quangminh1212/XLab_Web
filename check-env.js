console.log("=== Kiểm tra môi trường ===");
console.log(`Node.js version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`Platform: ${process.platform}`);

// Kiểm tra quyền ghi file
const fs = require('fs');
const path = require('path');

try {
  const testFile = path.join(__dirname, 'test-write.txt');
  fs.writeFileSync(testFile, 'Test write access');
  console.log(`✅ Ghi file thành công: ${testFile}`);
  
  try {
    fs.unlinkSync(testFile);
    console.log(`✅ Xóa file thành công: ${testFile}`);
  } catch (err) {
    console.error(`❌ Lỗi khi xóa file: ${err.message}`);
  }
} catch (err) {
  console.error(`❌ Lỗi khi ghi file: ${err.message}`);
}

// Kiểm tra thư mục .next
try {
  const nextDir = path.join(__dirname, '.next');
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
    console.log(`✅ Đã tạo thư mục .next: ${nextDir}`);
  } else {
    console.log(`ℹ️ Thư mục .next đã tồn tại: ${nextDir}`);
    
    // Liệt kê các thư mục con
    const subdirs = fs.readdirSync(nextDir);
    console.log(`ℹ️ Các thư mục con của .next: ${subdirs.join(', ')}`);
  }
} catch (err) {
  console.error(`❌ Lỗi khi tạo/kiểm tra thư mục .next: ${err.message}`);
}

console.log("=== Kết thúc kiểm tra ==="); 