// Patch cho next-auth để tương thích với Next.js 15
const fs = require('fs');
const path = require('path');

console.log('Patching next-auth to work with Next.js 15...');

// Các đường dẫn
const nextAuthPackagePath = path.resolve('./node_modules/next-auth/package.json');
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

// 2. Sửa file react/index.js của next-auth để không sử dụng jsx-runtime
try {
  if (fs.existsSync(nextAuthReactPath)) {
    let reactIndexContent = fs.readFileSync(nextAuthReactPath, 'utf8');
    
    // Kiểm tra xem file đã được patch chưa
    if (reactIndexContent.includes('var _jsxRuntime = require("react/jsx-runtime")')) {
      // Thay thế lệnh require jsx-runtime bằng polyfill
      const patchedContent = reactIndexContent.replace(
        'var _jsxRuntime = require("react/jsx-runtime");',
        `// JSX Runtime Polyfill for Next.js 15 compatibility
var _jsxRuntime = {
  jsx: function jsx(type, props) { return { type: type, props: props }; },
  jsxs: function jsxs(type, props) { return { type: type, props: props }; },
  Fragment: Symbol.for('react.fragment')
};\n`
      );
      
      fs.writeFileSync(nextAuthReactPath, patchedContent);
      console.log('✅ Patched next-auth/react/index.js to use JSX Runtime polyfill');
    } else {
      console.log('ℹ️ next-auth/react/index.js already patched or not using jsx-runtime');
    }
  } else {
    console.log('❌ Could not find next-auth/react/index.js');
  }
} catch (error) {
  console.error('Error patching next-auth/react/index.js:', error);
}

// 3. Tạo bản patch cho react/jsx-runtime
const jSXRuntimeFixContent = `
// Next.js 15 JSX Runtime polyfill
module.exports = {
  jsx: function jsx(type, props) { return { type: type, props: props }; },
  jsxs: function jsxs(type, props) { return { type: type, props: props }; },
  Fragment: Symbol.for('react.fragment')
};
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

// 4. Tạo file loader
const loaderContent = `
// JSX Runtime loader cho Next.js 15
const originalRequire = module.constructor.prototype.require;

module.constructor.prototype.require = function patchedRequire(path) {
  if (path === 'react/jsx-runtime') {
    return {
      jsx: function jsx(type, props) { return { type: type, props: props }; },
      jsxs: function jsxs(type, props) { return { type: type, props: props }; },
      Fragment: Symbol.for('react.fragment')
    };
  }
  
  return originalRequire.apply(this, arguments);
};

module.exports = {};
`;

const loaderPath = path.resolve('./jsx-runtime-loader.js');
try {
  fs.writeFileSync(loaderPath, loaderContent);
  console.log('✅ Created JSX Runtime loader');
} catch (error) {
  console.error('Error creating JSX Runtime loader:', error);
}

console.log('Patch completed!'); 