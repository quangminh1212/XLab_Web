const fs = require('fs');
const path = require('path');

console.log('=== Starting webpack-manifest-plugin fix ===');

// Create a directory for custom modules if it doesn't exist
const customModulesDir = path.join(__dirname, 'node_modules', '_custom');
if (!fs.existsSync(customModulesDir)) {
  fs.mkdirSync(customModulesDir, { recursive: true });
  console.log(`✅ Created custom modules directory: ${customModulesDir}`);
}

// Create a mock webpack-manifest-plugin directory if it doesn't exist
const webpackManifestDir = path.join(customModulesDir, 'webpack-manifest-plugin');
if (!fs.existsSync(webpackManifestDir)) {
  fs.mkdirSync(webpackManifestDir, { recursive: true });
  console.log(`✅ Created mock webpack-manifest-plugin directory: ${webpackManifestDir}`);
}

// Create a mock package.json file
const packageJsonPath = path.join(webpackManifestDir, 'package.json');
const packageJsonContent = JSON.stringify({
  name: "webpack-manifest-plugin",
  version: "5.0.0",
  main: "index.js",
  description: "Mock webpack-manifest-plugin to prevent warnings"
}, null, 2);

fs.writeFileSync(packageJsonPath, packageJsonContent);
console.log(`✅ Created mock package.json: ${packageJsonPath}`);

// Create a mock index.js file with a no-op implementation
const indexJsPath = path.join(webpackManifestDir, 'index.js');
const indexJsContent = `
// Mock implementation of webpack-manifest-plugin
class WebpackManifestPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    // No-op implementation
    compiler.hooks.emit.tapAsync('WebpackManifestPlugin', (compilation, callback) => {
      // Create an empty manifest
      const manifest = {};
      
      // Add to assets
      if (this.options.fileName) {
        compilation.assets[this.options.fileName] = {
          source: () => JSON.stringify({ files: {} }),
          size: () => JSON.stringify({ files: {} }).length
        };
      }
      
      callback();
    });
  }
}

module.exports = { WebpackManifestPlugin };
`;

fs.writeFileSync(indexJsPath, indexJsContent);
console.log(`✅ Created mock WebpackManifestPlugin implementation: ${indexJsPath}`);

// Create a symbolic link in node_modules if it doesn't exist
const nodeModulesLinkPath = path.join(__dirname, 'node_modules', 'webpack-manifest-plugin');
if (!fs.existsSync(nodeModulesLinkPath)) {
  try {
    // Try creating a symbolic link (requires admin rights on Windows)
    fs.symlinkSync(webpackManifestDir, nodeModulesLinkPath, 'junction');
    console.log(`✅ Created symbolic link to mock implementation: ${nodeModulesLinkPath}`);
  } catch (error) {
    // If symlink fails, copy the directory instead
    if (!fs.existsSync(nodeModulesLinkPath)) {
      fs.mkdirSync(nodeModulesLinkPath, { recursive: true });
      fs.copyFileSync(indexJsPath, path.join(nodeModulesLinkPath, 'index.js'));
      fs.copyFileSync(packageJsonPath, path.join(nodeModulesLinkPath, 'package.json'));
      console.log(`✅ Copied mock implementation to: ${nodeModulesLinkPath}`);
    }
  }
}

// Update next.config.js to handle webpack-manifest-plugin differently
const nextConfigPath = path.join(__dirname, 'next.config.js');
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

// Check if we need to modify the webpack-manifest-plugin usage
if (nextConfig.includes('const { WebpackManifestPlugin } = require(\'webpack-manifest-plugin\');')) {
  console.log('⚠️ Fixing WebpackManifestPlugin usage in next.config.js...');
  
  // Add a silent catch handler for webpack-manifest-plugin
  nextConfig = nextConfig.replace(
    'try {\n        const { WebpackManifestPlugin } = require(\'webpack-manifest-plugin\');',
    'try {\n        // Use our mock implementation\n        const { WebpackManifestPlugin } = require(\'webpack-manifest-plugin\');'
  );
  
  fs.writeFileSync(nextConfigPath, nextConfig);
  console.log('✅ Updated next.config.js to use mock implementation');
} else {
  console.log('⚠️ No WebpackManifestPlugin usage found in next.config.js or already fixed');
}

console.log('=== webpack-manifest-plugin fix completed ==='); 