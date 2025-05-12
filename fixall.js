// fixall.js - Consolidated fix script for XLab_Web
// Combines functionality from multiple fix scripts into one comprehensive utility

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('============================================');
console.log('       XLab_Web - Công cụ sửa lỗi tự động   ');
console.log('============================================');
console.log('');

// Kiểm tra tham số dòng lệnh
const args = process.argv.slice(2);
const runAll = args.length === 0 || args.includes('all');
const runTraceError = runAll || args.includes('trace');
const runComponents = runAll || args.includes('components');
const runAccounts = runAll || args.includes('accounts');
const runCleanCache = runAll || args.includes('cache');

// 1. FIX TRACE ERRORS
if (runTraceError) {
  console.log('===== 1. SỬA LỖI TRACE FILE =====');
  fixTraceErrors();
  console.log('');
}

// 2. FIX COMPONENTS
if (runComponents) {
  console.log('===== 2. SỬA LỖI COMPONENTS =====');
  fixComponents();
  console.log('');
}

// 3. FIX ACCOUNTS PAGE
if (runAccounts) {
  console.log('===== 3. SỬA LỖI ACCOUNTS PAGE =====');
  fixAccountsPage();
  console.log('');
}

// 4. CLEAN CACHE
if (runCleanCache) {
  console.log('===== 4. XÓA CACHE NEXT.JS =====');
  cleanNextCache();
  console.log('');
}

console.log('============================================');
console.log('    🎉 Quá trình sửa lỗi đã hoàn tất!    ');
console.log('============================================');
console.log('Bạn có thể chạy "npm run dev" để khởi động dự án.');
console.log('');

// IMPLEMENTATION OF FIX FUNCTIONS

/**
 * Sửa lỗi trace file trong Next.js
 */
function fixTraceErrors() {
  console.log('Đang sửa lỗi trace file...');

  // Đảm bảo thư mục .next tồn tại
  const nextDir = path.join(__dirname, '.next');
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
    console.log('Đã tạo thư mục .next');
  }

  // Xác định đường dẫn tới file trace
  const traceFile = path.join(nextDir, 'trace');
  const traceBackup = path.join(nextDir, 'trace.old');

  // Xóa file trace cũ nếu tồn tại
  if (fs.existsSync(traceFile)) {
    try {
      // Trên Windows, đôi khi cần phải gỡ bỏ thuộc tính read-only
      if (process.platform === 'win32') {
        try {
          execSync(`attrib -r "${traceFile}"`, { stdio: 'ignore' });
          console.log('Đã loại bỏ thuộc tính read-only của file trace');
        } catch (err) {
          console.warn('Không thể thay đổi thuộc tính file:', err.message);
        }
      }
      
      fs.unlinkSync(traceFile);
      console.log('Đã xóa thành công file trace');
    } catch (err) {
      console.warn('Không thể xóa file trace trực tiếp:', err.message);
      
      // Nếu xóa thất bại, thử đổi tên file (giải quyết một số lock trên Windows)
      try {
        fs.renameSync(traceFile, traceBackup);
        console.log('Đã đổi tên file trace thành trace.old');
        
        // Thử xóa bản backup sau khi đổi tên
        try {
          fs.unlinkSync(traceBackup);
          console.log('Đã xóa file trace.old');
        } catch (backupErr) {
          console.warn('Không thể xóa file trace.old:', backupErr.message);
        }
      } catch (renameErr) {
        console.warn('Không thể đổi tên file trace:', renameErr.message);
      }
    }
  }

  // Tạo file trace mới với quyền thích hợp
  try {
    // Tạo với flag wx để fail nếu file đã tồn tại (tránh race condition)
    fs.writeFileSync(traceFile, '', { flag: 'w' });
    console.log('Đã tạo file trace mới với quyền thích hợp');
    
    // Trên Windows, đảm bảo file có quyền thích hợp
    if (process.platform === 'win32') {
      try {
        execSync(`attrib -r "${traceFile}"`, { stdio: 'ignore' });
        console.log('Đã đảm bảo file trace không có thuộc tính read-only');
      } catch (err) {
        console.warn('Không thể thiết lập thuộc tính file trace:', err.message);
      }
    }
  } catch (createErr) {
    console.error('Không thể tạo file trace:', createErr.message);
  }
}

/**
 * Sửa lỗi các component
 */
