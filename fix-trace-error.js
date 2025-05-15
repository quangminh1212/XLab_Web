/**
 * NEXT.JS TRACE ERROR FIXER
 * Script sửa lỗi file trace và chuẩn bị môi trường chạy Next.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Bắt đầu sửa lỗi trace và chuẩn bị môi trường Next.js...');

// Đường dẫn các thư mục quan trọng
const rootDir = process.cwd();
const nextDir = path.join(rootDir, '.next');
const serverDir = path.join(nextDir, 'server');
const staticDir = path.join(nextDir, 'static');
const cacheDir = path.join(nextDir, 'cache');

// Hàm tạo thư mục nếu chưa tồn tại
function ensureDirectoryExists(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Đã tạo thư mục: ${dirPath}`);
    }
  } catch (error) {
    console.error(`❌ Lỗi khi tạo thư mục ${dirPath}: ${error.message}`);
  }
}

// Hàm tạo file với nội dung
function createFileWithContent(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Đã tạo file: ${filePath}`);
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
      console.log(`✅ Đã xóa file: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Lỗi khi xóa file ${filePath}: ${error.message}`);
  }
  return false;
}

// 1. Xử lý file trace
function fixTraceFile() {
  console.log('🔍 Xử lý file trace...');
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
  console.log('✅ Đã hoàn tất xử lý file trace');
}

// 2. Tạo middleware-manifest.json
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
  
  // Xóa file cũ nếu tồn tại
  deleteFileIfExists(manifestPath);
  
  // Tạo file mới
  createFileWithContent(manifestPath, manifestContent);
  console.log('✅ Đã hoàn tất tạo middleware-manifest.json');
}

// 3. Tạo các thư mục cần thiết
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
  ensureDirectoryExists(path.join(staticDir, 'chunks', 'app', 'products', '[id]'));
  ensureDirectoryExists(path.join(staticDir, 'css'));
  ensureDirectoryExists(path.join(staticDir, 'webpack'));
  
  // Thư mục cache
  ensureDirectoryExists(path.join(cacheDir, 'webpack'));
  
  console.log('✅ Đã hoàn tất tạo các thư mục cần thiết');
}

// 4. Tạo các file cần thiết
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
  
  console.log('✅ Đã hoàn tất tạo các file cần thiết');
}

// 5. Gọi các hàm để sửa lỗi
fixTraceFile();
createMiddlewareManifest();
createRequiredDirectories();
createRequiredFiles();

// 6. Sửa lỗi ChunkLoadError cho trang products/[id]
console.log('🚀 Sửa lỗi ChunkLoadError cho trang products/[id]...');

// Đường dẫn thư mục
const productChunksDir = path.join(staticDir, 'chunks', 'app', 'products', '[id]');

// Nội dung chunk cơ bản
const productChunkContents = {
  'page.js': `// Page Chunk for products/[id]
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8857],{60767:function(e,n,r){Promise.resolve().then(r.bind(r,92862));},92862:function(e,n,r){"use strict";
r.r(n),r.d(n,{default:function(){return ProductDetailPage}});
var t=r(24033);var o=r(12221);var i=r(70616);var u=r(86960);

// Product Detail Page Component
function ProductDetailPage(props){
  return (0,t.jsx)("div",{className:"container mx-auto",children:(0,t.jsx)(ProductDetail,{product:props.product})});
}

// Product Detail Component
function ProductDetail({product}){
  if(!product) return (0,t.jsx)("div",{className:"text-center py-8",children:"Loading..."});
  return (0,t.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[
    (0,t.jsx)("h1",{className:"text-3xl font-bold mb-4",children:product.name || "Product Detail"}),
    (0,t.jsx)("div",{className:"bg-white rounded-lg shadow-md p-6",children:
      (0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[
        (0,t.jsx)("div",{children:(0,t.jsx)("img",{src:product.image || "/images/placeholder.jpg",alt:product.name,className:"w-full h-auto rounded-lg"})}),
        (0,t.jsxs)("div",{children:[
          (0,t.jsx)("h2",{className:"text-2xl font-bold mb-4",children:product.name}),
          (0,t.jsx)("p",{className:"text-gray-600 mb-4",children:product.description}),
          (0,t.jsxs)("div",{className:"text-xl font-bold text-primary-600 mb-4",children:["$",product.price]}),
          (0,t.jsx)("button",{className:"bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors",children:"Add to Cart"})
        ]})
      ]})
    })
  ]});
}

}});`,

  'loading.js': `// Loading Chunk for products/[id]
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8862],{60795:function(n,e,r){"use strict";
r.r(e),r.d(e,{default:function(){return Loading}});
var t=r(24033);

// Loading Component
function Loading(){
  return (0,t.jsxs)("div",{className:"container mx-auto px-4 py-8 animate-pulse",children:[
    (0,t.jsx)("div",{className:"h-8 bg-gray-200 rounded w-1/3 mb-4"}),
    (0,t.jsx)("div",{className:"bg-white rounded-lg shadow-md p-6",children:
      (0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[
        (0,t.jsx)("div",{children:(0,t.jsx)("div",{className:"bg-gray-200 w-full h-96 rounded-lg"})}),
        (0,t.jsxs)("div",{children:[
          (0,t.jsx)("div",{className:"h-8 bg-gray-200 rounded w-3/4 mb-4"}),
          (0,t.jsx)("div",{className:"h-24 bg-gray-200 rounded w-full mb-4"}),
          (0,t.jsx)("div",{className:"h-6 bg-gray-200 rounded w-1/4 mb-4"}),
          (0,t.jsx)("div",{className:"h-10 bg-gray-200 rounded w-1/3"})
        ]})
      ]})
    })
  ]});
}
}});`,

  'not-found.js': `// Not Found Chunk for products/[id]
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8861],{60799:function(n,t,e){"use strict";
e.r(t),e.d(t,{default:function(){return NotFound}});
var r=e(24033);

// Not Found Component
function NotFound(){
  return (0,r.jsxs)("div",{className:"container mx-auto px-4 py-16 text-center",children:[
    (0,r.jsx)("h1",{className:"text-4xl font-bold mb-4",children:"Product Not Found"}),
    (0,r.jsx)("p",{className:"text-lg text-gray-600 mb-8",children:"The product you're looking for doesn't exist or has been removed."}),
    (0,r.jsx)("a",{href:"/products",className:"inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors",children:"Browse Products"})
  ]});
}
}});`
};

// Tạo các file chunk
for (const [fileName, content] of Object.entries(productChunkContents)) {
  createFileWithContent(path.join(productChunksDir, fileName), content);
}

// Tạo các file chunk có hash
const timestamp = Date.now().toString(16).slice(-12);
for (const [fileName, content] of Object.entries(productChunkContents)) {
  const baseName = fileName.replace('.js', '');
  const hashedFileName = `${baseName}-${timestamp}.js`;
  createFileWithContent(path.join(productChunksDir, hashedFileName), content);
}

console.log('✅ Đã hoàn tất sửa lỗi ChunkLoadError cho trang sản phẩm chi tiết');
console.log('✨ Đã hoàn tất việc sửa lỗi và chuẩn bị môi trường Next.js');
console.log('🚀 Bạn có thể chạy "npm run dev" để khởi động ứng dụng'); 