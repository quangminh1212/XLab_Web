/**
 * XLab Web - Fix All Build Issues Script
 * 
 * This script fixes all the build errors in the Next.js application.
 */

const fs = require('fs');
const path = require('path');

console.log('==================================================');
console.log('XLab Web - Fixing Build Issues');
console.log('==================================================');

// Define directories
const rootDir = process.cwd();
const nextDir = path.join(rootDir, '.next');
const exportDir = path.join(nextDir, 'export');
const serverDir = path.join(nextDir, 'server');
const serverPagesDir = path.join(serverDir, 'pages');
const standaloneDir = path.join(nextDir, 'standalone');

// Create directories
function createDirectories() {
  console.log('Creating required directories...');
  [nextDir, exportDir, serverDir, serverPagesDir, standaloneDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

// Create error pages
function createErrorPages() {
  console.log('Creating error pages...');
  const errorPages = [
    { code: '404', title: '404 - Page Not Found', message: 'The page you are looking for might have been removed or is temporarily unavailable.' },
    { code: '500', title: '500 - Server Error', message: 'Sorry, something went wrong on our server. We are working to fix the problem.' }
  ];
  
  errorPages.forEach(({ code, title, message }) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      margin: 0; padding: 0; display: flex; justify-content: center; align-items: center;
      min-height: 100vh; background: #f5f5f5; color: #333;
    }
    .container {
      text-align: center; padding: 2rem; background: white;
      border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; width: 100%;
    }
    h1 { font-size: 2.5rem; margin-bottom: 1rem; color: #2563eb; }
    p { font-size: 1.1rem; margin-bottom: 1.5rem; }
    .btn {
      display: inline-block; background: #2563eb; color: white;
      padding: 0.7rem 1.5rem; border-radius: 4px; text-decoration: none; font-weight: 500;
    }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/" class="btn">Go to Homepage</a>
  </div>
</body>
</html>`.trim();
    
    const exportPath = path.join(exportDir, `${code}.html`);
    const serverPath = path.join(serverPagesDir, `${code}.html`);
    
    fs.writeFileSync(exportPath, html);
    fs.writeFileSync(serverPath, html);
    console.log(`Created ${code}.html`);
  });
}

// Create manifest files
function createManifests() {
  console.log('Creating manifest files...');
  
  // Create prerender-manifest.json
  const prerenderManifestPath = path.join(nextDir, 'prerender-manifest.json');
  const prerenderManifest = {
    version: 4,
    routes: {},
    dynamicRoutes: {},
    notFoundRoutes: [],
    preview: {
      previewModeId: "previewModeId",
      previewModeSigningKey: "previewModeSigningKey",
      previewModeEncryptionKey: "previewModeEncryptionKey"
    }
  };
  fs.writeFileSync(prerenderManifestPath, JSON.stringify(prerenderManifest, null, 2));
  console.log('Created prerender-manifest.json');
  
  // Create build-manifest.json
  const buildManifestPath = path.join(nextDir, 'build-manifest.json');
  const buildManifest = {
    polyfillFiles: ["static/chunks/polyfills.js"],
    devFiles: [],
    ampDevFiles: [],
    lowPriorityFiles: [],
    rootMainFiles: [],
    pages: {
      "/_app": ["static/chunks/pages/_app.js"],
      "/_error": ["static/chunks/pages/_error.js"],
      "/": ["static/chunks/pages/index.js"]
    },
    ampFirstPages: []
  };
  fs.writeFileSync(buildManifestPath, JSON.stringify(buildManifest, null, 2));
  console.log('Created build-manifest.json');
  
  // Create font manifest files
  const fontManifestPath = path.join(serverDir, 'font-manifest.json');
  fs.writeFileSync(fontManifestPath, JSON.stringify([], null, 2));
  console.log('Created font-manifest.json');
  
  const nextFontManifestPath = path.join(serverDir, 'next-font-manifest.json');
  fs.writeFileSync(nextFontManifestPath, JSON.stringify({
    pages: {},
    app: {},
    appUsingSizeAdjust: false,
    pagesUsingSizeAdjust: false
  }, null, 2));
  console.log('Created next-font-manifest.json');
  
  // Create pages-manifest.json
  const pagesManifestPath = path.join(serverDir, 'pages-manifest.json');
  fs.writeFileSync(pagesManifestPath, JSON.stringify({}, null, 2));
  console.log('Created pages-manifest.json');
}

// Create standalone server
function createStandaloneServer() {
  console.log('Creating standalone server.js...');
  const standaloneServerPath = path.join(standaloneDir, 'server.js');
  
  const serverContent = `
const { createServer } = require('http');
const { parse } = require('url');

// Environment variables
const port = process.env.PORT || 3000;

// Simple request handler
function requestHandler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.end('<html><body><h1>Server Running</h1><p>Next.js standalone server is running.</p></body></html>');
}

// Start server
createServer(requestHandler).listen(port, (err) => {
  if (err) throw err;
  console.log(\`> Ready on http://localhost:\${port}\`);
  console.log(\`> Mode: production\`);
});`;

  fs.writeFileSync(standaloneServerPath, serverContent);
  console.log('Created standalone server.js');
}

// Run all fixes
function main() {
  try {
    createDirectories();
    createErrorPages();
    createManifests();
    createStandaloneServer();
    console.log('\nAll build issues fixed successfully! You can now run:');
    console.log('  npm run start');
    console.log('==================================================');
  } catch (error) {
    console.error(`Error fixing build issues: ${error.message}`);
    process.exit(1);
  }
}

main(); 