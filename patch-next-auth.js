// Patch cho next-auth để tương thích với Next.js 15
const fs = require('fs');
const path = require('path');

console.log('Patching next-auth to work with Next.js 15...');

// Các đường dẫn
const nextAuthPackagePath = path.resolve('./node_modules/next-auth/package.json');
const nextAuthIndexPath = path.resolve('./node_modules/next-auth/index.js');
const nextAuthReactPath = path.resolve('./node_modules/next-auth/react/index.js');

// 1. Sửa package.json để chấp nhận Next.js 15
try {
  if (fs.existsSync(nextAuthPackagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(nextAuthPackagePath, 'utf8'));
    
    // Sửa peerDependencies để chấp nhận Next.js 15
    if (packageJson.peerDependencies && packageJson.peerDependencies.next) {
      packageJson.peerDependencies.next = "^12.2.5 || ^13 || ^14 || ^15";
      fs.writeFileSync(nextAuthPackagePath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Updated next-auth package.json peerDependencies');
    }
  } else {
    console.log('❌ Could not find next-auth package.json');
  }
} catch (error) {
  console.error('Error updating next-auth package.json:', error);
}

// 2. Tạo bản patch cho react/jsx-runtime
const jSXRuntimeFixContent = `
try {
  // Thử sử dụng đường dẫn jsx-runtime chuẩn
  module.exports = require('react/jsx-runtime');
} catch (e) {
  // Fallback nếu không tìm thấy
  console.warn('next-auth: Could not load react/jsx-runtime, using polyfill');
  module.exports = {
    jsx: (type, props) => ({ type, props }),
    jsxs: (type, props) => ({ type, props }),
    Fragment: Symbol.for('react.fragment')
  };
}
`;

// Tạo file polyfill cho jsx-runtime
const jSXRuntimePath = path.resolve('./node_modules/react/jsx-runtime/index.js');
const jSXRuntimeDir = path.dirname(jSXRuntimePath);

try {
  if (!fs.existsSync(jSXRuntimeDir)) {
    fs.mkdirSync(jSXRuntimeDir, { recursive: true });
    console.log('✅ Created jsx-runtime directory');
  }
  
  fs.writeFileSync(jSXRuntimePath, jSXRuntimeFixContent);
  console.log('✅ Created jsx-runtime polyfill');
} catch (error) {
  console.error('Error creating jsx-runtime polyfill:', error);
}

console.log('Patch completed!'); 