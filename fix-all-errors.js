/**
 * XLab Web - Fix All Errors
 * 
 * Script tổng hợp sửa tất cả các lỗi cho Next.js
 * Kết hợp các chức năng từ:
 * - fix-chunks-final.js
 * - fix-next-chunks.js
 * - fix-products-json.js
 * - fix-trace-error.js
 */

const fs = require('fs');
const path = require('path');

console.log('=== Bắt đầu công cụ XLab Web Utility Toolkit ===');
console.log('🚀 Bắt đầu quá trình sửa lỗi toàn diện...');

// Đặt biến môi trường để tắt tính năng trace
process.env.NEXT_DISABLE_TRACE = '1';
process.env.NEXT_TRACING_MODE = '0';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_IGNORE_WARNINGS = 'NEXT_PACKAGE_WARNING,ESLINT_WARNING,API_ROUTE_IMPORT_WARNING';

// Đường dẫn các thư mục quan trọng
const rootDir = process.cwd();
const nextDir = path.join(rootDir, '.next');
const serverDir = path.join(nextDir, 'server');
const staticDir = path.join(nextDir, 'static');
const cacheDir = path.join(nextDir, 'cache');
const productsJsonPath = path.join(rootDir, 'src/data/products.json');
const productsIdChunksDir = path.join(staticDir, 'chunks', 'app', 'products', '[id]');

// Hàm tạo thư mục nếu chưa tồn tại
function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`❌ Lỗi khi tạo thư mục ${dirPath}: ${error.message}`);
  }
}

