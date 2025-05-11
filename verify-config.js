const fs = require('fs');
const path = require('path');

console.log('=== Kiểm tra cấu hình Next.js ===');

// Kiểm tra cấu hình Next.js
const nextConfigPath = path.join(__dirname, 'next.config.js');
try {
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Kiểm tra vị trí của swcMinify
  if (nextConfig.includes('compiler: {')) {
    console.log('✅ Tìm thấy cấu hình compiler');
    
    // Tìm hiểu xem swcMinify có trong compiler không
    const compilerMatch = nextConfig.match(/compiler:\s*{([^}]*)}/);
    if (compilerMatch && compilerMatch[1].includes('swcMinify')) {
      console.log('❌ LỖI: swcMinify vẫn còn trong compiler, cần di chuyển ra ngoài');
    } else {
      console.log('✅ swcMinify không có trong compiler');
    }
  } else {
    console.log('❌ Không tìm thấy cấu hình compiler');
  }
  
  // Kiểm tra xem swcMinify có ở cấp cao nhất không
  if (nextConfig.match(/swcMinify:\s*(true|false)/)) {
    console.log('✅ swcMinify đã được đặt ở cấp cao nhất');
  } else {
    console.log('❌ swcMinify chưa được đặt ở cấp cao nhất');
  }
  
  // Hiển thị toàn bộ cấu hình
  console.log('\n=== Nội dung cấu hình Next.js ===');
  console.log(nextConfig);
  
} catch (err) {
  console.error('❌ Lỗi khi đọc file next.config.js:', err.message);
}

console.log('\n=== Kết thúc kiểm tra ==='); 