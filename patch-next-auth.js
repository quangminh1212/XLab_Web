// Patch cho next-auth để tương thích với Next.js 13
const fs = require('fs');
const path = require('path');

console.log('Patching next-auth để tương thích với Next.js 13...');

// Đường dẫn đến package.json của next-auth
const nextAuthPackagePath = path.resolve('./node_modules/next-auth/package.json');

// Sửa package.json để chấp nhận Next.js 13
try {
  if (fs.existsSync(nextAuthPackagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(nextAuthPackagePath, 'utf8'));
    
    // Sửa peerDependencies để chấp nhận Next.js 13
    if (packageJson.peerDependencies && packageJson.peerDependencies.next) {
      packageJson.peerDependencies.next = "^12.2.5 || ^13";
      fs.writeFileSync(nextAuthPackagePath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Updated next-auth package.json peerDependencies');
    }
  } else {
    console.log('❌ Could not find next-auth package.json');
  }
} catch (error) {
  console.error('Error updating next-auth package.json:', error);
}

console.log('Patch đã hoàn thành!'); 