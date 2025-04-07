const fs = require('fs');
const path = require('path');

/**
 * Fix for Next.js 14 on Node.js 20+ and Windows
 * This script modifies node_modules files to fix compatibility issues
 */
console.log('Applying webpack and Node.js compatibility fixes...');

// Paths to fix
const nextRequestPath = path.resolve('./node_modules/next/dist/server/web/spec-extension/request.js');
const nextResponsePath = path.resolve('./node_modules/next/dist/server/web/spec-extension/response.js');
const nextHeadersPath = path.resolve('./node_modules/next/dist/server/web/spec-extension/adapters/headers.js');
const patchLockfilePath = path.resolve('./node_modules/next/dist/lib/patch-incorrect-lockfile.js');
const nextConfigPath = path.resolve('./next.config.js');

// Function to backup file
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.backup-${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backed up ${filePath} to ${backupPath}`);
  }
}

// Fix request.js - add global.Request polyfill
if (fs.existsSync(nextRequestPath)) {
  backupFile(nextRequestPath);
  
  let content = fs.readFileSync(nextRequestPath, 'utf8');
  
  // Add polyfill at the top of the file
  const polyfill = `
// Polyfill for Node.js 22+
if (typeof global.Request === 'undefined') {
  const { Request: NodeRequest } = require('undici');
  global.Request = NodeRequest;
}
`;
  
  content = polyfill + content;
  fs.writeFileSync(nextRequestPath, content);
  console.log('Fixed Request polyfill in:', nextRequestPath);
}

// Fix response.js - add global.Response polyfill
if (fs.existsSync(nextResponsePath)) {
  backupFile(nextResponsePath);
  
  let content = fs.readFileSync(nextResponsePath, 'utf8');
  
  // Add polyfill at the top of the file
  const polyfill = `
// Polyfill for Node.js 22+
if (typeof global.Response === 'undefined') {
  const { Response: NodeResponse } = require('undici');
  global.Response = NodeResponse;
}
`;
  
  content = polyfill + content;
  fs.writeFileSync(nextResponsePath, content);
  console.log('Fixed Response polyfill in:', nextResponsePath);
}

// Fix headers.js - add global.Headers polyfill
if (fs.existsSync(nextHeadersPath)) {
  backupFile(nextHeadersPath);
  
  let content = fs.readFileSync(nextHeadersPath, 'utf8');
  
  // Add polyfill at the top of the file
  const polyfill = `
// Polyfill for Node.js 22+
if (typeof global.Headers === 'undefined') {
  const { Headers: NodeHeaders } = require('undici');
  global.Headers = NodeHeaders;
}
`;
  
  content = polyfill + content;
  fs.writeFileSync(nextHeadersPath, content);
  console.log('Fixed Headers polyfill in:', nextHeadersPath);
}

// Fix patch-incorrect-lockfile.js - add global.fetch polyfill
if (fs.existsSync(patchLockfilePath)) {
  backupFile(patchLockfilePath);
  
  let content = fs.readFileSync(patchLockfilePath, 'utf8');
  
  // Add polyfill at the top of the file
  const polyfill = `
// Polyfill for Node.js 22+ fetch
if (typeof global.fetch === 'undefined') {
  const { fetch: NodeFetch } = require('undici');
  global.fetch = NodeFetch;
}
`;
  
  content = polyfill + content;
  fs.writeFileSync(patchLockfilePath, content);
  console.log('Fixed fetch polyfill in:', patchLockfilePath);
}

// Install required dependency
const { execSync } = require('child_process');
try {
  console.log('Installing undici for Web API polyfills...');
  execSync('npm install --save undici', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install undici:', error.message);
}

console.log('All fixes applied successfully!'); 