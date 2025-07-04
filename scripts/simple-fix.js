const fs = require('fs');
const path = require('path');

console.log('🔧 Chạy simple fix cho XLab Web...');

// Tạo thư mục i18n nếu chưa có
const i18nDirs = [
  'src/i18n/eng/product',
  'src/i18n/vie/product'
];

i18nDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    try {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Tạo thư mục: ${dir}`);
    } catch (error) {
      console.log(`⚠️  Không thể tạo thư mục: ${dir}`);
    }
  }
});

// Copy product files nếu cần
const productFiles = ['chatgpt.json', 'grok.json', 'index.ts'];
productFiles.forEach(file => {
  const source = path.join(process.cwd(), 'src/i18n/vie/product', file);
  const dest = path.join(process.cwd(), 'src/i18n/eng/product', file);
  
  if (fs.existsSync(source) && !fs.existsSync(dest)) {
    try {
      fs.copyFileSync(source, dest);
      console.log(`✅ Copy: ${file}`);
    } catch (error) {
      console.log(`⚠️  Không thể copy: ${file}`);
    }
  }
});

console.log('✅ Simple fix hoàn tất!');
