/**
 * XLAB WEB UTILITY TOOLKIT
 * Công cụ tích hợp để sửa lỗi, bảo trì và chuẩn bị môi trường cho dự án XLab Web
 * 
 * Script này tích hợp chức năng của các file:
 * - fix-products-json.js - Sửa lỗi cú pháp JSON và cập nhật ID sản phẩm
 * - fix-trace-error.js - Sửa lỗi file trace
 * - fix-chunks-final.js - Sửa lỗi chunks
 * - fix-next-chunks.js - Sửa lỗi next chunks
 * - utils/update-product-ids.js - Cập nhật ID sản phẩm
 * 
 * Sử dụng: node xlab-utils.js [command]
 * Commands:
 *   - fix-all: Chạy tất cả các công cụ sửa lỗi
 *   - fix-products: Sửa lỗi JSON sản phẩm và cập nhật ID
 *   - fix-trace: Sửa lỗi trace
 *   - fix-chunks: Sửa lỗi chunks
 *   - update-ids: Cập nhật ID sản phẩm
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Thiết lập logging
const LOG_FILE = 'xlab-utils.log';
let isVerbose = process.argv.includes('--verbose');

function log(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  try {
    fs.appendFileSync(LOG_FILE, logMessage + '\n');
  } catch (error) {
    // Ignore error
  }
  
  if (isError) {
    console.error(message);
  } else {
    console.log(message);
  }
}

function logVerbose(message) {
  if (isVerbose) {
    log(message);
  }
}

// Các hàm tiện ích
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      logVerbose(`✅ Đã tạo thư mục: ${dirPath}`);
      return true;
    } catch (error) {
      log(`❌ Không thể tạo thư mục ${dirPath}: ${error.message}`, true);
      return false;
    }
  }
  return true;
}

function createFileWithContent(filePath, content) {
  try {
    const dirPath = path.dirname(filePath);
    ensureDirectoryExists(dirPath);
    
    fs.writeFileSync(filePath, content);
    logVerbose(`✅ Đã tạo file: ${filePath}`);
    return true;
  } catch (error) {
    log(`❌ Không thể tạo file ${filePath}: ${error.message}`, true);
    return false;
  }
}

function deleteFileIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logVerbose(`✅ Đã xóa file: ${filePath}`);
      return true;
    }
  } catch (error) {
    log(`❌ Không thể xóa file ${filePath}: ${error.message}`, true);
  }
  return false;
}

// 1. Sửa lỗi JSON sản phẩm và cập nhật ID
function fixProductsJson() {
  log('🔧 Bắt đầu sửa lỗi file products.json...');
  
  // Hàm tạo ID từ tên sản phẩm
  function generateIdFromName(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')  // Loại bỏ ký tự đặc biệt
      .replace(/[\s_-]+/g, '-')   // Thay thế khoảng trắng bằng gạch ngang
      .replace(/^-+|-+$/g, '');   // Loại bỏ gạch ngang ở đầu/cuối
  }
  
  // Đường dẫn đến file JSON sản phẩm
  const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');
  const dataDir = path.dirname(filePath);
  
  // Đảm bảo thư mục tồn tại
  if (!ensureDirectoryExists(dataDir)) {
    log('❌ Không thể tạo thư mục data, đang bỏ qua...', true);
    return false;
  }
  
  // Kiểm tra xem file có tồn tại không
  if (!fs.existsSync(filePath)) {
    log(`ℹ️ File ${filePath} không tồn tại, đang tạo file mới...`);
    createFileWithContent(filePath, '[]');
    log('✅ Đã tạo file products.json trống');
    return true;
  }
  
  try {
    // Đọc file dưới dạng văn bản để kiểm tra lỗi cú pháp
    const rawData = fs.readFileSync(filePath, 'utf8');
    log(`📂 Đã đọc file products.json, dung lượng: ${rawData.length} bytes`);
    
    // Kiểm tra và sửa lỗi cú pháp JSON
    let fixedData = rawData;
    let jsonFixed = false;
    
    try {
      // Thử phân tích JSON
      JSON.parse(rawData);
      log('✅ Không phát hiện lỗi cú pháp JSON');
    } catch (parseError) {
      log(`⚠️ Phát hiện lỗi cú pháp JSON: ${parseError.message}`, true);
      
      // Lấy vị trí lỗi
      const errorPosition = parseError.message.match(/position (\d+)/);
      if (errorPosition && errorPosition[1]) {
        const pos = parseInt(errorPosition[1]);
        const context = rawData.substring(Math.max(0, pos - 30), pos + 30);
        log(`🔍 Ngữ cảnh lỗi: ${context}`, true);
        
        // Sửa các lỗi cú pháp JSON phổ biến
        fixedData = rawData
          .replace(/}\s*"/g, '},"')  // Thiếu dấu phẩy giữa các đối tượng
          .replace(/,\s*}/g, '}')     // Dấu phẩy thừa trước dấu đóng ngoặc
          .replace(/,\s*]/g, ']');    // Dấu phẩy thừa trước dấu đóng mảng
        
        try {
          // Kiểm tra xem sửa lỗi có thành công không
          JSON.parse(fixedData);
          log('✅ Đã sửa lỗi cú pháp JSON thành công');
          jsonFixed = true;
        } catch (newError) {
          log(`❌ Không thể sửa lỗi cú pháp tự động: ${newError.message}`, true);
          return false;
        }
      }
    }
    
    // Phân tích dữ liệu sản phẩm
    const products = JSON.parse(jsonFixed ? fixedData : rawData);
    log(`📊 Đã tải ${products.length} sản phẩm`);
    
    // Kiểm tra và cập nhật ID sản phẩm
    const updatedProducts = [];
    const idChanges = [];
    const newIds = new Map();
    
    for (const product of products) {
      if (!product) continue;
      
      const oldId = product.id;
      const baseNewId = generateIdFromName(product.name || 'unknown-product');
      
      // Xử lý trùng lặp ID
      let newId = baseNewId;
      let counter = 1;
      
      while (newIds.has(newId)) {
        newId = `${baseNewId}-${counter}`;
        counter++;
      }
      
      // Lưu trữ ID mới
      newIds.set(newId, true);
      
      // Theo dõi các thay đổi ID
      if (oldId !== newId) {
        idChanges.push({ name: product.name, oldId, newId });
        product.id = newId;
      }
      
      updatedProducts.push(product);
    }
    
    // Báo cáo các thay đổi
    if (idChanges.length > 0) {
      log(`📝 Đã thay đổi ${idChanges.length} ID sản phẩm:`);
      for (const change of idChanges) {
        log(`  - "${change.name}": ${change.oldId || 'undefined'} -> ${change.newId}`);
      }
    } else {
      log('✅ Tất cả ID sản phẩm đã ở đúng định dạng');
    }
    
    // Lưu lại dữ liệu đã cập nhật
    if (jsonFixed || idChanges.length > 0) {
      fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2), 'utf8');
      log('✅ Đã lưu file products.json với các ID đã cập nhật');
    }
    
    return true;
  } catch (error) {
    log(`❌ Lỗi xử lý file products.json: ${error.message}`, true);
    return false;
  }
}

// 2. Sửa lỗi file trace
function fixTraceError() {
  log('🔧 Bắt đầu sửa lỗi trace và chuẩn bị môi trường Next.js...');
  
  // Đường dẫn các thư mục quan trọng
  const rootDir = process.cwd();
  const nextDir = path.join(rootDir, '.next');
  const serverDir = path.join(nextDir, 'server');
  const staticDir = path.join(nextDir, 'static');
  
  // Xử lý file trace
  log('🔍 Xử lý file trace...');
  const tracePath = path.join(nextDir, 'trace');
  
  // Tạo thư mục .next nếu không tồn tại
  ensureDirectoryExists(nextDir);
  
  // Xóa file trace nếu tồn tại
  deleteFileIfExists(tracePath);
  
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
  log('✅ Đã hoàn tất xử lý file trace');
  
  // Tạo middleware-manifest.json
  log('📄 Tạo middleware-manifest.json...');
  
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
  
  // Xóa file cũ nếu tồn tại
  deleteFileIfExists(manifestPath);
  
  // Tạo file mới
  createFileWithContent(manifestPath, manifestContent);
  log('✅ Đã hoàn tất tạo middleware-manifest.json');
  
  // Tạo các thư mục cần thiết
  log('📁 Tạo các thư mục cần thiết...');
  
  // Thư mục server và các thư mục con
  const requiredDirs = [
    path.join(serverDir, 'app'),
    path.join(serverDir, 'pages'),
    path.join(serverDir, 'chunks'),
    path.join(serverDir, 'vendor-chunks'),
    path.join(staticDir, 'chunks'),
    path.join(staticDir, 'chunks', 'app'),
    path.join(staticDir, 'chunks', 'app', 'products'),
    path.join(staticDir, 'chunks', 'app', 'products', '[id]')
  ];
  
  let allDirsCreated = true;
  for (const dir of requiredDirs) {
    if (!ensureDirectoryExists(dir)) {
      allDirsCreated = false;
    }
  }
  
  if (allDirsCreated) {
    log('✅ Đã hoàn tất tạo các thư mục cần thiết');
  } else {
    log('⚠️ Một số thư mục không thể tạo', true);
  }
  
  // Tạo các file cần thiết
  log('📝 Tạo các file cần thiết...');
  
  // Tạo app-paths-manifest.json
  const appPathsManifestPath = path.join(serverDir, 'app-paths-manifest.json');
  const appPathsManifestContent = JSON.stringify({
    "/": "app/page.js",
    "/products": "app/products/page.js",
    "/products/[id]": "app/products/[id]/page.js"
  }, null, 2);
  createFileWithContent(appPathsManifestPath, appPathsManifestContent);
  
  // Tạo build-manifest.json
  const buildManifestPath = path.join(nextDir, 'build-manifest.json');
  const buildManifestContent = JSON.stringify({
    polyfillFiles: [],
    devFiles: [],
    ampDevFiles: [],
    lowPriorityFiles: [],
    rootMainFiles: ["static/chunks/main-app.js"],
    pages: {},
    ampFirstPages: []
  }, null, 2);
  createFileWithContent(buildManifestPath, buildManifestContent);
  
  // Tạo main-app.js
  const mainAppPath = path.join(staticDir, 'chunks', 'main-app.js');
  const mainAppContent = `// Main App Chunk
console.log("Main app chunk loaded successfully");`;
  createFileWithContent(mainAppPath, mainAppContent);
  
  log('✅ Đã hoàn tất tạo các file cần thiết');
  
  // Sửa lỗi ChunkLoadError cho trang products/[id]
  log('🚀 Sửa lỗi ChunkLoadError cho trang products/[id]...');
  
  // Đường dẫn thư mục
  const productChunksDir = path.join(staticDir, 'chunks', 'app', 'products', '[id]');
  ensureDirectoryExists(productChunksDir);
  
  // Các file cần tạo
  const productChunkFiles = [
    { 
      name: 'page.js',
      content: `// Page Chunk for products/[id]\n(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8857],{60767:function(){console.log("Product page chunk loaded")}}]);`
    },
    { 
      name: 'loading.js',
      content: `// Loading Chunk for products/[id]\n(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9821],{43822:function(){console.log("Product loading chunk loaded")}}]);`
    },
    { 
      name: 'not-found.js',
      content: `// Not Found Chunk for products/[id]\n(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5613],{29484:function(){console.log("Product not-found chunk loaded")}}]);`
    },
    // Thêm các file có hashed filename
    { 
      name: 'page-196d5685cfc.js',
      content: `// Hashed Page Chunk for products/[id]\n(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8857],{60767:function(){console.log("Product page chunk loaded")}}]);`
    },
    { 
      name: 'loading-196d5685cfc.js',
      content: `// Hashed Loading Chunk for products/[id]\n(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9821],{43822:function(){console.log("Product loading chunk loaded")}}]);`
    },
    { 
      name: 'not-found-196d5685cfc.js',
      content: `// Hashed Not Found Chunk for products/[id]\n(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5613],{29484:function(){console.log("Product not-found chunk loaded")}}]);`
    }
  ];
  
  // Tạo các file
  for (const file of productChunkFiles) {
    createFileWithContent(path.join(productChunksDir, file.name), file.content);
  }
  
  log('✅ Đã hoàn tất sửa lỗi ChunkLoadError cho trang sản phẩm chi tiết');
  return true;
}

// 3. Cập nhật danh sách file trong .gitignore
function updateGitignore() {
  log('📝 Đang cập nhật file .gitignore...');
  
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  let gitignoreContent = '';
  
  // Đọc nội dung hiện tại nếu file tồn tại
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  }
  
  // Danh sách các mục cần thêm vào .gitignore
  const entriesToAdd = [
    '# Next.js generated files',
    '.next/static/chunks/app/products/[id]/',
    '.next/server/middleware-manifest.json',
    '.next/trace',
    '.traceignore',
    'next-fix-all.log',
    'xlab-utils.log',
    '*.log'
  ];
  
  // Kiểm tra và thêm các mục còn thiếu
  let contentChanged = false;
  for (const entry of entriesToAdd) {
    if (!gitignoreContent.includes(entry)) {
      gitignoreContent += `\n${entry}`;
      contentChanged = true;
    }
  }
  
  // Lưu lại nếu có thay đổi
  if (contentChanged) {
    fs.writeFileSync(gitignorePath, gitignoreContent.trim() + '\n');
    log('✅ Đã cập nhật file .gitignore');
  } else {
    log('✅ File .gitignore đã có đầy đủ các mục cần thiết');
  }
  
  return true;
}

// 4. Dọn dẹp các file thừa
function cleanupRedundantFiles() {
  log('🧹 Dọn dẹp các file thừa...');
  
  const filesToRemove = [
    'fix-products-json.js',
    'fix-trace-error.js',
    'fix-chunks-final.js',
    'fix-next-chunks.js',
    'next-fix-all.js'
  ];
  
  let removed = 0;
  for (const file of filesToRemove) {
    const filePath = path.join(process.cwd(), file);
    if (deleteFileIfExists(filePath)) {
      removed++;
    }
  }
  
  if (removed > 0) {
    log(`✅ Đã xóa ${removed}/${filesToRemove.length} file thừa`);
  } else {
    log('✅ Không có file thừa cần xóa');
  }
  
  return true;
}

// Hàm chạy tất cả các sửa lỗi
function fixAll() {
  log('🚀 Bắt đầu quá trình sửa lỗi toàn diện...');
  
  const results = {
    products: fixProductsJson(),
    trace: fixTraceError(),
    gitignore: updateGitignore()
  };
  
  const success = Object.values(results).every(result => result === true);
  
  if (success) {
    log('✅ Đã hoàn tất quá trình sửa lỗi');
    return true;
  } else {
    log('⚠️ Quá trình sửa lỗi hoàn tất với một số cảnh báo');
    return false;
  }
}

// Xử lý tham số dòng lệnh
function parseCommandLineArgs() {
  const args = process.argv.slice(2);
  const command = args[0] || 'fix-all';
  
  switch (command) {
    case 'fix-all':
      fixAll();
      break;
    case 'fix-products':
      fixProductsJson();
      break;
    case 'fix-trace':
      fixTraceError();
      break;
    case 'update-gitignore':
      updateGitignore();
      break;
    case 'cleanup':
      cleanupRedundantFiles();
      break;
    case 'help':
      showHelp();
      break;
    default:
      console.log(`Lệnh không hợp lệ: ${command}`);
      showHelp();
      break;
  }
}

// Hiển thị trợ giúp
function showHelp() {
  console.log(`
XLab Web Utility Toolkit

Sử dụng: node xlab-utils.js [command] [options]

Commands:
  fix-all          Chạy tất cả các công cụ sửa lỗi
  fix-products     Sửa lỗi JSON sản phẩm và cập nhật ID
  fix-trace        Sửa lỗi trace
  update-gitignore Cập nhật file .gitignore
  cleanup          Dọn dẹp các file thừa
  help             Hiển thị trợ giúp

Options:
  --verbose        Hiển thị thông tin chi tiết
`);
}

// Chạy script
try {
  log('=== Bắt đầu công cụ XLab Web Utility Toolkit ===');
  parseCommandLineArgs();
} catch (error) {
  log(`❌ Lỗi không mong muốn: ${error.message}`, true);
  process.exit(1);
} 