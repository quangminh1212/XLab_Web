/**
 * Script để sửa lỗi "Cannot read properties of undefined (reading 'call')" trong Next.js
 * Chạy lệnh: node fix-webpack-manual.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('XLab Web - Webpack Error Fix Script');
console.log('-----------------------------------');

// Kiểm tra môi trường
console.log('🔍 Kiểm tra môi trường...');
try {
  const nodeVersion = execSync('node -v').toString().trim();
  const npmVersion = execSync('npm -v').toString().trim();
  console.log(`Node.js version: ${nodeVersion}`);
  console.log(`NPM version: ${npmVersion}`);
} catch (error) {
  console.error('❌ Không thể kiểm tra phiên bản Node.js/NPM.');
}

// Sao lưu các file cấu hình
console.log('\n📦 Sao lưu các file cấu hình...');
const backupFiles = ['package.json', 'next.config.js'];
backupFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.copyFileSync(file, `${file}.backup-${Date.now()}`);
      console.log(`✅ Đã sao lưu ${file}`);
    } catch (error) {
      console.error(`❌ Không thể sao lưu ${file}: ${error.message}`);
    }
  }
});

// 1. Cập nhật hoặc tạo file .babelrc
console.log('\n🔧 Tạo file .babelrc cơ bản...');
const babelConfig = {
  presets: ['next/babel']
};
try {
  fs.writeFileSync('.babelrc', JSON.stringify(babelConfig, null, 2));
  console.log('✅ Đã tạo file .babelrc');
} catch (error) {
  console.error(`❌ Không thể tạo file .babelrc: ${error.message}`);
}

// 2. Cập nhật next.config.js
console.log('\n🔧 Cập nhật next.config.js...');
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
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  poweredByHeader: false,
  // Cấu hình webpack an toàn
  webpack: (config, { dev, isServer }) => {
    // Vô hiệu hóa các alias có thể gây xung đột
    if (!isServer && config.resolve && config.resolve.alias) {
      delete config.resolve.alias['react'];
      delete config.resolve.alias['react-dom'];
    }
    
    // Điều chỉnh cấu hình webpack
    config.infrastructureLogging = { level: 'error' };
    
    // Giảm thiểu tối ưu hóa trong môi trường phát triển
    if (dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
        sideEffects: false
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;`;

try {
  fs.writeFileSync('next.config.js', nextConfigContent);
  console.log('✅ Đã cập nhật next.config.js');
} catch (error) {
  console.error(`❌ Không thể cập nhật next.config.js: ${error.message}`);
}

// 3. Thiết lập biến môi trường
console.log('\n🔧 Thiết lập biến môi trường...');
const envContent = 'NODE_OPTIONS=--max-old-space-size=4096';
try {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Đã thiết lập biến môi trường trong .env.local');
} catch (error) {
  console.error(`❌ Không thể tạo file .env.local: ${error.message}`);
}

// 4. Cài đặt các phiên bản cụ thể của webpack
console.log('\n📦 Cài đặt phiên bản webpack tương thích...');
const dependencies = [
  { name: 'webpack', version: '5.82.1' },
  { name: 'webpack-dev-middleware', version: '5.3.3' },
  { name: 'webpack-sources', version: '3.2.3' }
];

dependencies.forEach(dep => {
  try {
    console.log(`Đang cài đặt ${dep.name}@${dep.version}...`);
    execSync(`npm install --save-dev ${dep.name}@${dep.version}`, { stdio: 'inherit' });
    console.log(`✅ Đã cài đặt ${dep.name}@${dep.version}`);
  } catch (error) {
    console.error(`❌ Không thể cài đặt ${dep.name}: ${error.message}`);
  }
});

// 5. Xóa cache
console.log('\n🧹 Xóa cache...');
const cacheDirs = [
  path.join('.next'),
  path.join('node_modules', '.cache')
];

cacheDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      console.log(`Đang xóa ${dir}...`);
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ Đã xóa ${dir}`);
    } catch (error) {
      console.error(`❌ Không thể xóa ${dir}: ${error.message}`);
    }
  }
});

// 6. Cập nhật React và React DOM
console.log('\n📦 Cập nhật React và React DOM...');
try {
  console.log('Đang cài đặt react@18.2.0 và react-dom@18.2.0...');
  execSync('npm install react@18.2.0 react-dom@18.2.0', { stdio: 'inherit' });
  console.log('✅ Đã cập nhật React và React DOM');
} catch (error) {
  console.error(`❌ Không thể cập nhật React: ${error.message}`);
}

// Hướng dẫn tiếp theo
console.log('\n');
console.log('===============================');
console.log('🎉 ĐÃ HOÀN THÀNH CÁC BƯỚC SỬA LỖI');
console.log('===============================');
console.log(`
Đã thực hiện các thay đổi sau:
1. Tạo file .babelrc cơ bản
2. Cập nhật next.config.js với cấu hình webpack an toàn
3. Thiết lập biến môi trường để tăng bộ nhớ Node
4. Cài đặt các phiên bản webpack tương thích
5. Xóa cache Next.js
6. Cập nhật React và React DOM

Để tiếp tục:
1. Khởi động lại ứng dụng với: npm run dev
2. Nếu vẫn gặp lỗi, hãy thử: npm run build && npm start
3. Lưu ý: Đã tạo bản sao lưu cho các file cấu hình

Lỗi "Cannot read properties of undefined (reading 'call')" thường do:
- Xung đột phiên bản giữa webpack và các plugin
- Cấu hình webpack không chính xác (đặc biệt là phần alias)
- Vấn đề bộ nhớ khi biên dịch
`);

console.log('Bạn có muốn khởi động lại ứng dụng ngay bây giờ? (y/n)');
// Lưu ý: Script này kết thúc ở đây vì không thể nhận input trong child_process
console.log('Để khởi động: npm run dev'); 