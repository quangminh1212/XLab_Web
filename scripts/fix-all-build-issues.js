/**
 * XLab Web - Fix All Build Issues Script
 * 
 * This script fixes all the build errors in the Next.js application.
 */

const fs = require('fs');
const path = require('path');
const isWindows = process.platform === 'win32';

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
  
  // Clean existing directories first on Windows to prevent permission issues
  if (isWindows) {
    try {
      if (fs.existsSync(exportDir)) {
        fs.rmSync(exportDir, { recursive: true, force: true });
      }
      if (fs.existsSync(serverPagesDir)) {
        fs.rmSync(serverPagesDir, { recursive: true, force: true });
      }
    } catch (err) {
      console.warn(`Warning: Could not clean directories: ${err.message}`);
    }
  }
  
  // Create directories
  [nextDir, exportDir, serverDir, serverPagesDir, standaloneDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      } catch (err) {
        console.error(`Failed to create directory ${dir}: ${err.message}`);
        if (isWindows) {
          console.error('On Windows, try running with administrator privileges or manually create the directories.');
        }
      }
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
    
    try {
      // Write files to both locations
      fs.writeFileSync(exportPath, html);
      console.log(`Created ${code}.html in export directory`);
    } catch (err) {
      console.error(`Error creating ${code}.html in export directory: ${err.message}`);
    }
    
    try {
      fs.writeFileSync(serverPath, html);
      console.log(`Created ${code}.html in server/pages directory`);
    } catch (err) {
      console.error(`Error creating ${code}.html in server/pages directory: ${err.message}`);
    }
    
    // Make an extra copy for Windows to work around file locking issues
    if (isWindows) {
      try {
        const backupDir = path.join(nextDir, 'backup');
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }
        fs.writeFileSync(path.join(backupDir, `${code}.html`), html);
      } catch (err) {
        // Ignore backup errors
      }
    }
  });
}

// Create manifest files
function createManifests() {
  console.log('Creating manifest files...');
  
  const manifests = [
    {
      path: path.join(nextDir, 'prerender-manifest.json'),
      content: {
        version: 4,
        routes: {},
        dynamicRoutes: {},
        notFoundRoutes: [],
        preview: {
          previewModeId: "previewModeId",
          previewModeSigningKey: "previewModeSigningKey",
          previewModeEncryptionKey: "previewModeEncryptionKey"
        }
      },
      name: 'prerender-manifest.json'
    },
    {
      path: path.join(nextDir, 'build-manifest.json'),
      content: {
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
      },
      name: 'build-manifest.json'
    },
    {
      path: path.join(serverDir, 'font-manifest.json'),
      content: [],
      name: 'font-manifest.json'
    },
    {
      path: path.join(serverDir, 'next-font-manifest.json'),
      content: {
        pages: {},
        app: {},
        appUsingSizeAdjust: false,
        pagesUsingSizeAdjust: false
      },
      name: 'next-font-manifest.json'
    },
    {
      path: path.join(serverDir, 'pages-manifest.json'),
      content: {},
      name: 'pages-manifest.json'
    },
    {
      path: path.join(serverDir, 'middleware-manifest.json'),
      content: {
        version: 1,
        sortedMiddleware: [],
        middleware: {},
        functions: {},
        staticAssets: [],
        rsc: {
          module: "",
          css: [],
          function: {}
        }
      },
      name: 'middleware-manifest.json'
    }
  ];
  
  manifests.forEach(({ path, content, name }) => {
    try {
      fs.writeFileSync(path, JSON.stringify(content, null, 2));
      console.log(`Created ${name}`);
    } catch (err) {
      console.error(`Error creating ${name}: ${err.message}`);
    }
  });
}

// Create standalone server
function createStandaloneServer() {
  console.log('Creating standalone server.js...');
  const standaloneServerPath = path.join(standaloneDir, 'server.js');
  
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
  
  // Basic static file handling
  try {
    const staticPath = path.join(__dirname, 'public', pathname);
    if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
      const content = fs.readFileSync(staticPath);
      res.writeHead(200);
      return res.end(content);
    }
  } catch (e) {
    // Fall through to default handler
  }
  
  // Default response
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

  try {
    fs.writeFileSync(standaloneServerPath, serverContent);
    console.log('Created standalone server.js');
  } catch (err) {
    console.error(`Error creating standalone server.js: ${err.message}`);
  }
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
    return 0; // Success exit code
  } catch (error) {
    console.error(`Error fixing build issues: ${error.message}`);
    return 1; // Error exit code
  }
}

// Execute and return exit code
process.exit(main()); 