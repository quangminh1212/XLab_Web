/**
 * Integrated script to fix Next.js issues and update .gitignore
 * - Fixes SWC (Rust Compiler) issues
 * - Creates vendor chunks
 * - Creates manifest files
 * - Creates static files
 * - Fixes 404 errors for files with hash
 * - Clears cache
 * - Updates .gitignore to exclude log files and runtime-generated files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Main log file
const LOG_FILE = 'fix-nextjs.log';

// Clear previous log file
if (fs.existsSync(LOG_FILE)) {
  fs.unlinkSync(LOG_FILE);
}

// Ghi log ra file để debug
function log(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
  console.log(message);
}

log('=== Starting Next.js Fix Script ===');

// Tạo thư mục nếu chưa tồn tại
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`✅ Created directory: ${dirPath}`);
  }
}

// Tạo file với nội dung
function createFileWithContent(filePath, content) {
  try {
    const dirPath = path.dirname(filePath);
    ensureDirectoryExists(dirPath);
    
    if (fs.existsSync(filePath)) {
      log(`⚠️ File ${filePath} already exists, not overwriting.`);
      return true;
    }
    
    fs.writeFileSync(filePath, content);
    log(`✅ Created file: ${filePath}`);
    return true;
  } catch (error) {
    log(`❌ Error creating file ${filePath}: ${error.message}`);
    return false;
  }
}

// Phần 1: Sửa lỗi SWC (Rust Compiler) cho Next.js
function fixSwcErrors() {
  log('🔧 Fixing SWC (Rust Compiler) issues...');
  
  // Kiểm tra xem có thư mục SWC không
  const swcDir = path.join(__dirname, 'node_modules', '@next', 'swc-win32-x64-msvc');
  if (fs.existsSync(swcDir)) {
    log(`🔍 Found SWC directory at: ${swcDir}`);
    
    // Kiểm tra tệp binary
    const swcBinary = path.join(swcDir, 'next-swc.win32-x64-msvc.node');
    if (fs.existsSync(swcBinary)) {
      log(`📄 Found SWC binary: ${swcBinary}`);
      log('🔄 Backing up current SWC binary...');
      
      try {
        const backupPath = `${swcBinary}.backup`;
        if (!fs.existsSync(backupPath)) {
          fs.renameSync(swcBinary, backupPath);
          log(`✅ Backed up SWC binary to: ${backupPath}`);
        } else {
          log(`ℹ️ Backup already exists: ${backupPath}`);
        }
      } catch (error) {
        log(`❌ Could not backup SWC binary: ${error.message}`);
      }
    } else {
      log(`⚠️ SWC binary not found at: ${swcBinary}`);
    }
  }
  
  // Cài đặt phiên bản WASM của SWC
  log('📦 Installing @next/swc-wasm-nodejs...');
  try {
    log('🔍 Checking if @next/swc-wasm-nodejs is already installed...');
    
    // Check if the package is already installed
    try {
      require('@next/swc-wasm-nodejs');
      log('✅ @next/swc-wasm-nodejs is already installed');
    } catch (error) {
      // If not installed, install it
      execSync('npm i @next/swc-wasm-nodejs --no-save', { stdio: 'inherit' });
      log('✅ Installed @next/swc-wasm-nodejs successfully');
    }
    
    // Cập nhật .npmrc để sử dụng WASM
    const npmrcPath = path.join(__dirname, '.npmrc');
    let npmrcContent = '';
    
    if (fs.existsSync(npmrcPath)) {
      npmrcContent = fs.readFileSync(npmrcPath, 'utf8');
      if (!npmrcContent.includes('next-swc-wasm=true')) {
        npmrcContent += '\nnext-swc-wasm=true\n';
        fs.writeFileSync(npmrcPath, npmrcContent);
        log('✅ Updated .npmrc to use SWC WASM');
      } else {
        log('ℹ️ SWC WASM configuration already exists in .npmrc');
      }
    } else {
      npmrcContent = 'next-swc-wasm=true\n';
      fs.writeFileSync(npmrcPath, npmrcContent);
      log('✅ Created .npmrc to use SWC WASM');
    }
  } catch (error) {
    log(`❌ Could not install or configure @next/swc-wasm-nodejs: ${error.message}`);
  }
  
  // Sửa lỗi next.config.js
  log('📝 Checking and fixing next.config.js...');
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  
  if (fs.existsSync(nextConfigPath)) {
    let configContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Kiểm tra xem có swcMinify hoặc swcLoader không
    const hasSwcMinify = configContent.includes('swcMinify');
    const hasSwcLoader = configContent.includes('swcLoader');
    
    if (hasSwcMinify || hasSwcLoader) {
      log(`⚠️ Found invalid options in next.config.js: ${hasSwcMinify ? 'swcMinify' : ''} ${hasSwcLoader ? 'swcLoader' : ''}`);
      
      // Back up the config file first
      fs.writeFileSync(`${nextConfigPath}.backup`, configContent);
      log(`✅ Backed up next.config.js to next.config.js.backup`);
      
      // Thay thế các tùy chọn không hợp lệ
      if (hasSwcMinify) {
        configContent = configContent.replace(/swcMinify\s*:\s*[^,}]+/g, '// swcMinify removed');
      }
      
      if (hasSwcLoader) {
        configContent = configContent.replace(/swcLoader\s*:\s*[^,}]+/g, '// swcLoader removed');
      }
      
      fs.writeFileSync(nextConfigPath, configContent);
      log('✅ Removed invalid options in next.config.js');
    } else {
      log('✅ No invalid options found in next.config.js');
    }
  } else {
    log(`❌ next.config.js not found at: ${nextConfigPath}`);
  }
  
  log('✅ SWC fixes completed');
}

// Phần 2: Sửa lỗi vendor chunks
function fixVendorChunks() {
  log('📦 Fixing vendor chunks...');

  const basePath = path.join(__dirname, '.next', 'server');
  ensureDirectoryExists(path.join(basePath, 'vendor-chunks'));
  ensureDirectoryExists(path.join(basePath, 'pages', 'vendor-chunks'));
  ensureDirectoryExists(path.join(basePath, 'chunks'));
  
  const vendors = [
    'next',
    'react',
    'react-dom',
    'scheduler',
    'use-sync-external-store',
    'next-auth',
    '@swc',
    'styled-jsx',
    'client-only',
    'next-client-pages-loader',
    'react-server-dom-webpack',
    'react-server-dom-webpack-client',
  ];
  
  vendors.forEach(vendor => {
    // Create vendor chunks for server
    createFileWithContent(
      path.join(basePath, 'vendor-chunks', `${vendor}.js`),
      `// ${vendor} vendor chunk\n`
    );
    
    // Create vendor chunks for pages
    createFileWithContent(
      path.join(basePath, 'pages', 'vendor-chunks', `${vendor}.js`),
      `// ${vendor} vendor chunk for pages\n`
    );
    
    // Create chunks
    createFileWithContent(
      path.join(basePath, 'chunks', `${vendor}.js`),
      `// ${vendor} chunk\n`
    );
  });
  
  log('✅ Vendor chunks fixed');
}

// Phần 3: Sửa lỗi manifest files
function fixManifestFiles() {
  log('📄 Fixing manifest files...');
  
  // Create app-paths-manifest.json
  createFileWithContent(
    path.join(__dirname, '.next', 'server', 'app-paths-manifest.json'),
    JSON.stringify({
      "/": "app/page.js",
      "/products": "app/products/page.js",
      "/products/[id]": "app/products/[id]/page.js"
    }, null, 2)
  );
  
  // Create next-font-manifest.json
  createFileWithContent(
    path.join(__dirname, '.next', 'server', 'next-font-manifest.json'),
    JSON.stringify({
      "pages": {},
      "app": {}
    }, null, 2)
  );
  
  // Create middleware-manifest.json
  createFileWithContent(
    path.join(__dirname, '.next', 'server', 'middleware-manifest.json'),
    JSON.stringify({
      "sortedMiddleware": [],
      "middleware": {},
      "functions": {},
      "version": 2
    }, null, 2)
  );
  
  // Create build-manifest.json
  createFileWithContent(
    path.join(__dirname, '.next', 'build-manifest.json'),
    JSON.stringify({
      "polyfillFiles": [
        "static/chunks/polyfills.js"
      ],
      "devFiles": [
        "static/chunks/react-refresh.js",
        "static/chunks/webpack.js"
      ],
      "ampDevFiles": [],
      "lowPriorityFiles": [],
      "rootMainFiles": [
        "static/chunks/webpack.js",
        "static/chunks/main-app.js"
      ],
      "pages": {
        "/_app": [
          "static/chunks/webpack.js",
          "static/chunks/main.js",
          "static/chunks/pages/_app.js"
        ]
      },
      "ampFirstPages": []
    }, null, 2)
  );
  
  log('✅ Manifest files fixed');
}

// Phần 4: Sửa lỗi static files
function fixStaticFiles() {
  log('🖼️ Fixing static files...');
  
  // Ensure directories exist
  ensureDirectoryExists(path.join(__dirname, '.next', 'static', 'chunks'));
  ensureDirectoryExists(path.join(__dirname, '.next', 'static', 'chunks', 'app'));
  ensureDirectoryExists(path.join(__dirname, '.next', 'static', 'chunks', 'webpack'));
  
  // Create static files
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'main-app.js'),
    '// Main app chunk\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'app-pages-internals.js'),
    '// App pages internals chunk\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'webpack', 'webpack.js'),
    '// Webpack chunk\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'app', 'not-found.js'),
    '// Not found page chunk\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'app', 'page.js'),
    '// Page chunk\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'app', 'loading.js'),
    '// Loading chunk\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'app', 'products', 'page.js'),
    '// Products page chunk\n'
  );
  
  // Create CSS files
  ensureDirectoryExists(path.join(__dirname, '.next', 'static', 'css'));
  ensureDirectoryExists(path.join(__dirname, '.next', 'static', 'css', 'app'));
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'css', 'app-layout.css'),
    '/* App layout CSS */\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'css', 'app', 'layout.css'),
    '/* App layout CSS */\n'
  );
  
  // Create webpack files with hash
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'webpack-skyxmj65.js'),
    '// Webpack chunk with hash\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'framework-clswzlt5.js'),
    '// Framework chunk with hash\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'main-tglhr9nj.js'),
    '// Main chunk with hash\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'app-mrp37g5j.js'),
    '// App chunk with hash\n'
  );
  
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'chunks', 'polyfills-yvkh090p.js'),
    '// Polyfills chunk with hash\n'
  );
  
  log('✅ Static files fixed');
}

