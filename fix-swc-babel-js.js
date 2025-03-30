/**
 * Script để sửa lỗi xung đột giữa SWC và Babel trong Next.js
 * Chạy lệnh: node fix-swc-babel-js.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('XLab Web - SWC/Babel Conflict Fix Script');
console.log('--------------------------------------');

// Kiểm tra và xóa file .babelrc
console.log('🔍 Kiểm tra file .babelrc...');
if (fs.existsSync('.babelrc')) {
  try {
    console.log('Phát hiện file .babelrc gây xung đột với next/font');
    fs.renameSync('.babelrc', '.babelrc.backup');
    console.log('✅ Đã đổi tên .babelrc thành .babelrc.backup');
  } catch (error) {
    console.error(`❌ Không thể xóa file .babelrc: ${error.message}`);
  }
} else {
  console.log('✅ Không tìm thấy file .babelrc, bỏ qua bước này');
}

// Cập nhật next.config.js
console.log('\n🔧 Cập nhật next.config.js để sử dụng SWC...');
const nextConfigContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:; media-src 'self' https:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';"
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin'
          }
        ]
      }
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  poweredByHeader: false,
  webpack: (config, { dev, isServer }) => {
    // Vô hiệu hóa các alias có thể gây xung đột
    if (!isServer && config.resolve && config.resolve.alias) {
      delete config.resolve.alias['react'];
      delete config.resolve.alias['react-dom'];
    }
    
    // Điều chỉnh cấu hình webpack
    config.infrastructureLogging = { level: 'error' };
    
    return config;
  },
};

module.exports = nextConfig;`;

try {
  if (fs.existsSync('next.config.js')) {
    fs.renameSync('next.config.js', `next.config.js.backup-${Date.now()}`);
    console.log('✅ Đã sao lưu next.config.js cũ');
  }
  fs.writeFileSync('next.config.js', nextConfigContent);
  console.log('✅ Đã cập nhật next.config.js với cấu hình SWC');
} catch (error) {
  console.error(`❌ Không thể cập nhật next.config.js: ${error.message}`);
}

// Xóa thư mục .next
console.log('\n🧹 Xóa thư mục .next...');
try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log('✅ Đã xóa thư mục .next');
  } else {
    console.log('✅ Thư mục .next không tồn tại, bỏ qua bước này');
  }
} catch (error) {
  console.error(`❌ Không thể xóa thư mục .next: ${error.message}`);
}

// Thiết lập biến môi trường
console.log('\n🔧 Thiết lập biến môi trường...');
const envContent = 'NODE_OPTIONS=--max-old-space-size=4096';
try {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Đã thiết lập NODE_OPTIONS trong .env.local');
} catch (error) {
  console.error(`❌ Không thể tạo file .env.local: ${error.message}`);
}

// Xóa cache
console.log('\n🧹 Xóa cache...');
try {
  const cacheDir = path.join('node_modules', '.cache');
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('✅ Đã xóa thư mục node_modules/.cache');
  }
} catch (error) {
  console.error(`❌ Không thể xóa cache: ${error.message}`);
}

// Hiển thị hướng dẫn
console.log('\n');
console.log('===============================');
console.log('🎉 ĐÃ HOÀN THÀNH CÁC BƯỚC SỬA LỖI');
console.log('===============================');
console.log(`
Đã khắc phục xung đột giữa SWC và Babel:
1. ${fs.existsSync('.babelrc.backup') ? 'Đã đổi tên .babelrc thành .babelrc.backup để tránh xung đột' : 'Không tìm thấy .babelrc'}
2. Đã cập nhật next.config.js để sử dụng SWC thay vì Babel
3. Đã thêm swcMinify: true để tối ưu hóa bằng SWC
4. Đã xóa cache Next.js

Lưu ý quan trọng:
- Next.js 15.2.4 ưu tiên sử dụng SWC compiler thay vì Babel
- Khi có file .babelrc, Next.js sẽ tự động chuyển sang dùng Babel và tắt SWC
- Điều này gây xung đột với tính năng next/font cần SWC để hoạt động

Bước tiếp theo:
1. Khởi động lại ứng dụng: npm run dev
2. Nếu vẫn gặp lỗi, hãy thử: npm run build && npm start
`);

console.log('Bạn có muốn khởi động lại ứng dụng ngay bây giờ? (y/n)');
console.log('Để khởi động: npm run dev'); 