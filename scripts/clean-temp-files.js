const fs = require('fs');
const path = require('path');

/**
 * Script xóa các file tạm và cải thiện hiệu suất
 * Phần này sẽ xóa các file không cần thiết để giảm dung lượng dự án
 */

console.log('🧹 Đang dọn dẹp các file tạm...');

// Danh sách các file tạm cần xóa
const tempFiles = [
  'output.txt',
  'output-categories.txt',
  '.next/trace',
  '.next/cache/webpack',
  'node_modules/.cache',
];

// Xóa các file và thư mục tạm
tempFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        // Nếu là thư mục, chỉ xóa nội dung, không xóa thư mục
        console.log(`🗑️ Đang xóa nội dung thư mục: ${filePath}`);
        
        // Đọc tất cả các file trong thư mục
        const files = fs.readdirSync(fullPath);
        
        // Xóa từng file
        files.forEach(file => {
          const fileFullPath = path.join(fullPath, file);
          try {
            if (fs.statSync(fileFullPath).isDirectory()) {
              // Nếu là thư mục con, xóa đệ quy
              fs.rm(fileFullPath, { recursive: true, force: true }, err => {
                if (err) {
                  console.error(`❌ Không thể xóa thư mục: ${fileFullPath}`, err);
                }
              });
            } else {
              // Nếu là file, xóa trực tiếp
              fs.unlinkSync(fileFullPath);
            }
          } catch (err) {
            console.error(`❌ Lỗi khi xóa: ${fileFullPath}`, err);
          }
        });
      } else {
        // Nếu là file đơn, xóa trực tiếp
        console.log(`🗑️ Đang xóa file: ${filePath}`);
        fs.unlinkSync(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Lỗi khi xóa ${filePath}:`, error.message);
  }
});

// Kiểm tra và tạo lại thư mục bắt buộc
const requiredDirs = [
  '.next/cache/webpack/client-development',
  '.next/cache/webpack/server-development',
  '.next/trace',
];

requiredDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    try {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Đã tạo lại thư mục: ${dir}`);
    } catch (error) {
      console.error(`❌ Không thể tạo thư mục: ${dir}`, error.message);
    }
  }
});

// Tối ưu package.json nếu cần
const optimizePackageJson = () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  try {
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Thêm script clean vào package.json nếu chưa có
      if (!packageJson.scripts.clean) {
        packageJson.scripts.clean = 'node scripts/clean-temp-files.js';
        console.log('✅ Đã thêm script clean vào package.json');
      }
      
      // Sắp xếp các dependencies theo thứ tự bảng chữ cái
      if (packageJson.dependencies) {
        const sortedDependencies = {};
        Object.keys(packageJson.dependencies).sort().forEach(key => {
          sortedDependencies[key] = packageJson.dependencies[key];
        });
        packageJson.dependencies = sortedDependencies;
      }
      
      // Sắp xếp các devDependencies theo thứ tự bảng chữ cái
      if (packageJson.devDependencies) {
        const sortedDevDependencies = {};
        Object.keys(packageJson.devDependencies).sort().forEach(key => {
          sortedDevDependencies[key] = packageJson.devDependencies[key];
        });
        packageJson.devDependencies = sortedDevDependencies;
      }
      
      // Ghi lại file package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log('✅ Đã tối ưu file package.json');
    }
  } catch (error) {
    console.error('❌ Lỗi khi tối ưu package.json:', error.message);
  }
};

// Thực thi tối ưu package.json
optimizePackageJson();

console.log('✨ Hoàn thành dọn dẹp file tạm!');
console.log('💡 Mẹo: Chạy "npm run fix" trước khi khởi động dự án để sửa lỗi Next.js'); 