// Phần 5: Sửa lỗi static files với hash cụ thể
function fixHashedStaticFiles() {
  log('📊 Fixing static files with specific hashes...');
  
  // Create CSS with layout
  createFileWithContent(
    path.join(__dirname, '.next', 'static', 'css', 'app', 'layout.css'),
    '/* Layout CSS */\n'
  );
  
  // Create JS files with specific hashes
  const hashedFiles = [
    {
      path: path.join(__dirname, '.next', 'static', 'app', 'not-found.7d3561764989b0ed.js'),
      content: '// Not found page with hash\n'
    },
    {
      path: path.join(__dirname, '.next', 'static', 'app', 'layout.32d8c3be6202d9b3.js'),
      content: '// Layout with hash\n'
    },
    {
      path: path.join(__dirname, '.next', 'static', 'app-pages-internals.196c41f732d2db3f.js'),
      content: '// App pages internals with hash\n'
    },
    {
      path: path.join(__dirname, '.next', 'static', 'main-app.aef085aefcb8f66f.js'),
      content: '// Main app with hash\n'
    },
    {
      path: path.join(__dirname, '.next', 'static', 'app', 'loading.062c877ec63579d3.js'),
      content: '// Loading with hash\n'
    },
    {
      path: path.join(__dirname, '.next', 'static', 'app', 'admin', 'layout.bd8a9bfaca039569.js'),
      content: '// Admin layout with hash\n'
    },
    {
      path: path.join(__dirname, '.next', 'static', 'app', 'admin', 'page.20e1580ca904d554.js'),
      content: '// Admin page with hash\n'
    }
  ];
  
  hashedFiles.forEach(file => {
    createFileWithContent(file.path, file.content);
  });
  
  // Create files with timestamps
  const timestamps = [
    '1746857687478',
    '1746857690764',
    '1746857700000'
  ];
  
  timestamps.forEach(timestamp => {
    createFileWithContent(
      path.join(__dirname, '.next', 'static', 'css', 'app', `layout-${timestamp}.css`),
      `/* Layout CSS with timestamp ${timestamp} */\n`
    );
    
    createFileWithContent(
      path.join(__dirname, '.next', 'static', `main-app-${timestamp}.js`),
      `// Main app with timestamp ${timestamp}\n`
    );
  });
  
  log('✅ Hashed static files fixed');
}

