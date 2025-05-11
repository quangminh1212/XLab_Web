const fs = require('fs');
const path = require('path');

// Tạo thư mục nếu chưa tồn tại
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`✅ Tạo thư mục: ${directory}`);
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Tạo file nếu chưa tồn tại
function createFileIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    console.log(`✅ Tạo file: ${filePath}`);
    fs.writeFileSync(filePath, content);
  }
}

console.log('Bắt đầu sửa lỗi thiếu file...');

// Đảm bảo tồn tại các thư mục cần thiết
const requiredDirs = [
  '.next/server',
  '.next/static/chunks',
  '.next/static/webpack',
  '.next/static/css/app',
  '.next/static/app',
  '.next/server/app/api/auth/[...nextauth]',
  '.next/server/chunks',
  '.next/server/pages/vendor-chunks',
  '.next/server/vendor-chunks'
];

// Tạo các thư mục cần thiết
requiredDirs.forEach(dir => {
  ensureDirectoryExists(path.join(process.cwd(), dir));
});

// Tạo middleware-manifest.json
createFileIfNotExists(
  path.join(process.cwd(), '.next/server/middleware-manifest.json'),
  JSON.stringify({ middleware: {}, version: 1 }, null, 2)
);

// Tạo middleware-build-manifest.json
createFileIfNotExists(
  path.join(process.cwd(), '.next/server/middleware-build-manifest.json'),
  JSON.stringify({
    middleware: {},
    pages: {
      "/_app": [
        "static/chunks/webpack.js",
        "static/chunks/main.js",
        "static/css/app/layout.css",
        "static/chunks/pages/_app.js"
      ],
      "/_error": [
        "static/chunks/webpack.js",
        "static/chunks/main.js", 
        "static/chunks/pages/_error.js"
      ]
    },
    version: 1
  }, null, 2)
);

// Tạo app-paths-manifest.json
createFileIfNotExists(
  path.join(process.cwd(), '.next/server/app-paths-manifest.json'),
  JSON.stringify({}, null, 2)
);

// Tạo next-font-manifest.json
createFileIfNotExists(
  path.join(process.cwd(), '.next/server/next-font-manifest.json'),
  JSON.stringify({ pages: {}, app: {} }, null, 2)
);

// Tạo .gitkeep cho các thư mục
requiredDirs.forEach(dir => {
  createFileIfNotExists(
    path.join(process.cwd(), dir, '.gitkeep'),
    ''
  );
});

console.log('✅ Hoàn tất việc tạo các file còn thiếu!'); 