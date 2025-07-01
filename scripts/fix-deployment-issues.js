const fs = require('fs');
const path = require('path');

/**
 * Script to fix deployment issues on Vercel
 */

console.log('🔧 Fixing deployment issues...');

// Create necessary directories
const requiredDirs = [
  'src/pages/api',
  '.next/cache/webpack/client-development',
  '.next/cache/webpack/server-development',
  '.next/cache/webpack/edge-server-development',
  '.next/static/chunks',
  '.next/static/css',
  '.next/server/app',
  '.next/server/chunks',
  'data/backups',
  'public/uploads',
  'public/uploads/products',
  'public/images/placeholder',
];

requiredDirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${fullPath}`);
  }
});

// Create a placeholder product image if it doesn't exist
const placeholderPath = path.join(process.cwd(), 'public/images/placeholder/product-placeholder.jpg');
if (!fs.existsSync(placeholderPath)) {
  // Create a simple placeholder file (1x1 transparent pixel)
  try {
    // Copy from public/placeholder-product.jpg if it exists
    const sourcePlaceholder = path.join(process.cwd(), 'public/placeholder-product.jpg');
    if (fs.existsSync(sourcePlaceholder)) {
      fs.copyFileSync(sourcePlaceholder, placeholderPath);
    } else {
      // Create an empty file as fallback
      fs.writeFileSync(placeholderPath, '');
    }
    console.log(`✅ Created placeholder image: ${placeholderPath}`);
  } catch (error) {
    console.error(`❌ Error creating placeholder image: ${error}`);
  }
}

// Create a .gitkeep file in the src/pages/api directory
const gitKeepPath = path.join(process.cwd(), 'src/pages/api/.gitkeep');
if (!fs.existsSync(gitKeepPath)) {
  fs.writeFileSync(gitKeepPath, '');
  console.log('✅ Created .gitkeep file in src/pages/api');
}

// Check for package-lock.json and create a minimal one if it doesn't exist
const packageLockPath = path.join(process.cwd(), 'package-lock.json');
if (!fs.existsSync(packageLockPath)) {
  console.log('⚠️ package-lock.json not found. Creating a minimal one for deployment...');
  
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = require(packageJsonPath);
    
    // Create a minimal package-lock.json for deployment purposes
    const minimalPackageLock = {
      name: packageJson.name,
      version: packageJson.version,
      lockfileVersion: 3,
      requires: true,
      packages: {
        "": {
          name: packageJson.name,
          version: packageJson.version,
          dependencies: {
            ...packageJson.dependencies
          },
          engines: packageJson.engines
        }
      }
    };
    
    fs.writeFileSync(packageLockPath, JSON.stringify(minimalPackageLock, null, 2));
    console.log('✅ Created minimal package-lock.json for deployment');
  } catch (error) {
    console.error('❌ Error creating package-lock.json:', error);
  }
}

console.log('✨ Deployment fixes completed!'); 