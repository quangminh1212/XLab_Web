/**
 * Fix đơn giản cho lỗi vendor-chunks trong Next.js
 */

const fs = require('fs');
const path = require('path');

// Tạo thư mục vendor-chunks
const vendorChunksDir = path.join(__dirname, '.next', 'server', 'vendor-chunks');
if (!fs.existsSync(vendorChunksDir)) {
  fs.mkdirSync(vendorChunksDir, { recursive: true });
  console.log(`Đã tạo thư mục: ${vendorChunksDir}`);
}

// Tạo next.js file trong vendor-chunks
const nextJsPath = path.join(vendorChunksDir, 'next.js');
fs.writeFileSync(nextJsPath, 'module.exports = require("next");');
console.log(`Đã tạo file: ${nextJsPath}`);

// Thêm các module phổ biến khác
const commonModules = [
  'react.js',
  'react-dom.js',
  'scheduler.js',
  'use-sync-external-store.js',
  'react-server-dom-webpack.js',
  'react-server-dom-webpack-client.js'
];

commonModules.forEach(module => {
  const moduleName = module.replace('.js', '');
  const modulePath = path.join(vendorChunksDir, module);
  fs.writeFileSync(modulePath, `module.exports = require("${moduleName}");`);
  console.log(`Đã tạo file: ${modulePath}`);
});

// Tạo file font-manifest
const fontManifestPath = path.join(__dirname, '.next', 'server', 'next-font-manifest.json');
fs.writeFileSync(fontManifestPath, '{"pages":{},"app":{}}');
console.log(`Đã tạo file: ${fontManifestPath}`);

console.log('Hoàn tất việc sửa lỗi vendor-chunks và font-manifest.'); 