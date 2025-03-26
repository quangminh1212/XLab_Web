/**
 * Fix-Next.js - Script để sửa lỗi hoạt động của Next.js
 * 
 * Script này thực hiện các bước sau:
 * 1. Xóa cache .next
 * 2. Tạo file next-env.d.ts nếu cần
 * 3. Sửa lỗi react-dom/client
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Đảm bảo terminal hiển thị Unicode đúng
process.stdout.setEncoding('utf8');

console.log('==== XLab Next.js Fix Tool ====');

// Xóa .next để đảm bảo build mới
if (fs.existsSync(path.join(process.cwd(), '.next'))) {
  console.log('Xóa thư mục .next...');
  try {
    fs.rmSync(path.join(process.cwd(), '.next'), { recursive: true, force: true });
    console.log('Đã xóa thư mục .next thành công');
  } catch (err) {
    console.error('Lỗi khi xóa thư mục .next:', err);
  }
}

// Kiểm tra và cập nhật node_modules
console.log('Kiểm tra thư viện React và Next.js...');

const requiredModules = [
  'react',
  'react-dom',
  'next',
  '@svgr/webpack',
  'styled-jsx'
];

let needsInstall = false;

for (const mod of requiredModules) {
  const modulePath = path.join(process.cwd(), 'node_modules', mod);
  if (!fs.existsSync(modulePath)) {
    console.log(`Không tìm thấy module ${mod}`);
    needsInstall = true;
    break;
  }
}

if (needsInstall) {
  console.log('Cài đặt lại các thư viện cần thiết...');
  try {
    execSync('npm install react@18.2.0 react-dom@18.2.0 next@13.5.6 @svgr/webpack styled-jsx --legacy-peer-deps --force',
      { stdio: 'inherit' });
    console.log('Đã cài đặt lại thư viện thành công');
  } catch (err) {
    console.error('Lỗi khi cài đặt thư viện:', err);
  }
}

// Sửa lỗi next.config.js
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('Kiểm tra và sửa next.config.js...');

  try {
    // Đọc file next.config.js
    let nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

    // Cập nhật cấu hình webpack
    if (nextConfigContent.includes('experimental: {')) {
      console.log('Cập nhật cấu hình experimental...');
      // Đơn giản hóa cấu hình experimental 
      nextConfigContent = nextConfigContent.replace(/experimental:[\s\S]*?\{[\s\S]*?\},/g, 'experimental: {},');
    }

    // Ghi lại file
    fs.writeFileSync(nextConfigPath, nextConfigContent, 'utf8');
    console.log('Đã cập nhật next.config.js thành công');
  } catch (err) {
    console.error('Lỗi khi cập nhật next.config.js:', err);
  }
}

// Tạo file next-env.d.ts nếu chưa có
const nextEnvPath = path.join(process.cwd(), 'next-env.d.ts');
if (!fs.existsSync(nextEnvPath)) {
  console.log('Tạo file next-env.d.ts...');
  const nextEnvContent = `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/api-reference/next.config.js/introduction
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    SITE_NAME: string
    SITE_URL: string
    SITE_DESCRIPTION: string
  }
}`;

  try {
    fs.writeFileSync(nextEnvPath, nextEnvContent, 'utf8');
    console.log('Đã tạo file next-env.d.ts thành công');
  } catch (err) {
    console.error('Lỗi khi tạo file next-env.d.ts:', err);
  }
}

// Đảm bảo các file có 'use client' ở đầu
const clientComponentPaths = [
  'src/app/loading.tsx',
  'src/app/products/loading.tsx',
  'src/app/products/[id]/loading.tsx',
  'src/app/error.tsx'
];

clientComponentPaths.forEach(compPath => {
  const fullPath = path.join(process.cwd(), compPath);
  if (fs.existsSync(fullPath)) {
    console.log(`Kiểm tra 'use client' trong ${compPath}...`);
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('use client')) {
        content = `'use client';\n\n${content}`;
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Đã thêm 'use client' vào ${compPath}`);
      }
    } catch (err) {
      console.error(`Lỗi khi cập nhật ${compPath}:`, err);
    }
  }
});

console.log('Fix hoàn tất! Có thể chạy "npm run dev" để khởi động dự án.'); 