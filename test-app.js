const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Kiểm tra file trace
const tracePath = path.join(__dirname, '.next', 'trace');
console.log('🔍 Kiểm tra file trace...');
if (fs.existsSync(tracePath)) {
  console.log('⚠️ File trace tồn tại tại đường dẫn:', tracePath);
} else {
  console.log('✅ Không tìm thấy file trace, không cần xử lý');
}

// Kiểm tra cấu hình Next.js
console.log('\n📋 Kiểm tra cấu hình Next.js...');
const configPath = path.join(__dirname, 'next.config.js');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Kiểm tra outputFileTracing
  if (configContent.includes('outputFileTracing: false')) {
    console.log('✅ Cấu hình đã tắt outputFileTracing');
  } else {
    console.log('❌ Cấu hình chưa tắt outputFileTracing');
  }
  
  // Kiểm tra outputFileTracingExcludes
  if (configContent.includes('outputFileTracingExcludes')) {
    console.log('✅ Cấu hình đã có outputFileTracingExcludes');
  } else {
    console.log('❌ Cấu hình chưa có outputFileTracingExcludes');
  }
  
  // Kiểm tra xem outputFileTracingIgnores có nằm trong experimental không
  if (configContent.includes('experimental: {') && 
      configContent.match(/experimental:\s*{[^}]*outputFileTracingIgnores/s)) {
    console.log('❌ outputFileTracingIgnores vẫn nằm trong experimental');
  } else {
    console.log('✅ outputFileTracingIgnores không nằm trong experimental');
  }
} else {
  console.log('❌ Không tìm thấy file cấu hình next.config.js');
}

// Thử khởi động ứng dụng
console.log('\n🚀 Thử khởi động ứng dụng...');
exec('npm run dev -- --port 3001', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Lỗi khi khởi động ứng dụng:', error);
    return;
  }
  
  console.log('✅ Đầu ra của lệnh khởi động:');
  console.log(stdout);
  
  if (stderr) {
    console.error('⚠️ Lỗi standard error:', stderr);
  }
});

// Thông báo kiểm tra kết thúc
console.log('\n✅ Đã hoàn thành kiểm tra');
console.log('✅ Nếu không thấy hiển thị lỗi EPERM với file trace, tức là đã sửa thành công!'); 