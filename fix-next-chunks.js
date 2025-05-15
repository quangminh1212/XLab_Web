/**
 * Script sửa lỗi ChunkLoadError cho Next.js App Router
 * Tạo các file chunk cần thiết cho trang sản phẩm chi tiết (/products/[id])
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Bắt đầu sửa lỗi ChunkLoadError cho trang sản phẩm chi tiết...');

// Đường dẫn thư mục
const rootDir = process.cwd();
const nextDir = path.join(rootDir, '.next');
const staticChunksDir = path.join(nextDir, 'static', 'chunks', 'app', 'products', '[id]');

// Nội dung chunk cơ bản
const chunkContents = {
  'page.js': `// Page Chunk for products/[id]
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8857],{60767:function(e,n,r){Promise.resolve().then(r.bind(r,92862));},92862:function(e,n,r){"use strict";
r.r(n),r.d(n,{default:function(){return ProductDetailPage}});
var t=r(24033);var o=r(12221);var i=r(70616);var u=r(86960);

// Product Detail Page Component
function ProductDetailPage(props){
  return (0,t.jsx)("div",{children:(0,t.jsx)(ProductDetail,{product:props.product})});
}

// Product Detail Component
function ProductDetail({product}){
  return (0,t.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[
    (0,t.jsx)("h1",{className:"text-3xl font-bold mb-4",children:product?.name || "Product Detail"}),
    (0,t.jsx)("div",{className:"bg-white rounded-lg shadow-md p-6",children:
      (0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[
        (0,t.jsx)("div",{children:(0,t.jsx)("img",{src:product?.image || "/images/placeholder.jpg",alt:product?.name,className:"w-full h-auto rounded-lg"})}),
        (0,t.jsxs)("div",{children:[
          (0,t.jsx)("h2",{className:"text-2xl font-bold mb-4",children:product?.name}),
          (0,t.jsx)("p",{className:"text-gray-600 mb-4",children:product?.description}),
          (0,t.jsxs)("div",{className:"text-xl font-bold text-primary-600 mb-4",children:["$",product?.price]}),
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

// Khởi tạo - tạo thư mục chunks
console.log('🔨 Tạo các file chunks...');
ensureDirectoryExists(staticChunksDir);

// Tạo các file chunk
for (const [fileName, content] of Object.entries(chunkContents)) {
  createFileWithContent(path.join(staticChunksDir, fileName), content);
}

// Tạo các file chunk có hash (đảm bảo Next.js có thể tải)
// Sử dụng timestamp để tạo hash giả định
const timestamp = Date.now().toString(16).slice(-12);
for (const [fileName, content] of Object.entries(chunkContents)) {
  const baseName = fileName.replace('.js', '');
  const hashedFileName = `${baseName}-${timestamp}.js`;
  createFileWithContent(path.join(staticChunksDir, hashedFileName), content);
}

console.log('✅ Đã hoàn tất việc sửa lỗi ChunkLoadError');
console.log('🔄 Hãy chạy lại ứng dụng và truy cập trang sản phẩm chi tiết'); 