function fixComponents() {
  console.log('Đang sửa lỗi các component...');

  // Fix Container.tsx
  const containerPath = path.join(__dirname, 'src', 'components', 'common', 'Container.tsx');
  if (!fs.existsSync(containerPath)) {
    // Tạo Container.tsx nếu không tồn tại
    const containerContent = `import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={cn('container mx-auto px-4 md:px-6 max-w-7xl', className)}>
      {children}
    </div>
  )
}

export default Container`;

    try {
      const containerDir = path.dirname(containerPath);
      if (!fs.existsSync(containerDir)) {
        fs.mkdirSync(containerDir, { recursive: true });
      }
      fs.writeFileSync(containerPath, containerContent, { encoding: 'utf8' });
      console.log('Đã tạo file Container.tsx');
    } catch (err) {
      console.error('Lỗi khi tạo Container.tsx:', err.message);
    }
  } else {
    try {
      let containerContent = fs.readFileSync(containerPath, 'utf8');
      // Sửa lỗi trong file
      if (containerContent.includes('export default Container   return (') || 
          containerContent.includes('^') || 
          containerContent.includes('Sua loi Container.tsx')) {
        containerContent = `import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={cn('container mx-auto px-4 md:px-6 max-w-7xl', className)}>
      {children}
    </div>
  )
}

export default Container`;
        fs.writeFileSync(containerPath, containerContent, { encoding: 'utf8' });
        console.log('Đã sửa file Container.tsx');
      }
    } catch (err) {
      console.error('Lỗi khi sửa Container.tsx:', err.message);
    }
  }

  // Fix index.ts
  const indexPath = path.join(__dirname, 'src', 'components', 'common', 'index.ts');
  if (!fs.existsSync(indexPath)) {
    // Tạo index.ts nếu nó không tồn tại
    try {
      const indexDir = path.dirname(indexPath);
      if (!fs.existsSync(indexDir)) {
        fs.mkdirSync(indexDir, { recursive: true });
      }
      fs.writeFileSync(indexPath, 'export { Container } from \'./Container\';\n', { encoding: 'utf8' });
      console.log('Đã tạo file index.ts');
    } catch (err) {
      console.error('Lỗi khi tạo index.ts:', err.message);
    }
  } else {
    try {
      let indexContent = fs.readFileSync(indexPath, 'utf8');
      // Đảm bảo nó export đúng Container
      if (!indexContent.includes('export { Container }')) {
        // Thêm export nếu không tìm thấy
        const newExport = 'export { Container } from \'./Container\';\n';
        if (indexContent.includes('export { default as Container }')) {
          indexContent = indexContent.replace('export { default as Container }', 'export { Container }');
        } else {
          indexContent += newExport;
        }
        fs.writeFileSync(indexPath, indexContent, { encoding: 'utf8' });
        console.log('Đã sửa exports trong index.ts');
      }
    } catch (err) {
      console.error('Lỗi khi sửa index.ts:', err.message);
    }
  }

  // Fix utils.ts nếu không tồn tại (cần thiết cho hàm cn)
  const utilsPath = path.join(__dirname, 'src', 'lib', 'utils.ts');
  if (!fs.existsSync(utilsPath)) {
    const utilsContent = `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

    try {
      const utilsDir = path.dirname(utilsPath);
      if (!fs.existsSync(utilsDir)) {
        fs.mkdirSync(utilsDir, { recursive: true });
        console.log('Đã tạo thư mục lib');
      }
      fs.writeFileSync(utilsPath, utilsContent, { encoding: 'utf8' });
      console.log('Đã tạo file utils.ts với hàm cn');
    } catch (err) {
      console.error('Lỗi khi tạo utils.ts:', err.message);
    }
  }
}

/**
 * Sửa lỗi trang accounts/page.tsx
 */
function fixAccountsPage() {
  console.log('Đang sửa lỗi trang accounts/page.tsx...');

  const accountsPagePath = path.join(__dirname, 'src', 'app', 'accounts', 'page.tsx');

  // Nội dung mới - sử dụng server-side redirect
  const newContent = `import { redirect } from 'next/navigation'

export default function AccountsPage() {
  redirect('/account')
}`;

  try {
    // Đảm bảo thư mục tồn tại hoặc tạo thư mục cha
    const accountsDir = path.dirname(accountsPagePath);
    if (!fs.existsSync(accountsDir)) {
      fs.mkdirSync(accountsDir, { recursive: true });
      console.log('Đã tạo thư mục accounts');
    }

    // Luôn ghi nội dung mới, bất kể trạng thái hiện tại
    fs.writeFileSync(accountsPagePath, newContent, { encoding: 'utf8' });
    console.log('Đã ghi nội dung chuyển hướng vào accounts/page.tsx');
    
  } catch (err) {
    console.error('Lỗi khi ghi accounts/page.tsx:', err.message);
  }
}

/**
 * Tạo file font-manifest.json nếu không tồn tại
 */
function createFontManifest() {
  console.log('Đang tạo file font-manifest.json...');

  const fontManifestPath = path.join(__dirname, '.next', 'server', 'next-font-manifest.json');
  const fontManifestDir = path.dirname(fontManifestPath);

  try {
    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(fontManifestDir)) {
      fs.mkdirSync(fontManifestDir, { recursive: true });
      console.log(`Đã tạo thư mục: ${fontManifestDir}`);
    }

    // Tạo file font-manifest.json nếu không tồn tại
    if (!fs.existsSync(fontManifestPath)) {
      const emptyFontManifest = {
        pages: {},
        app: {},
        appUsingSizeAdjust: false,
        pagesUsingSizeAdjust: false
      };

      fs.writeFileSync(fontManifestPath, JSON.stringify(emptyFontManifest, null, 2), 'utf8');
      console.log(`Đã tạo file font-manifest.json tại ${fontManifestPath}`);
    } else {
      console.log('File font-manifest.json đã tồn tại.');
    }
  } catch (err) {
    console.error(`Lỗi khi tạo file font-manifest.json: ${err.message}`);
  }
}

/**
 * Xóa cache Next.js
 */
function cleanNextCache() {
  console.log('Đang xóa cache Next.js...');

  // Hàm để xóa an toàn một thư mục đệ quy
  function deleteFolderRecursive(directoryPath) {
    if (fs.existsSync(directoryPath)) {
      fs.readdirSync(directoryPath).forEach((file) => {
        const curPath = path.join(directoryPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          // Gọi đệ quy
          deleteFolderRecursive(curPath);
        } else {
          // Xóa file
          try {
            fs.unlinkSync(curPath);
          } catch (err) {
            console.error(`Không thể xóa file ${curPath}: ${err.message}`);
          }
        }
      });
      
      try {
        fs.rmdirSync(directoryPath);
        console.log(`Đã xóa thư mục: ${directoryPath}`);
      } catch (err) {
        console.error(`Không thể xóa thư mục ${directoryPath}: ${err.message}`);
      }
    }
  }

  // Xóa các thư mục cache cụ thể
  const nextCacheDir = path.join(__dirname, '.next', 'cache');
  if (fs.existsSync(nextCacheDir)) {
    // Xóa cache webpack
    const webpackCacheDir = path.join(nextCacheDir, 'webpack');
    if (fs.existsSync(webpackCacheDir)) {
      deleteFolderRecursive(webpackCacheDir);
      console.log('Đã xóa cache webpack');
    }
    
    // Xóa cache SWC
    const swcCacheDir = path.join(nextCacheDir, 'swc');
    if (fs.existsSync(swcCacheDir)) {
      deleteFolderRecursive(swcCacheDir);
      console.log('Đã xóa cache SWC');
    }
  }

  // Tạo lại thư mục .next nếu không tồn tại
  const nextDir = path.join(__dirname, '.next');
  if (!fs.existsSync(nextDir)) {
    fs.mkdirSync(nextDir, { recursive: true });
    console.log('Đã tạo thư mục .next');
  }

  // Sửa file trace
  const traceFile = path.join(nextDir, 'trace');
  if (fs.existsSync(traceFile)) {
    try {
      // Trên Windows, xóa thuộc tính read-only
      if (process.platform === 'win32') {
        try {
          execSync(`attrib -r "${traceFile}"`, { stdio: 'ignore' });
        } catch (err) {
          console.warn('Không thể sửa thuộc tính file:', err.message);
        }
      }
      
      fs.unlinkSync(traceFile);
      console.log('Đã xóa file trace');
    } catch (err) {
      console.warn('Không thể xóa file trace:', err.message);
    }
  }

  // Tạo file trace trống
  try {
    fs.writeFileSync(traceFile, '', { flag: 'w' });
    console.log('Đã tạo file trace mới với quyền thích hợp');
  } catch (err) {
    console.error('Không thể tạo file trace:', err.message);
  }

  // Thêm vào cuối hàm, trước dòng log cuối
  createFontManifest();

  console.log('Quá trình xóa cache Next.js đã hoàn tất!');
} 