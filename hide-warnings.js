/**
 * Script để ẩn các cảnh báo Next.js khi khởi động
 * - Tạo/cập nhật file .env.local để vô hiệu hóa cảnh báo
 * - Đặt biến môi trường phù hợp
 */

const fs = require('fs');
const path = require('path');

function log(message) {
  console.log(`[hide-warnings] ${message}`);
}

try {
  // Đường dẫn đến file .env.local
  const envPath = path.join(__dirname, '.env.local');
  
  // Nội dung cần thêm vào file .env.local
  const envContent = `
# Vô hiệu hóa các cảnh báo Next.js
NEXT_IGNORE_WARNINGS=NEXT_PACKAGE_WARNING,ESLINT_WARNING,API_ROUTE_IMPORT_WARNING,BABEL_UNUSED_TRANSFORMS_WARNING
NEXT_TELEMETRY_DISABLED=1

# Cấu hình môi trường
NODE_ENV=development
`;
  
  // Kiểm tra file đã tồn tại chưa
  if (fs.existsSync(envPath)) {
    log('File .env.local đã tồn tại, đang cập nhật...');
    
    // Đọc nội dung hiện tại
    const currentContent = fs.readFileSync(envPath, 'utf8');
    
    // Kiểm tra xem các biến đã được đặt chưa
    const hasIgnoreWarnings = currentContent.includes('NEXT_IGNORE_WARNINGS=');
    const hasTelemetryDisabled = currentContent.includes('NEXT_TELEMETRY_DISABLED=');
    
    if (!hasIgnoreWarnings || !hasTelemetryDisabled) {
      // Thêm các biến còn thiếu
      let newContent = currentContent;
      
      if (!hasIgnoreWarnings) {
        newContent += `\nNEXT_IGNORE_WARNINGS=NEXT_PACKAGE_WARNING,ESLINT_WARNING,API_ROUTE_IMPORT_WARNING,BABEL_UNUSED_TRANSFORMS_WARNING\n`;
      }
      
      if (!hasTelemetryDisabled) {
        newContent += `\nNEXT_TELEMETRY_DISABLED=1\n`;
      }
      
      // Ghi lại file
      fs.writeFileSync(envPath, newContent);
      log('Đã cập nhật file .env.local');
    } else {
      log('Các cấu hình cần thiết đã tồn tại trong file .env.local');
    }
  } else {
    // Tạo file mới
    log('Đang tạo file .env.local...');
    fs.writeFileSync(envPath, envContent.trim());
    log('Đã tạo file .env.local');
  }
  
  // Đặt biến môi trường để ảnh hưởng đến quá trình hiện tại
  process.env.NEXT_IGNORE_WARNINGS = 'NEXT_PACKAGE_WARNING,ESLINT_WARNING,API_ROUTE_IMPORT_WARNING,BABEL_UNUSED_TRANSFORMS_WARNING';
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  
  log('Đã hoàn tất việc ẩn cảnh báo Next.js');
} catch (error) {
  log(`Lỗi không mong muốn: ${error.message}`);
} 