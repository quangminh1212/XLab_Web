const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

async function cleanWebpackCache() {
  console.log('Bắt đầu xóa cache Next.js và Webpack...');
  
  const directories = [
    path.join(process.cwd(), '.next', 'cache'),
    path.join(process.cwd(), '.next', 'static', 'webpack'),
    path.join(process.cwd(), 'node_modules', '.cache')
  ];

  try {
    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        console.log(`Đang xóa ${dir}...`);
        await rimraf.rimraf(dir);
        console.log(`Đã xóa ${dir} thành công.`);
      } else {
        console.log(`Thư mục ${dir} không tồn tại, bỏ qua.`);
      }
    }
    
    console.log('Đã xóa cache thành công. Khởi động lại ứng dụng Next.js để áp dụng thay đổi.');
  } catch (err) {
    console.error('Lỗi khi xóa cache:', err);
  }
}

cleanWebpackCache(); 