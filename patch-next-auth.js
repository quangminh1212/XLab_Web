// Patch cho next-auth để tương thích với Next.js 13
const fs = require('fs');
const path = require('path');

// Log function để giúp debug
function log(message, data = null, isError = false) {
  const logPath = path.resolve('./logs');
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
  }
  
  const logFile = path.resolve(logPath, 'patch.log');
  const timestamp = new Date().toISOString();
  const logData = `[${timestamp}] ${message}\n${data ? JSON.stringify(data, null, 2) : ''}\n\n`;
  
  fs.appendFileSync(logFile, logData);
  
  if (isError) {
    console.error(`[Patch] ${message}`);
  } else {
    console.log(`[Patch] ${message}`);
  }
}

log('Patching next-auth để tương thích với Next.js 13...');

// Đường dẫn đến package.json của next-auth
const nextAuthPackagePath = path.resolve('./node_modules/next-auth/package.json');
const nextAuthReactIndexPath = path.resolve('./node_modules/next-auth/react/index.js');

// 1. Sửa package.json để chấp nhận Next.js 13
try {
  if (fs.existsSync(nextAuthPackagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(nextAuthPackagePath, 'utf8'));
    log('Đã đọc package.json của next-auth', { 
      peerDependencies: packageJson.peerDependencies
    });
    
    // Sửa peerDependencies để chấp nhận Next.js 13
    if (packageJson.peerDependencies && packageJson.peerDependencies.next) {
      packageJson.peerDependencies.next = "^12.2.5 || ^13";
      fs.writeFileSync(nextAuthPackagePath, JSON.stringify(packageJson, null, 2));
      log('✅ Updated next-auth package.json peerDependencies', { 
        new: "^12.2.5 || ^13" 
      });
    }
  } else {
    log('❌ Could not find next-auth package.json', { path: nextAuthPackagePath }, true);
  }
} catch (error) {
  log('Error updating next-auth package.json:', error, true);
}

// 2. Check next-auth/react index.js để xem có vấn đề với jsx-runtime không
try {
  if (fs.existsSync(nextAuthReactIndexPath)) {
    const reactIndexContent = fs.readFileSync(nextAuthReactIndexPath, 'utf8');
    log('Kiểm tra next-auth/react/index.js', {
      fileSize: reactIndexContent.length,
      hasJsxRuntime: reactIndexContent.includes('jsx-runtime')
    });
    
    // Chỉ log nội dung file để debug
    if (reactIndexContent.includes('jsx-runtime')) {
      log('next-auth/react/index.js có sử dụng jsx-runtime');
    }
  } else {
    log('next-auth/react/index.js không tìm thấy', null, true);
  }
} catch (error) {
  log('Lỗi kiểm tra next-auth/react/index.js', error, true);
}

// 3. Đảm bảo react-dom/client polyfill đã được tạo
const reactDomClientPath = path.resolve('./react-dom-client.js');
try {
  if (fs.existsSync(reactDomClientPath)) {
    log('react-dom/client polyfill đã tồn tại');
  } else {
    log('Không tìm thấy react-dom/client polyfill, cần tạo file', null, true);
  }
} catch (error) {
  log('Lỗi kiểm tra react-dom/client polyfill', error, true);
}

// 4. Thêm file _app.js vào thư mục pages nếu chưa có (để xử lý lỗi với React children)
const appJsPath = path.resolve('./pages/_app.js');
const appJsContent = `
import React, { useEffect } from 'react';
import '../styles/globals.css';

// Xử lý lỗi React
function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  );
}

// ErrorBoundary để bắt lỗi React
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error && this.state.error.toString()}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log('MyApp mounted');
  }, []);

  return (
    <SafeHydrate>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </SafeHydrate>
  );
}

export default MyApp;
`;

try {
  if (!fs.existsSync('./pages')) {
    log('Tạo thư mục pages');
    fs.mkdirSync('./pages', { recursive: true });
  }
  
  if (!fs.existsSync(appJsPath)) {
    log('Tạo file _app.js để xử lý lỗi React children');
    fs.writeFileSync(appJsPath, appJsContent);
    log('✅ Created _app.js with error boundary');
  } else {
    log('_app.js đã tồn tại');
  }
} catch (error) {
  log('Lỗi khi xử lý _app.js', error, true);
}

log('Patch đã hoàn thành!'); 