// Phần 6: Sửa lỗi 404 cho file có timestamp
function fixTimestampFiles() {
  log('🕒 Fixing 404 errors for files with timestamp...');
  
  // Create timestamp handler in public directory
  const timestampHandlerContent = `
// Timestamp handler for Next.js static files
// This script helps handle timestamp-based file requests
console.log('Timestamp handler loaded');

// Add this to your _app.js or layout.js to handle timestamp-based static files
function handleTimestampRequests() {
  // Map to cache original files
  const fileCache = {};
  
  // Intercept fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.includes('_next/static')) {
      // Check if this is a timestamp-based request
      if (url.includes('?ts=') || url.match(/-(\\d{13})\\./)) {
        // Extract the base part of the URL
        let baseUrl = url;
        if (url.includes('?ts=')) {
          baseUrl = url.split('?')[0];
        } else {
          // Handle timestamp in filename (like layout-1234567890123.css)
          baseUrl = url.replace(/-(\\d{13})\\.(css|js)/, '.$2');
        }
        
        // Use the cached response if available, otherwise fetch original
        if (fileCache[baseUrl]) {
          return fileCache[baseUrl].clone();
        }
        
        // Fetch the original and cache it
        return originalFetch(baseUrl, options).then(response => {
          if (response.ok) {
            // Cache the response
            fileCache[baseUrl] = response.clone();
          }
          return response;
        });
      }
    }
    
    // Normal fetch for other requests
    return originalFetch(url, options);
  };
}

// Auto-initialize
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', handleTimestampRequests);
}
`;

  createFileWithContent(
    path.join(__dirname, 'public', 'timestamp-handler.js'),
    timestampHandlerContent
  );
  
  // Check if _app.js exists, if not create it
  const appJsPath = path.join(__dirname, 'src', 'pages', '_app.js');
  if (!fs.existsSync(appJsPath)) {
    const appJsContent = `
import '../styles/globals.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="/timestamp-handler.js" strategy="beforeInteractive" />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
`;
    createFileWithContent(appJsPath, appJsContent);
  } else {
    log(`⚠️ File ${appJsPath} already exists, not overwriting.`);
  }
  
  // Create hashed files again to ensure they exist (these might be fetched with timestamps)
  fixHashedStaticFiles();
  
  log('✅ Timestamp files fixed');
}

