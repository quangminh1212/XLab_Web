const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Starting SWC cleanup ===');

// Function to safely delete a file or directory
function safeDelete(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        // Use fs.rm instead of fs.rmdir to avoid deprecation warning
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
      console.log(`✅ Deleted: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Could not delete ${filePath}: ${error.message}`);
    return false;
  }
}

// Clean problematic SWC files
function cleanSwcFiles() {
  console.log('🧹 Cleaning problematic SWC files...');
  
  // Delete the problematic swc-win32-x64-msvc directory if it exists
  const swcWinPath = path.join(__dirname, 'node_modules', '@next', 'swc-win32-x64-msvc');
  if (safeDelete(swcWinPath)) {
    console.log('✅ Removed problematic swc-win32-x64-msvc package');
  } else {
    console.log('ℹ️ swc-win32-x64-msvc package not found or already removed');
  }
  
  // Clean .next cache
  const nextCachePath = path.join(__dirname, '.next', 'cache');
  if (safeDelete(nextCachePath)) {
    console.log('✅ Cleared Next.js cache');
    fs.mkdirSync(nextCachePath, { recursive: true });
    console.log('✅ Recreated empty cache directory');
  } else {
    console.log('ℹ️ Next.js cache not found or already cleared');
  }
  
  // Clean node_modules cache
  const nodeModulesCachePath = path.join(__dirname, 'node_modules', '.cache');
  if (safeDelete(nodeModulesCachePath)) {
    console.log('✅ Cleared node_modules cache');
  } else {
    console.log('ℹ️ node_modules cache not found or already cleared');
  }
}

// Clear npm cache
function clearNpmCache() {
  console.log('🧼 Clearing npm cache...');
  
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
    console.log('✅ Cleared npm cache');
  } catch (error) {
    console.error('❌ Error clearing npm cache:', error.message);
  }
}

// Run cleaning operations
cleanSwcFiles();
clearNpmCache();

console.log('=== SWC cleanup completed ===');
console.log('🚀 Please restart your Next.js application'); 