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