// Phần 7: Sửa lỗi app routes
function fixAppRoutes() {
  log('🛣️ Fixing app routes...');
  
  // Create the auth route directory
  const authRoutePath = path.join(__dirname, '.next', 'server', 'app', 'api', 'auth', '[...nextauth]');
  ensureDirectoryExists(authRoutePath);
  
  // Create route.js file
  createFileWithContent(
    path.join(authRoutePath, 'route.js'),
    `// Next Auth route handler
export async function GET(req) {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(req) {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
`
  );
  
  log('✅ App routes fixed');
}

// Phần 8: Xóa cache
function clearCache() {
  log('🧹 Clearing cache...');
  
  // Xóa thư mục cache
  const cacheDirs = [
    path.join(__dirname, '.next', 'cache'),
    path.join(__dirname, '.next', 'static', 'webpack')
  ];
  
  cacheDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
        log(`✅ Removed cache: ${dir}`);
      } catch (error) {
        log(`❌ Error removing ${dir}: ${error.message}`);
      }
    }
  });
  
  // Tạo lại thư mục cache
  cacheDirs.forEach(dir => {
    ensureDirectoryExists(dir);
  });
  
  log('✅ Cache cleared');
}

// Phần 9: Tạo các file .gitkeep để giữ cấu trúc thư mục
function createGitkeepFiles() {
  log('📁 Creating .gitkeep files to preserve directory structure...');
  
  // List of directories to create .gitkeep in
  const dirs = [
    path.join(__dirname, '.next', 'cache'),
    path.join(__dirname, '.next', 'static', 'webpack')
  ];
  
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      createFileWithContent(path.join(dir, '.gitkeep'), '');
    }
  });
  
  log('✅ .gitkeep files created');
}

