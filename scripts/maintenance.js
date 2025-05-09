/**
 * XLab_Web Maintenance Script
 * - Dọn dẹp và sửa lỗi tự động
 * - Tạo cấu trúc file tối thiểu cho .next
 * - Quản lý các thành phần xác thực
 * - Cập nhật .gitignore
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cấu hình
const rootDir = process.cwd();
const nextDir = path.join(rootDir, '.next');

// Các thư mục cần thiết trong .next
const requiredDirs = [
  path.join(nextDir, 'cache'),
  path.join(nextDir, 'server'),
  path.join(nextDir, 'static'),
  path.join(nextDir, 'static', 'chunks'),
  path.join(nextDir, 'static', 'css'),
  path.join(nextDir, 'static', 'webpack'),
  path.join(nextDir, 'server', 'chunks'),
  path.join(nextDir, 'server', 'pages'),
  path.join(nextDir, 'server', 'vendor-chunks'),
  path.join(nextDir, 'server', 'app')
];

// Các mẫu cần có trong .gitignore
const gitignorePatterns = [
  '.next/',
  'node_modules/',
  '.DS_Store',
  '*.log',
  'dist/',
  'out/',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',
];

// Tạo thư mục nếu chưa tồn tại
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Đã tạo thư mục: ${dirPath}`);
    return true;
  }
  return false;
}

// Tạo file với nội dung
function createFileWithContent(filePath, content) {
  const dirPath = path.dirname(filePath);
  ensureDirectoryExists(dirPath);
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Đã tạo file: ${filePath}`);
}

// Xử lý file trace
function fixTraceFile() {
  console.log('🔍 Kiểm tra file trace...');
  
  const tracePath = path.join(nextDir, 'trace');
  if (fs.existsSync(tracePath)) {
    try {
      // Đặt lại quyền truy cập
      try {
        fs.chmodSync(tracePath, 0o666);
        console.log('✅ Đã đặt lại quyền truy cập của file trace');
      } catch (chmodErr) {
        console.log('❌ Không thể đặt lại quyền truy cập:', chmodErr.message);
      }

      // Xóa file trace
      try {
        fs.unlinkSync(tracePath);
        console.log('✅ Đã xóa file trace thành công');
      } catch (unlinkErr) {
        console.log('❌ Không thể xóa file trace:', unlinkErr.message);
        
        // Thử phương pháp khác trên Windows
        try {
          execSync('attrib -r -s -h .next\\trace');
          execSync('del /f /q .next\\trace');
          if (!fs.existsSync(tracePath)) {
            console.log('✅ Đã xóa file trace thành công bằng CMD');
          }
        } catch (cmdErr) {
          console.log('❌ Vẫn không thể xóa file trace:', cmdErr.message);
        }
      }
    } catch (error) {
      console.log('❌ Lỗi khi xử lý file trace:', error.message);
    }
  } else {
    console.log('✅ Không tìm thấy file trace, không cần xử lý');
  }
}

// Sửa lỗi Next.js config
function fixNextConfig() {
  console.log('🔧 Kiểm tra và sửa cấu hình Next.js...');
  
  const configPath = path.join(rootDir, 'next.config.js');
  if (!fs.existsSync(configPath)) {
    console.log('❌ Không tìm thấy file next.config.js');
    return;
  }
  
  // Đọc nội dung file
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Kiểm tra xem outputFileTracingExcludes có trong experimental không
  const hasExperimentalTracing = configContent.includes('experimental') && 
    configContent.includes('outputFileTracingExcludes') && 
    /experimental\s*:\s*{[^}]*outputFileTracingExcludes/.test(configContent);
  
  if (hasExperimentalTracing) {
    console.log('🔄 Đang sửa cấu hình next.config.js...');
    
    // Tạo bản sao lưu nếu chưa có
    if (!fs.existsSync(`${configPath}.bak`)) {
      try {
        fs.copyFileSync(configPath, `${configPath}.bak`);
        console.log('✅ Đã tạo bản sao lưu next.config.js.bak');
      } catch (err) {
        console.log('❌ Lỗi khi tạo bản sao lưu:', err.message);
      }
    }
    
    try {
      // Trích xuất nội dung của outputFileTracingExcludes
      const tracingMatch = /outputFileTracingExcludes\s*:\s*({[^}]*})/.exec(configContent);
      if (tracingMatch && tracingMatch[1]) {
        const tracingContent = tracingMatch[1];
        
        // Xóa nó khỏi experimental
        let newConfig = configContent.replace(/(\s*outputFileTracingExcludes\s*:\s*{[^}]*}),?/g, '');
        
        // Thêm nó như một tùy chọn cấp cao nhất
        newConfig = newConfig.replace(/(experimental\s*:\s*{[^}]*}\s*),?/g, '$1,\n  outputFileTracingExcludes: ' + tracingContent + ',\n  ');
        
        fs.writeFileSync(configPath, newConfig);
        console.log('✅ Đã sửa cấu hình next.config.js thành công');
      } else {
        console.log('⚠️ Không thể tìm thấy nội dung outputFileTracingExcludes');
      }
    } catch (err) {
      console.log('❌ Lỗi khi sửa cấu hình:', err.message);
    }
  } else {
    console.log('✅ Cấu hình next.config.js đã hợp lệ');
  }
}

// Tạo cấu trúc thư mục tối thiểu cho .next
function createMinimalNextStructure() {
  console.log('📁 Tạo cấu trúc thư mục tối thiểu cho Next.js...');
  
  // Đảm bảo thư mục .next tồn tại
  ensureDirectoryExists(nextDir);
  
  // Tạo các thư mục cần thiết
  let createdAny = false;
  for (const dir of requiredDirs) {
    if (ensureDirectoryExists(dir)) {
      createdAny = true;
      
      // Tạo file .gitkeep trong mỗi thư mục
      const gitkeepPath = path.join(dir, '.gitkeep');
      if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '');
      }
    }
  }
  
  // Tạo file manifest cơ bản
  const manifestPath = path.join(nextDir, 'server', 'middleware-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    createFileWithContent(
      manifestPath,
      JSON.stringify({ middleware: {}, functions: {}, version: 2 }, null, 2)
    );
    createdAny = true;
  }
  
  if (createdAny) {
    console.log('✅ Đã tạo xong cấu trúc thư mục tối thiểu');
  } else {
    console.log('ℹ️ Cấu trúc thư mục đã đầy đủ');
  }
}

// Xóa cache và file tạm thời
function cleanupProject() {
  console.log('🧹 Dọn dẹp dự án...');
  
  // Xóa cache
  const cacheDir = path.join(nextDir, 'cache');
  if (fs.existsSync(cacheDir)) {
    try {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('✅ Đã xóa cache:', cacheDir);
      
      // Tạo lại thư mục cache
      ensureDirectoryExists(cacheDir);
      ensureDirectoryExists(path.join(cacheDir, 'webpack'));
    } catch (error) {
      console.log('❌ Lỗi khi xóa cache:', error.message);
    }
  }
  
  // Xóa webpack cache
  const webpackCacheDir = path.join(nextDir, 'static', 'webpack');
  if (fs.existsSync(webpackCacheDir)) {
    try {
      fs.rmSync(webpackCacheDir, { recursive: true, force: true });
      console.log('✅ Đã xóa cache:', webpackCacheDir);
      
      // Tạo lại thư mục webpack
      ensureDirectoryExists(webpackCacheDir);
    } catch (error) {
      console.log('❌ Lỗi khi xóa webpack cache:', error.message);
    }
  }
  
  console.log('✅ Đã hoàn tất dọn dẹp dự án');
}

// Đảm bảo component withAdminAuth tồn tại
function ensureAuthComponents() {
  console.log('🔐 Kiểm tra các thành phần xác thực...');
  
  // Đường dẫn đến component withAdminAuth
  const withAdminAuthPath = path.join(rootDir, 'src', 'components', 'auth', 'withAdminAuth.tsx');
  const authDir = path.join(rootDir, 'src', 'components', 'auth');
  
  // Kiểm tra xem component đã tồn tại chưa
  if (!fs.existsSync(withAdminAuthPath)) {
    // Tạo thư mục nếu chưa tồn tại
    ensureDirectoryExists(authDir);
    
    // Nội dung của component
    const componentContent = `'use client';

import { useEffect, ComponentType } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// Higher Order Component để bảo vệ các trang admin
function withAdminAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAdminAuth(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    useEffect(() => {
      // Kiểm tra nếu người dùng đang tải
      if (status === 'loading') return;
      
      // Kiểm tra nếu không có session thì chuyển hướng về trang đăng nhập
      if (!session) {
        signIn();
        return;
      }
      
      // Kiểm tra nếu người dùng không phải admin thì chuyển hướng về trang chủ
      // Giả sử vai trò admin được lưu trong session.user.role
      if (session.user && (session.user as any).role !== 'admin') {
        router.push('/');
        return;
      }
    }, [session, status, router]);
    
    // Hiển thị màn hình loading trong khi kiểm tra xác thực
    if (status === 'loading' || !session) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    
    // Kiểm tra nếu không phải admin thì hiển thị thông báo
    if (session.user && (session.user as any).role !== 'admin') {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Truy cập bị từ chối</h1>
          <p className="text-gray-600 mb-4">Bạn không có quyền truy cập vào trang này.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Quay về trang chủ
          </button>
        </div>
      );
    }
    
    // Nếu người dùng là admin, hiển thị component
    return <Component {...props} />;
  };
}

export default withAdminAuth;`;

    // Ghi nội dung vào file
    createFileWithContent(withAdminAuthPath, componentContent);
    console.log('✅ Đã tạo component withAdminAuth');
  } else {
    console.log('ℹ️ Component withAdminAuth đã tồn tại');
  }
}

// Cập nhật file .gitignore
function updateGitignore() {
  console.log('📝 Kiểm tra .gitignore...');
  
  const gitignorePath = path.join(rootDir, '.gitignore');
  
  // Nếu không có file .gitignore, tạo mới
  if (!fs.existsSync(gitignorePath)) {
    createFileWithContent(gitignorePath, gitignorePatterns.join('\n'));
    console.log('✅ Đã tạo file .gitignore mới');
    return;
  }
  
  // Đọc nội dung file .gitignore hiện tại
  const content = fs.readFileSync(gitignorePath, 'utf8');
  const lines = content.split('\n').map(line => line.trim());
  
  // Kiểm tra và thêm các mẫu còn thiếu
  let updated = false;
  const missingPatterns = gitignorePatterns.filter(pattern => !lines.includes(pattern));
  
  if (missingPatterns.length > 0) {
    // Thêm các mẫu còn thiếu vào cuối file
    const newContent = content + '\n' + missingPatterns.join('\n') + '\n';
    fs.writeFileSync(gitignorePath, newContent);
    console.log('✅ Đã cập nhật .gitignore với các mẫu còn thiếu');
    updated = true;
  }
  
  if (!updated) {
    console.log('✅ .gitignore đã chứa tất cả các mẫu cần thiết');
  }
}

// Tạo các file .pack giả để tránh lỗi ENOENT
function createEmptyPackFiles() {
  console.log('📦 Tạo các file .pack giả để tránh lỗi...');
  
  const webpackDirs = [
    path.join(nextDir, 'cache', 'webpack', 'client-development'),
    path.join(nextDir, 'cache', 'webpack', 'server-development'),
    path.join(nextDir, 'cache', 'webpack', 'edge-server-development')
  ];
  
  webpackDirs.forEach(dir => {
    if (ensureDirectoryExists(dir)) {
      for (let i = 0; i <= 5; i++) {
        const packFile = path.join(dir, `${i}.pack`);
        const packGzFile = path.join(dir, `${i}.pack.gz`);
        
        if (!fs.existsSync(packFile)) {
          fs.writeFileSync(packFile, '');
          console.log(`✅ Đã tạo file trống: ${packFile}`);
        }
        
        if (!fs.existsSync(packGzFile)) {
          fs.writeFileSync(packGzFile, '');
          console.log(`✅ Đã tạo file trống: ${packGzFile}`);
        }
      }
    }
  });
}

// Tạo file CSS giả và file route giả cho NextAuth
function createPlaceholderFiles() {
  console.log('🎭 Tạo các file giả để tránh lỗi 404...');
  
  // CSS file
  const cssDir = path.join(nextDir, 'static', 'css');
  ensureDirectoryExists(cssDir);
  
  const cssFile = path.join(cssDir, 'app-layout.css');
  if (!fs.existsSync(cssFile)) {
    fs.writeFileSync(cssFile, '/* Placeholder CSS */');
    console.log(`✅ Đã tạo file CSS giả: ${cssFile}`);
  }
  
  // NextAuth route
  const nextAuthDir = path.join(nextDir, 'server', 'app', 'api', 'auth', '[...nextauth]');
  ensureDirectoryExists(nextAuthDir);
  
  const routeFile = path.join(nextAuthDir, 'route.js');
  if (!fs.existsSync(routeFile)) {
    fs.writeFileSync(routeFile, '// Placeholder NextAuth route file');
    console.log(`✅ Đã tạo file route giả cho NextAuth: ${routeFile}`);
  }
}

