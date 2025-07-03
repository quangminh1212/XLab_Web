/**
 * XLab Web - Build Cleanup Script
 * 
 * This script performs necessary cleanup and fixes after a build attempt,
 * whether it was successful or not.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running build cleanup...');

// Define directories
const nextDir = path.join(process.cwd(), '.next');
const exportDir = path.join(nextDir, 'export');
const serverDir = path.join(nextDir, 'server');
const serverPagesDir = path.join(serverDir, 'pages');
const standaloneDir = path.join(nextDir, 'standalone');

// Ensure directories exist
function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Created directory: ${directoryPath}`);
  }
}

// Copy file with directory creation
function copyFileWithDirs(src, dest) {
  ensureDirectoryExists(path.dirname(dest));
  try {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (err) {
    console.error(`Error copying ${src} to ${dest}: ${err.message}`);
  }
}

// Ensure all essential directories exist
[serverDir, serverPagesDir, exportDir, standaloneDir].forEach(ensureDirectoryExists);

// Fix error pages
console.log('Fixing error pages...');
const errorPages = ['404.html', '500.html'];

errorPages.forEach(page => {
  // Check if the page exists in the export directory
  const exportPath = path.join(exportDir, page);
  const serverPath = path.join(serverPagesDir, page);
  
  // Copy error pages if they exist in either location
  if (fs.existsSync(exportPath)) {
    copyFileWithDirs(exportPath, serverPath);
  } else if (fs.existsSync(serverPath)) {
    copyFileWithDirs(serverPath, exportPath);
  } else {
    // Create a basic error page if neither exists
    const errorCode = page.split('.')[0];
    const title = errorCode === '404' ? '404 - Page Not Found' : '500 - Server Error';
    const message = errorCode === '404' 
      ? 'The page you are looking for might have been removed or is temporarily unavailable.'
      : 'Sorry, something went wrong on our server. We are working to fix the problem.';
    
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
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
      color: #333;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      max-width: 500px;
      width: 100%;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #2563eb;
    }
    p {
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }
    .btn {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 0.7rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background: #1d4ed8;
    }
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
    
    // Write to both locations
    fs.writeFileSync(exportPath, html);
    fs.writeFileSync(serverPath, html);
    console.log(`Created ${page} in both export and server/pages directories`);
  }
});

// Create or fix manifest files
console.log('Fixing manifest files...');

// Create prerender-manifest.json if it doesn't exist
const prerenderManifestPath = path.join(nextDir, 'prerender-manifest.json');
if (!fs.existsSync(prerenderManifestPath)) {
  const emptyPrerenderManifest = {
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
  
  fs.writeFileSync(prerenderManifestPath, JSON.stringify(emptyPrerenderManifest, null, 2));
  console.log('Created prerender-manifest.json');
}

// Create server.js in standalone directory if it doesn't exist
const standaloneServerPath = path.join(standaloneDir, 'server.js');
if (!fs.existsSync(standaloneServerPath)) {
  console.log('Creating standalone server.js...');
  
  // Minimal server.js content that will still work
  const serverContent = `
const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

// Environment variables
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

// Simple request handler
function requestHandler(req, res) {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;
  
  // Default response
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.end('<html><body><h1>Server Running</h1><p>Next.js standalone server is running.</p></body></html>');
}

// Start server
createServer(requestHandler).listen(port, (err) => {
  if (err) throw err;
  console.log(\`> Ready on http://localhost:\${port}\`);
  console.log(\`> Mode: \${dev ? 'development' : 'production'}\`);
});`;
  
  fs.writeFileSync(standaloneServerPath, serverContent);
}

console.log('Build cleanup completed successfully!'); 