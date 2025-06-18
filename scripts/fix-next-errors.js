const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Comprehensive script to fix various Next.js development errors
 * Handles directory creation, cache clearing, and temp file generation
 */
function fixNextErrors() {
  console.log('🔧 Fixing Next.js errors...');
  
  // Create directories that might be missing
  const directories = [
    '.next/server/chunks',
    '.next/cache/webpack/client-development',
    '.next/cache/webpack/server-development',
    '.next/cache/webpack/edge-server-development'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      try {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created directory: ${fullPath}`);
      } catch (err) {
        console.error(`❌ Failed to create directory: ${fullPath}`, err);
      }
    }
  });
  
  // Create empty pack files for webpack cache
  const packFiles = [
    '.next/cache/webpack/client-development/0.pack',
    '.next/cache/webpack/client-development/1.pack',
    '.next/cache/webpack/client-development/2.pack',
    '.next/cache/webpack/client-development/3.pack',
    '.next/cache/webpack/client-development/4.pack',
    '.next/cache/webpack/client-development/5.pack',
    '.next/cache/webpack/server-development/0.pack',
    '.next/cache/webpack/server-development/1.pack',
    '.next/cache/webpack/server-development/2.pack',
    '.next/cache/webpack/server-development/3.pack',
    '.next/cache/webpack/server-development/4.pack',
    '.next/cache/webpack/server-development/5.pack',
    '.next/cache/webpack/edge-server-development/0.pack',
    '.next/cache/webpack/edge-server-development/1.pack',
    '.next/cache/webpack/edge-server-development/1.pack.gz',
    '.next/cache/webpack/edge-server-development/2.pack',
    '.next/cache/webpack/edge-server-development/2.pack.gz',
    '.next/cache/webpack/edge-server-development/3.pack',
    '.next/cache/webpack/edge-server-development/3.pack.gz',
    '.next/cache/webpack/edge-server-development/4.pack',
    '.next/cache/webpack/edge-server-development/4.pack.gz',
    '.next/cache/webpack/edge-server-development/5.pack',
  ];
  
  packFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      try {
        // Ensure parent directory exists
        const parentDir = path.dirname(fullPath);
        if (!fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true });
        }
        
        // Create empty file
        fs.writeFileSync(fullPath, '');
        console.log(`✅ Created empty file: ${fullPath}`);
      } catch (err) {
        console.error(`❌ Failed to create file: ${fullPath}`, err);
      }
    }
  });

  // Fix for clientModules TypeError
  try {
    // Create a minimal manifest file to resolve the clientModules error
    const manifestDir = path.join(process.cwd(), '.next/build-manifest.json');
    const manifest = {
      "polyfillFiles": [],
      "devFiles": [],
      "ampDevFiles": [],
      "lowPriorityFiles": [],
      "rootMainFiles": [],
      "pages": {
        "/_app": [],
        "/": []
      },
      "ampFirstPages": []
    };
    
    if (!fs.existsSync(path.dirname(manifestDir))) {
      fs.mkdirSync(path.dirname(manifestDir), { recursive: true });
    }
    
    fs.writeFileSync(manifestDir, JSON.stringify(manifest, null, 2));
    console.log(`✅ Created build manifest to fix clientModules error`);
  } catch (err) {
    console.error(`❌ Failed to create build manifest:`, err);
  }
  
  // Clear any Next.js cache that might be corrupted
  try {
    // Try cleaning the Next.js cache
    if (fs.existsSync(path.join(process.cwd(), 'node_modules', '.cache'))) {
      fs.rmSync(path.join(process.cwd(), 'node_modules', '.cache'), { recursive: true, force: true });
      console.log('✅ Cleared Next.js module cache');
    }
  } catch (err) {
    console.error('❌ Failed to clear Next.js cache:', err);
  }
  
  console.log('✨ Completed fixing Next.js errors!');
}

// Run the fix function
fixNextErrors();