// Kiểm tra file .env và .env.local
function checkEnvFiles() {
  console.log('🔐 Kiểm tra file môi trường...');
  
  const envPath = path.join(rootDir, '.env');
  const envLocalPath = path.join(rootDir, '.env.local');
  
  if (!fs.existsSync(envPath)) {
    createFileWithContent(envPath, 'NODE_ENV=development\nNEXTAUTH_URL=http://localhost:3000\n');
    console.log('✅ Đã tạo file .env');
  }
  
  if (!fs.existsSync(envLocalPath)) {
    createFileWithContent(envLocalPath, 'NEXTAUTH_URL=http://localhost:3000\nNEXTAUTH_SECRET=voZ7iiSzvDrGjrG0m0qkkw60XkANsAg9xf/rGiA4bfA=\n');
    console.log('✅ Đã tạo file .env.local');
  }
}

// Chức năng chính
async function main() {
  console.log('=== Bảo trì dự án Next.js ===');
  console.log('🚀 Bắt đầu quá trình bảo trì và tối ưu hóa...');
  
  // Xử lý file trace
  fixTraceFile();
  
  // Tạo cấu trúc thư mục tối thiểu
  createMinimalNextStructure();
  
  // Kiểm tra và sửa cấu hình Next.js
  fixNextConfig();
  
  // Tạo file giả và .pack
  createEmptyPackFiles();
  createPlaceholderFiles();
  
  // Kiểm tra file môi trường
  checkEnvFiles();
  
  // Dọn dẹp dự án
  cleanupProject();
  
  // Đảm bảo các thành phần xác thực
  ensureAuthComponents();
  
  // Cập nhật .gitignore
  updateGitignore();
  
  console.log('✅ Đã hoàn tất quá trình bảo trì!');
  console.log('📝 Bạn có thể khởi động dự án bây giờ');
}

// Chạy chương trình
main().catch(error => {
  console.error('❌ Lỗi:', error);
  process.exit(1);
}); 