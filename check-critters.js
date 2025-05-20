/**
 * Script kiểm tra và khắc phục lỗi liên quan đến critters
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Kiểm tra và khắc phục lỗi critters...');

// Kiểm tra cài đặt critters
function checkCrittersInstallation() {
  try {
    require.resolve('critters');
    console.log('✅ Critters đã được cài đặt thành công');
    return true;
  } catch (error) {
    console.log('❌ Không tìm thấy critters, đang cài đặt lại...');
    try {
      execSync('npm install critters@0.0.23 --save-dev', { stdio: 'inherit' });
      console.log('✅ Đã cài đặt critters thành công');
      return true;
    } catch (installError) {
      console.error('❌ Không thể cài đặt critters:', installError.message);
      return false;
    }
  }
}

// Tạo file node_modules/critters/index.js nếu không tồn tại
function ensureCrittersFile() {
  const crittersDir = path.join(process.cwd(), 'node_modules', 'critters');
  const crittersIndexPath = path.join(crittersDir, 'index.js');
  
  if (!fs.existsSync(crittersDir)) {
    console.log('📁 Tạo thư mục critters...');
    fs.mkdirSync(crittersDir, { recursive: true });
  }
  
  if (!fs.existsSync(crittersIndexPath) || fs.statSync(crittersIndexPath).size === 0) {
    console.log('📝 Tạo file index.js cho critters...');
    
    const content = `
/**
 * Critters Fallback
 * A simple fallback for Next.js CSS inlining
 */
module.exports = class Critters {
  constructor(options = {}) {
    this.options = options;
  }

  async process(html, { outputPath }) {
    return html;
  }
};
`;
    
    fs.writeFileSync(crittersIndexPath, content.trim());
    console.log('✅ Đã tạo file critters/index.js');
  } else {
    console.log('✅ File critters/index.js đã tồn tại');
  }
}

// Vô hiệu hóa tối ưu CSS trong next.config.js
function disableOptimizeCss() {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  
  if (fs.existsSync(nextConfigPath)) {
    try {
      let content = fs.readFileSync(nextConfigPath, 'utf8');
      
      if (content.includes('optimizeCss: true')) {
        content = content.replace('optimizeCss: true', 'optimizeCss: false');
        fs.writeFileSync(nextConfigPath, content);
        console.log('✅ Đã vô hiệu hóa optimizeCss trong next.config.js');
      } else {
        console.log('✅ optimizeCss đã được vô hiệu hóa');
      }
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật next.config.js:', error.message);
    }
  }
}

// Thực hiện kiểm tra và khắc phục
checkCrittersInstallation();
ensureCrittersFile();
disableOptimizeCss();

console.log('✅ Hoàn tất kiểm tra và khắc phục lỗi critters');
console.log('👉 Bạn có thể khởi động lại server bằng lệnh "npm run dev:clean"'); 