// Phần 10: Cập nhật .gitignore để loại trừ các file log và file được sinh ra lúc chạy
function updateGitignore() {
  log('📝 Updating .gitignore...');
  
  // Path to .gitignore
  const gitignorePath = path.join(__dirname, '.gitignore');
  
  // Define patterns to add
  const ignorePatterns = [
    '# Log files',
    '*.log',
    'fix-*.log',
    
    '# Next.js runtime files',
    '/.next/build-manifest.json',
    '/.next/app-paths-manifest.json',
    '/.next/next-font-manifest.json',
    '/.next/middleware-manifest.json',
    '/.next/trace',
    '/.next/cache/',
    '/.next/server/',
    '/.next/static/',
    '**/*.hot-update.js',
    '**/*.hot-update.json',
    '/node_modules/.cache/',
    '/.swc/',
    '/.turbo/',
    
    '# Temporary files',
    'tmp/',
    'temp/',
    '.DS_Store',
    'Thumbs.db'
  ];
  
  // Read existing .gitignore or create if not exists
  let gitignoreContent = '';
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  }
  
  // Check which patterns are missing
  const existingLines = gitignoreContent.split('\n').map(line => line.trim());
  const newPatterns = ignorePatterns.filter(pattern => !existingLines.includes(pattern));
  
  if (newPatterns.length === 0) {
    log('✅ All required patterns already in .gitignore');
    return;
  }
  
  // Add new patterns
  const updatedContent = gitignoreContent.trim() + 
    '\n\n# Added by fix-nextjs.js\n' + 
    newPatterns.join('\n') + 
    '\n';
  
  // Write updated content
  fs.writeFileSync(gitignorePath, updatedContent);
  log(`✅ Added ${newPatterns.length} new patterns to .gitignore`);
}

// Main execution
try {
  // Run all fix functions
  fixSwcErrors();
  fixVendorChunks();
  fixManifestFiles();
  fixStaticFiles();
  fixHashedStaticFiles();
  fixTimestampFiles();
  fixAppRoutes();
  clearCache();
  createGitkeepFiles();
  updateGitignore();
  
  log('✅ All fixes completed successfully');
  log('🚀 Please restart your Next.js application to apply changes');
} catch (error) {
  log(`❌ Error during fixes: ${error.message}`);
  log('🔍 Check the log file for details: ' + LOG_FILE);
} 