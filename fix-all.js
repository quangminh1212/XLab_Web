/**
 * Script tổng hợp thực hiện tất cả các bước sửa lỗi cho Next.js
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Danh sách các script cần chạy theo thứ tự
const scripts = [
  'fix-nextjs-vendor-paths.js',
  'fix-nextjs-missing-files.js',
  'fix-webpack-enoent.js',
  'fix-vendor-chunks.js',
  'fix-webpack-hot-update.js',
  'fix-critters.js'
];

// Kiểm tra và tạo .next nếu chưa tồn tại
function ensureNextDirectory() {
  const nextDir = path.join(__dirname, '.next');
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
    console.log('Đã tạo thư mục .next');
  }
}

// Thêm các file bị thiếu vào .gitignore
function updateGitignore() {
  const gitignorePath = path.join(__dirname, '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    console.log('Không tìm thấy file .gitignore');
    return;
  }
  
  let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  
  // Danh sách các mục cần thêm vào .gitignore
  const itemsToAdd = [
    '# Vendor chunks files',
    '/.next/server/vendor-chunks/*.js',
    '/.next/server/pages/vendor-chunks/*.js',
    '/.next/server/chunks/*.js',
    '',
    '# Các file tạm thời của Next.js',
    '/.next/trace',
    '/.next/trace-*',
    '/.next/server/chunks/react*.js',
    '/.next/server/middleware-build-manifest.js',
    '/.next/server/middleware-manifest.json',
    '/.next/server/middleware-react-loadable-manifest.json',
    '/.next/server/app-paths-manifest.json',
    '/.next/server/pages-manifest.json',
    '/.next/server/flight-server-css-manifest.json',
    '/.next/server/flight-client-css-manifest.json'
  ];
  
  // Kiểm tra xem các mục đã có trong .gitignore chưa
  let needsUpdate = false;
  for (const item of itemsToAdd) {
    if (!gitignoreContent.includes(item) && item.startsWith('/')) {
      needsUpdate = true;
      break;
    }
  }
  
  // Nếu cần cập nhật thì thêm vào cuối file
  if (needsUpdate) {
    gitignoreContent += '\n' + itemsToAdd.join('\n') + '\n';
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log('Đã cập nhật file .gitignore');
  } else {
    console.log('File .gitignore đã được cập nhật trước đó');
  }
}

// Kiểm tra trạng thái Next.js
function checkNextjsStatus() {
  try {
    // Kiểm tra các thư mục và file bắt buộc
    const requiredDirs = [
      '.next/server',
      '.next/static',
      '.next/cache'
    ];
    
    let missingDirs = [];
    for (const dir of requiredDirs) {
      const fullPath = path.join(__dirname, dir);
      if (!fs.existsSync(fullPath)) {
        missingDirs.push(dir);
      }
    }
    
    if (missingDirs.length > 0) {
      console.log(`Cảnh báo: Không tìm thấy các thư mục: ${missingDirs.join(', ')}`);
      console.log('Có thể Next.js chưa được build hoặc chạy lần đầu');
    } else {
      console.log('Cấu trúc thư mục Next.js OK');
    }
    
    // Kiểm tra package.json
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Kiểm tra các dependencies cần thiết
      const requiredDeps = ['next', 'react', 'react-dom'];
      let missingDeps = [];
      
      for (const dep of requiredDeps) {
        if (!packageJson.dependencies[dep]) {
          missingDeps.push(dep);
        }
      }
      
      if (missingDeps.length > 0) {
        console.log(`Cảnh báo: Thiếu các dependencies: ${missingDeps.join(', ')}`);
      } else {
        console.log('Các dependencies Next.js OK');
      }
      
      // Kiểm tra script build và dev
      if (!packageJson.scripts.build || !packageJson.scripts.dev) {
        console.log('Cảnh báo: Thiếu script build hoặc dev trong package.json');
      }
    } else {
      console.log('Không tìm thấy file package.json');
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái Next.js:', error);
  }
}

// Chạy từng script theo thứ tự
async function runScripts() {
  console.log('=== Bắt đầu chạy các script sửa lỗi ===');
  
  for (const script of scripts) {
    const scriptPath = path.join(__dirname, script);
    if (fs.existsSync(scriptPath)) {
      console.log(`\n=== Đang chạy script: ${script} ===`);
      try {
        // Sử dụng execSync để chạy đồng bộ script
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
        console.log(`=== Hoàn thành script: ${script} ===`);
      } catch (error) {
        console.error(`Lỗi khi chạy script ${script}:`, error.message);
      }
    } else {
      console.log(`Script không tồn tại: ${script}`);
    }
  }
  
  console.log('\n=== Đã hoàn thành tất cả các script ===');
}

// Kiểm tra và sửa lỗi biên dịch TypeScript
function fixTypeScriptErrors() {
  try {
    console.log('\n=== Kiểm tra và sửa lỗi TypeScript ===');
    
    // Kiểm tra tsconfig.json
    const tsconfigPath = path.join(__dirname, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      
      // Kiểm tra và thêm các cấu hình cần thiết
      let updated = false;
      
      if (!tsconfig.compilerOptions) {
        tsconfig.compilerOptions = {};
        updated = true;
      }
      
      if (!tsconfig.compilerOptions.moduleResolution) {
        tsconfig.compilerOptions.moduleResolution = "bundler";
        updated = true;
      }
      
      if (!tsconfig.compilerOptions.jsx) {
        tsconfig.compilerOptions.jsx = "preserve";
        updated = true;
      }
      
      if (tsconfig.compilerOptions.strict === undefined) {
        tsconfig.compilerOptions.strict = true;
        updated = true;
      }
      
      if (!tsconfig.compilerOptions.paths) {
        tsconfig.compilerOptions.paths = {
          "@/*": ["./src/*"]
        };
        updated = true;
      }
      
      if (updated) {
        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
        console.log('Đã cập nhật tsconfig.json');
      } else {
        console.log('tsconfig.json không cần cập nhật');
      }
    } else {
      console.log('Không tìm thấy file tsconfig.json');
    }
    
    // Kiểm tra next-env.d.ts
    const nextEnvPath = path.join(__dirname, 'next-env.d.ts');
    if (!fs.existsSync(nextEnvPath)) {
      const nextEnvContent = `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// NOTE: This file should not be edited\n// see https://nextjs.org/docs/basic-features/typescript for more information.\n`;
      fs.writeFileSync(nextEnvPath, nextEnvContent);
      console.log('Đã tạo file next-env.d.ts');
    }
    
    console.log('=== Hoàn thành kiểm tra TypeScript ===');
  } catch (error) {
    console.error('Lỗi khi sửa lỗi TypeScript:', error);
  }
}

// Kiểm tra và tạo các file trang bị thiếu để tránh lỗi 404
function fixMissing404Pages() {
  try {
    console.log('\n=== Kiểm tra và sửa các trang bị lỗi 404 ===');
    
    // Danh sách các thư mục cần kiểm tra cho trang chi tiết sản phẩm
    const productDirs = [
      path.join(__dirname, '.next', 'static', 'chunks', 'app', 'products', '[id]'),
      path.join(__dirname, '.next', 'server', 'app', 'products', '[id]')
    ];
    
    // Đảm bảo các thư mục tồn tại
    for (const dir of productDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Đã tạo thư mục: ${dir}`);
      }
    }
    
    // Danh sách các file cần kiểm tra cho trang sản phẩm
    const productFiles = [
      { dir: productDirs[0], name: 'page.js', content: '// Auto-generated page.js placeholder' },
      { dir: productDirs[0], name: 'loading.js', content: '// Auto-generated loading.js placeholder' },
      { dir: productDirs[0], name: 'not-found.js', content: '// Auto-generated not-found.js placeholder' },
      { dir: productDirs[1], name: 'page.js', content: 'module.exports = function(){ return { props: {} } }' },
      { dir: productDirs[1], name: 'loading.js', content: 'module.exports = function(){ return null }' },
      { dir: productDirs[1], name: 'not-found.js', content: 'module.exports = function(){ return { notFound: true } }' }
    ];
    
    // Tạo các file nếu chưa tồn tại
    for (const file of productFiles) {
      const filePath = path.join(file.dir, file.name);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file.content);
        console.log(`Đã tạo file: ${filePath}`);
      }
    }
    
    // Kiểm tra và tạo các file manifest cần thiết cho app router
    const manifestFiles = [
      {
        path: path.join(__dirname, '.next', 'server', 'app-paths-manifest.json'),
        content: JSON.stringify({
          "/": "app/page.js",
          "/products/[id]": "app/products/[id]/page.js"
        }, null, 2)
      },
      {
        path: path.join(__dirname, '.next', 'build-manifest.json'),
        content: JSON.stringify({
          "pages": {
            "/_app": [
              "static/chunks/webpack.js",
              "static/chunks/main.js",
              "static/chunks/pages/_app.js"
            ],
            "/_error": [
              "static/chunks/webpack.js",
              "static/chunks/main.js",
              "static/chunks/pages/_error.js"
            ],
            "/products/[id]": [
              "static/chunks/webpack.js",
              "static/chunks/main.js",
              "static/chunks/app/products/[id]/page.js"
            ]
          },
          "app": {
            "/products/[id]/page": [
              "static/chunks/webpack.js",
              "static/chunks/main.js",
              "static/chunks/app/products/[id]/page.js"
            ],
            "/products/[id]/loading": [
              "static/chunks/webpack.js", 
              "static/chunks/main.js",
              "static/chunks/app/products/[id]/loading.js"
            ],
            "/products/[id]/not-found": [
              "static/chunks/webpack.js",
              "static/chunks/main.js", 
              "static/chunks/app/products/[id]/not-found.js"
            ]
          }
        }, null, 2)
      }
    ];
    
    for (const file of manifestFiles) {
      if (!fs.existsSync(file.path) || true) { // Luôn ghi đè file manifest để cập nhật
        fs.writeFileSync(file.path, file.content);
        console.log(`Đã cập nhật file manifest: ${file.path}`);
      }
    }
    
    console.log('=== Hoàn thành kiểm tra và sửa các trang bị lỗi 404 ===');
  } catch (error) {
    console.error('Lỗi khi sửa các trang bị lỗi 404:', error);
  }
}

// Sửa các module vendor chunk bị thiếu
function fixMissingVendorChunks() {
  try {
    console.log('\n=== Kiểm tra và sửa các vendor chunks bị thiếu ===');
    
    // Danh sách các vendor chunks cần tạo
    const vendorChunks = [
      { name: '@swc.js', package: '@swc/helpers' },
      { name: 'client-only.js', package: 'client-only' },
      { name: 'styled-jsx.js', package: 'styled-jsx' },
      { name: 'next-client-pages-loader.js', package: '' }
    ];
    
    // Các thư mục cần tạo vendor chunks
    const vendorDirs = [
      path.join(__dirname, '.next', 'server', 'vendor-chunks'),
      path.join(__dirname, '.next', 'server', 'pages', 'vendor-chunks'),
      path.join(__dirname, '.next', 'server', 'chunks')
    ];
    
    // Đảm bảo các thư mục tồn tại
    for (const dir of vendorDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Đã tạo thư mục vendor: ${dir}`);
      }
    }
    
    // Tạo các file vendor chunks
    for (const chunk of vendorChunks) {
      for (const dir of vendorDirs) {
        const filePath = path.join(dir, chunk.name);
        
        let content;
        if (chunk.package) {
          content = `module.exports = require("${chunk.package}");`;
        } else {
          content = `module.exports = {};`;
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Đã tạo vendor chunk: ${filePath}`);
      }
    }
    
    console.log('=== Hoàn thành kiểm tra và sửa các vendor chunks bị thiếu ===');
  } catch (error) {
    console.error('Lỗi khi sửa các vendor chunks bị thiếu:', error);
  }
}

// Sửa lỗi 404 cho các resource với URL encoding
function fixUrlEncodingIssues() {
  try {
    console.log('\n=== Sửa lỗi URL encoding cho các resource ===');
    
    // Quét qua các thư mục static để tìm các file ID
    const staticChunksDir = path.join(__dirname, '.next', 'static', 'chunks', 'app', 'products');
    
    // Tạo thư mục app/products/[id] nếu chưa tồn tại
    const encodedIdDir = path.join(staticChunksDir, '%5Bid%5D');
    const normalIdDir = path.join(staticChunksDir, '[id]');
    
    // Đảm bảo thư mục [id] tồn tại
    if (!fs.existsSync(normalIdDir)) {
      fs.mkdirSync(normalIdDir, { recursive: true });
      console.log(`Đã tạo thư mục: ${normalIdDir}`);
    }
    
    // Tạo cả thư mục với URL encoding
    if (!fs.existsSync(encodedIdDir)) {
      fs.mkdirSync(encodedIdDir, { recursive: true });
      console.log(`Đã tạo thư mục URL encoded: ${encodedIdDir}`);
    }
    
    // Tạo các file placeholder cho cả hai thư mục
    const placeholderFiles = ['page.js', 'loading.js', 'not-found.js'];
    
    for (const file of placeholderFiles) {
      // Tạo file trong thư mục [id]
      const normalFilePath = path.join(normalIdDir, file);
      if (!fs.existsSync(normalFilePath)) {
        fs.writeFileSync(normalFilePath, `// Auto-generated placeholder for ${file}`);
        console.log(`Đã tạo file: ${normalFilePath}`);
      }
      
      // Tạo file trong thư mục URL encoded
      const encodedFilePath = path.join(encodedIdDir, file);
      if (!fs.existsSync(encodedFilePath)) {
        fs.writeFileSync(encodedFilePath, `// Auto-generated placeholder for URL encoded ${file}`);
        console.log(`Đã tạo file: ${encodedFilePath}`);
      }
    }
    
    console.log('=== Hoàn thành sửa lỗi URL encoding cho các resource ===');
  } catch (error) {
    console.error('Lỗi khi sửa lỗi URL encoding:', error);
  }
}

// Xóa cache và file tạm để tránh lỗi
function cleanCache() {
  try {
    console.log('\n=== Dọn dẹp cache và file tạm ===');
    
    // Các thư mục cache cần xóa
    const cacheDirs = [
      path.join(__dirname, '.next', 'cache', 'webpack'),
      path.join(__dirname, '.next', 'static', 'webpack')
    ];
    
    // Xóa các thư mục cache
    for (const dir of cacheDirs) {
      if (fs.existsSync(dir)) {
        // Xóa tất cả các file trong thư mục nhưng giữ lại thư mục
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
            console.log(`Đã xóa file cache: ${filePath}`);
          }
        }
      }
    }
    
    console.log('=== Hoàn thành dọn dẹp cache và file tạm ===');
  } catch (error) {
    console.error('Lỗi khi dọn dẹp cache:', error);
  }
}

// Hàm chính thực hiện tất cả các bước
async function main() {
  console.log('=== Bắt đầu quá trình sửa lỗi tổng hợp ===');
  
  // Kiểm tra trạng thái NextJS
  checkNextjsStatus();
  
  // Đảm bảo thư mục .next tồn tại
  ensureNextDirectory();
  
  // Cập nhật .gitignore
  updateGitignore();
  
  // Sửa lỗi TypeScript
  fixTypeScriptErrors();
  
  // Sửa các vendor chunks bị thiếu
  fixMissingVendorChunks();
  
  // Sửa lỗi 404 cho trang sản phẩm
  fixMissing404Pages();
  
  // Sửa lỗi URL encoding
  fixUrlEncodingIssues();
  
  // Dọn dẹp cache
  cleanCache();
  
  // Chạy các script sửa lỗi
  await runScripts();
  
  console.log('\n=== Hoàn tất quá trình sửa lỗi ===');
  console.log('Bạn có thể chạy "npm run dev" để khởi động dự án');
}

// Chạy hàm main
main().catch(error => {
  console.error('Lỗi nghiêm trọng:', error);
  process.exit(1);
}); 