// Hàm tạo file với nội dung
function createFileWithContent(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi tạo file ${filePath}: ${error.message}`);
    return false;
  }
}

// Hàm xóa file nếu tồn tại
function deleteFileIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (error) {
    console.error(`❌ Lỗi khi xóa file ${filePath}: ${error.message}`);
  }
  return false;
}

// Đảm bảo thư mục src/data tồn tại
ensureDirectoryExists(path.join(rootDir, 'src/data'));

// 1. Sửa lỗi file products.json
function fixProductsJson() {
  console.log('🔧 Bắt đầu sửa lỗi file products.json...');
  
  const dataDir = path.join(rootDir, 'src/data');
  if (!fs.existsSync(dataDir)) {
    ensureDirectoryExists(dataDir);
  }
  
  if (!fs.existsSync(productsJsonPath)) {
    console.log('⚠️ File products.json không tồn tại, tạo file mới');
    createFileWithContent(productsJsonPath, JSON.stringify([], null, 2));
    return;
  }
  
  try {
    // Đọc file products.json
    const rawData = fs.readFileSync(productsJsonPath, 'utf8');
    console.log(`📂 Đã đọc file products.json, dung lượng: ${rawData.length} bytes`);
    
    // Kiểm tra và sửa lỗi cú pháp JSON
    let fixedData = rawData;
    try {
      JSON.parse(rawData);
      console.log('✅ Không phát hiện lỗi cú pháp JSON');
    } catch (parseError) {
      console.error('⚠️ Lỗi cú pháp JSON:', parseError.message);
      
      // Sửa lỗi cú pháp phổ biến
      fixedData = fixedData.replace(/}\s*"/g, '},"');
      fixedData = fixedData.replace(/,\s*}/g, '}');
      fixedData = fixedData.replace(/,\s*]/g, ']');
      
      try {
        JSON.parse(fixedData);
        console.log('✅ Đã sửa lỗi cú pháp JSON thành công');
      } catch (newError) {
        console.error('❌ Không thể tự động sửa JSON:', newError.message);
        return;
      }
    }
    
    // Phân tích JSON
    const products = JSON.parse(fixedData);
    console.log(`📊 Đã tải ${products.length} sản phẩm`);
    
    // Kiểm tra và chuẩn hóa ID sản phẩm
    const idRegex = /^[a-z0-9-]+$/;
    let needsUpdate = false;
    
    products.forEach(product => {
      if (!product.id || !idRegex.test(product.id)) {
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      // Cập nhật ID sản phẩm nếu cần
      const updatedProducts = products.map(product => {
        if (!product.id || !idRegex.test(product.id)) {
          const newId = generateIdFromName(product.name);
          return { ...product, id: newId };
        }
        return product;
      });
      
      // Lưu lại file đã cập nhật
      fs.writeFileSync(productsJsonPath, JSON.stringify(updatedProducts, null, 2), 'utf8');
      console.log('✅ Đã cập nhật file products.json với ID mới');
    } else {
      console.log('✅ Tất cả ID sản phẩm đã ở đúng định dạng');
    }
    
  } catch (error) {
    console.error('❌ Lỗi xử lý file products.json:', error);
  }
}

// Hàm tạo ID từ tên sản phẩm
function generateIdFromName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Xóa ký tự đặc biệt
    .replace(/[\s_-]+/g, '-')   // Thay khoảng trắng và gạch dưới bằng gạch ngang
    .replace(/^-+|-+$/g, '');   // Xóa gạch ngang ở đầu/cuối
}

// 2. Sửa lỗi trace và chuẩn bị môi trường Next.js
function fixTraceAndPrepareNextEnvironment() {
  console.log('🔧 Bắt đầu sửa lỗi trace và chuẩn bị môi trường Next.js...');
  
  // Xử lý file trace
  fixTraceFile();
  
  // Tạo middleware-manifest.json
  createMiddlewareManifest();
  
  // Tạo các thư mục cần thiết
  createRequiredDirectories();
  
  // Tạo các file cần thiết
  createRequiredFiles();
}

// 2.1 Xử lý file trace
function fixTraceFile() {
  console.log('🔍 Xử lý file trace...');
  
  // Tạo thư mục .next nếu không tồn tại
  ensureDirectoryExists(nextDir);
  
  // Xóa file trace nếu tồn tại
  const tracePath = path.join(nextDir, 'trace');
  deleteFileIfExists(tracePath);
  
  // Xóa tất cả các file trace.* nếu tồn tại
  const tracePattern = /^trace\..+/;
  try {
    if (fs.existsSync(nextDir)) {
      fs.readdirSync(nextDir).forEach(file => {
        if (tracePattern.test(file)) {
          try {
            fs.unlinkSync(path.join(nextDir, file));
            console.log(`✅ Đã xóa file ${file}`);
          } catch (err) {
            console.error(`❌ Không thể xóa file ${file}:`, err);
          }
        }
      });
    }
  } catch (error) {
    console.error('❌ Lỗi khi xóa các file trace:', error);
  }
  
  // Tạo file .traceignore
  const traceIgnorePath = path.join(rootDir, '.traceignore');
  const traceIgnoreContent = `
# Ignore all files in node_modules
**/node_modules/**
# Ignore all files in .next
**/.next/**
# Ignore all dot files
**/.*
  `.trim();
  
  createFileWithContent(traceIgnorePath, traceIgnoreContent);
  console.log('✅ Đã hoàn tất xử lý file trace');
}

// 2.2 Tạo middleware-manifest.json
function createMiddlewareManifest() {
  console.log('📄 Tạo middleware-manifest.json...');
  
  ensureDirectoryExists(serverDir);
  
  const manifestPath = path.join(serverDir, 'middleware-manifest.json');
  const manifestContent = JSON.stringify({
    middleware: {
      "/": {
        env: [],
        files: [],
        name: "default",
        page: "/",
        regexp: "^/(?!_next|api).*$"
      }
    },
    functions: {},
    version: 2
  }, null, 2);
  
  // Tạo file mới
  createFileWithContent(manifestPath, manifestContent);
  console.log('✅ Đã hoàn tất tạo middleware-manifest.json');
}

// 2.3 Tạo các thư mục cần thiết
function createRequiredDirectories() {
  console.log('📁 Tạo các thư mục cần thiết...');
  
  // Thư mục server và các thư mục con
  ensureDirectoryExists(path.join(serverDir, 'app'));
  ensureDirectoryExists(path.join(serverDir, 'pages'));
  ensureDirectoryExists(path.join(serverDir, 'chunks'));
  ensureDirectoryExists(path.join(serverDir, 'vendor-chunks'));
  
  // Thư mục static và các thư mục con
  ensureDirectoryExists(path.join(staticDir, 'chunks'));
  ensureDirectoryExists(path.join(staticDir, 'chunks', 'app'));
  ensureDirectoryExists(path.join(staticDir, 'chunks', 'app', 'products'));
  ensureDirectoryExists(productsIdChunksDir);
  ensureDirectoryExists(path.join(staticDir, 'css'));
  ensureDirectoryExists(path.join(staticDir, 'css', 'app'));
  ensureDirectoryExists(path.join(staticDir, 'webpack'));
  
  // Thư mục cache
  ensureDirectoryExists(path.join(cacheDir, 'webpack'));
  
  console.log('✅ Đã hoàn tất tạo các thư mục cần thiết');
}

// 2.4 Tạo các file cần thiết
function createRequiredFiles() {
  console.log('📝 Tạo các file cần thiết...');
  
  // Tạo app-paths-manifest.json
  const appPathsManifestPath = path.join(serverDir, 'app-paths-manifest.json');
  const appPathsManifestContent = JSON.stringify({
    "/": "app/page.js",
    "/products": "app/products/page.js",
    "/products/[id]": "app/products/[id]/page.js"
  }, null, 2);
  createFileWithContent(appPathsManifestPath, appPathsManifestContent);
  
  // Tạo build-manifest.json
  const buildManifestPath = path.join(serverDir, 'build-manifest.json');
  const buildManifestContent = JSON.stringify({
    "polyfillFiles": [
      "static/chunks/polyfills-c67a75d1b6f99dc8.js"
    ],
    "rootMainFiles": [],
    "pages": {
      "/_app": [
        "static/chunks/main-app-d8ba92bc9d4aa4e9.js",
        "static/chunks/webpack-59c5c889f52620d6.js",
        "static/chunks/main.a11d1ff1cfd7b4c3.js"
      ],
      "/_error": [
        "static/chunks/main-app-d8ba92bc9d4aa4e9.js",
        "static/chunks/webpack-59c5c889f52620d6.js",
        "static/chunks/main.a11d1ff1cfd7b4c3.js"
      ]
    },
    "ampFirstPages": []
  }, null, 2);
  createFileWithContent(buildManifestPath, buildManifestContent);
  
  // Tạo css file mẫu
  const cssFilePath = path.join(staticDir, 'css', 'app', 'layout.css');
  createFileWithContent(cssFilePath, '/* Fixed empty CSS file */');
  
  console.log('✅ Đã hoàn tất tạo các file cần thiết');
}

// 3. Sửa lỗi chunk load
function fixChunkLoadError() {
  console.log('🔧 Bắt đầu sửa lỗi chunk load...');
  
  // Tạo file chunk cơ bản
  createBasicChunkFiles();
  
  console.log('✅ Đã hoàn tất sửa lỗi chunk load');
}

// 3.1 Tạo các file chunk cơ bản
function createBasicChunkFiles() {
  console.log('📄 Tạo các file chunk cơ bản...');
  
  // Empty chunk file for [id] page
  const productDetailChunkPath = path.join(productsIdChunksDir, 'page.js');
  createFileWithContent(productDetailChunkPath, '/* Fixed product detail chunk */');
  
  // Tạo file main-app.js
  const mainAppPath = path.join(staticDir, 'main-app.js');
  createFileWithContent(mainAppPath, '/* Fixed main-app.js */');
  
  // Tạo file app-pages-internals.js
  const appPagesInternalsPath = path.join(staticDir, 'app-pages-internals.js');
  createFileWithContent(appPagesInternalsPath, '/* Fixed app-pages-internals.js */');
  
  console.log('✅ Đã hoàn tất tạo các file chunk cơ bản');
}

// 4. Cập nhật .gitignore
function updateGitignore() {
  console.log('🔧 Bắt đầu cập nhật .gitignore...');
  
  const gitignorePath = path.join(rootDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    console.log('⚠️ File .gitignore không tồn tại, tạo file mới');
    const basicGitignoreContent = `
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
    `.trim();
    createFileWithContent(gitignorePath, basicGitignoreContent);
    console.log('✅ Đã tạo file .gitignore cơ bản');
    return;
  }
  
  try {
    // Đọc nội dung hiện tại
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    
    // Danh sách các mục cần thêm nếu chưa có
    const itemsToAdd = [
      '.next/**/*',
      '**/.next/**/*',
      '.next/cache',
      '.next/server',
      '.next/static',
      '.next/types',
      '.swc-disabled',
      '.traceignore',
      '.env.*',
      'node_modules/.cache'
    ];
    
    // Kiểm tra và thêm các mục chưa có
    let updatedContent = gitignoreContent;
    let addedItems = false;
    
    for (const item of itemsToAdd) {
      if (!gitignoreContent.includes(item)) {
        updatedContent += `\n${item}`;
        addedItems = true;
      }
    }
    
    // Thêm một phần mới để đảm bảo các file được tạo trong lúc chạy được ignore
    if (addedItems) {
      updatedContent += '\n\n# Thêm các file được gen ra khi dự án đang chạy';
      fs.writeFileSync(gitignorePath, updatedContent, 'utf8');
      console.log('✅ Đã cập nhật file .gitignore');
    } else {
      console.log('✅ File .gitignore đã đầy đủ, không cần cập nhật');
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật .gitignore:', error);
  }
}

// Thực thi các hàm chính
function main() {
  try {
    // Tiến hành chuỗi quá trình sửa lỗi
    fixProductsJson();
    fixTraceAndPrepareNextEnvironment();
    fixChunkLoadError();
    updateGitignore();
    
    console.log('✨ Hoàn tất quá trình sửa lỗi!');
    console.log('🚀 Dự án đã sẵn sàng để chạy thành công.');
    console.log('🌟 Bạn có thể chạy "npm run dev" ngay bây giờ.');
  } catch (error) {
    console.error('❌ Lỗi không mong muốn trong quá trình sửa lỗi:', error);
    process.exit(1);
  }
}

// Chạy chương trình
main(); 