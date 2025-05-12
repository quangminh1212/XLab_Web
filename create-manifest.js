const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục .next
const nextDir = path.join(__dirname, '.next');
const serverDir = path.join(nextDir, 'server');
const serverServerDir = path.join(serverDir, 'server');

// Tạo thư mục nếu chưa tồn tại
[serverDir, serverServerDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Đã tạo thư mục: ${dir}`);
    } catch (err) {
      console.error(`Không thể tạo thư mục ${dir}:`, err.message);
    }
  }
});

// Tạo app-paths-manifest.json
const appPathsManifest = {
  "/": "app/page.js",
  "/about": "app/about/page.js",
  "/accounts": "app/accounts/page.js",
  "/login": "app/login/page.js",
  "/register": "app/register/page.js",
  "/products": "app/products/page.js"
};

// Tạo next-font-manifest.json
const nextFontManifest = {
  "pages": {},
  "app": {
    "/": ["^1.0.0", {"0":"Inter"}]
  }
};

// Ghi các file manifest
[
  { dir: serverDir, name: 'app-paths-manifest.json', content: appPathsManifest },
  { dir: serverServerDir, name: 'app-paths-manifest.json', content: appPathsManifest },
  { dir: serverDir, name: 'next-font-manifest.json', content: nextFontManifest },
  { dir: serverServerDir, name: 'next-font-manifest.json', content: nextFontManifest }
].forEach(manifest => {
  const filePath = path.join(manifest.dir, manifest.name);
  try {
    fs.writeFileSync(filePath, JSON.stringify(manifest.content, null, 2), 'utf8');
    console.log(`Đã tạo file: ${filePath}`);
  } catch (err) {
    console.error(`Không thể tạo file ${filePath}:`, err.message);
  }
});

console.log('Đã tạo các file manifest thành công!'); 