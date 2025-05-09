/**
 * Script to update .gitignore with patterns for files generated during development
 */

const fs = require('fs');
const path = require('path');

// Đọc nội dung .gitignore
const gitignorePath = path.join(process.cwd(), '.gitignore');
let content = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';

// Danh sách các mục cần thêm vào .gitignore
const itemsToAdd = [
  '# Các file cần ignore sinh ra trong quá trình chạy dự án',
  '/.next/',
  '/.next/cache/',
  '/.next/server/',
  '/.next/static/',
  '/.next/trace',
  '/.next/*.json',
  '/.next/server/vendor-chunks/',
  '/.next/server/chunks/',
  '/.next/server/pages/',
  '/.next/server/*.json',
  '/.next/static/chunks/',
  '/.next/static/css/',
  '/.next/static/development/',
  '/.next/static/webpack/',
  '/.next/static/*.js',
  '/.swc/',
  '/.turbo/',
  '**/*.hot-update.js',
  '**/*.hot-update.json',
  '/node_modules/.cache/'
];

// Kiểm tra và thêm các mục thiếu
let updated = false;
for (const item of itemsToAdd) {
  if (!content.includes(item) && (item.startsWith('/') || item.startsWith('#') || item.startsWith('**'))) {
    content += item + '\n';
    updated = true;
  }
}

// Cập nhật file nếu có thay đổi
if (updated) {
  fs.writeFileSync(gitignorePath, content);
  console.log('Đã cập nhật .gitignore');
} else {
  console.log('.gitignore đã đầy đủ');
} 