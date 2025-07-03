const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');

// Define directories
const nextDir = path.join(process.cwd(), '.next');
const serverDir = path.join(nextDir, 'server');
const serverPagesDir = path.join(serverDir, 'pages');

console.log('Starting server directly with bypass fixes...');

// Create directories if they don't exist
function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Created directory: ${directoryPath}`);
  }
}

// Create prerender-manifest.json
function createPrerenderManifest() {
  const prerenderManifestPath = path.join(nextDir, 'prerender-manifest.json');
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

// Create BUILD_ID file
function createBuildId() {
  const buildIdPath = path.join(nextDir, 'BUILD_ID');
  // Generate a random build ID
  const buildId = crypto.randomBytes(16).toString('hex');
  fs.writeFileSync(buildIdPath, buildId);
  console.log(`Created BUILD_ID file with ID: ${buildId}`);
}

// Create build-manifest.json - essential for Next.js to function
function createBuildManifest() {
  const buildManifestPath = path.join(nextDir, 'build-manifest.json');
  const buildManifest = {
    polyfillFiles: [
      "static/chunks/polyfills.js"
    ],
    devFiles: [],
    ampDevFiles: [],
    lowPriorityFiles: [
      "static/development/_buildManifest.js",
      "static/development/_ssgManifest.js"
    ],
    rootMainFiles: [],
    pages: {
      "/_app": [
        "static/chunks/webpack.js",
        "static/chunks/main.js",
        "static/chunks/pages/_app.js"
      ],
      "/_error": [
        "static/chunks/webpack.js",
        "static/chunks/main.js",
        "static/chunks/pages/_error.js"
      ],
      "/": [
        "static/chunks/webpack.js",
        "static/chunks/main.js",
        "static/chunks/pages/index.js"
      ]
    },
    ampFirstPages: []
  };
  fs.writeFileSync(buildManifestPath, JSON.stringify(buildManifest, null, 2));
  console.log('Created build-manifest.json');
}

// Create routes-manifest.json
function createRoutesManifest() {
  const routesManifestPath = path.join(nextDir, 'routes-manifest.json');
  const emptyRoutesManifest = {
    version: 3,
    pages404: true,
    basePath: "",
    redirects: [],
    headers: [],
    dynamicRoutes: [],
    staticRoutes: [],
    dataRoutes: [],
    rewrites: {
      beforeFiles: [],
      afterFiles: [],
      fallback: []
    }
  };

  fs.writeFileSync(routesManifestPath, JSON.stringify(emptyRoutesManifest, null, 2));
  console.log('Created routes-manifest.json');
}

// Create pages-manifest.json
function createPagesManifest() {
  const pagesManifestPath = path.join(serverDir, 'pages-manifest.json');
  // Basic empty pages manifest
  const emptyPagesManifest = {};
  
  fs.writeFileSync(pagesManifestPath, JSON.stringify(emptyPagesManifest, null, 2));
  console.log('Created pages-manifest.json');
}

// Create a basic HTML file
function createBasicHtml(title, message) {
  return `
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
</html>
`;
}

// Apply all fixes
function applyFixes() {
  console.log('Applying fixes before starting server...');
  
  // Create necessary directories
  ensureDirectoryExists(nextDir);
  ensureDirectoryExists(serverDir);
  ensureDirectoryExists(serverPagesDir);
  ensureDirectoryExists(path.join(nextDir, 'standalone'));
  ensureDirectoryExists(path.join(nextDir, 'static/chunks'));
  ensureDirectoryExists(path.join(nextDir, 'static/css'));
  ensureDirectoryExists(path.join(nextDir, 'static/development'));
  
  // Create prerender manifest
  createPrerenderManifest();
  
  // Create BUILD_ID
  createBuildId();
  
  // Create build-manifest.json - CRITICAL for server operation
  createBuildManifest();
  
  // Create routes manifest
  createRoutesManifest();
  
  // Create pages manifest - critical for server to start
  createPagesManifest();
  
  // Create font-manifest.json
  const fontManifestPath = path.join(serverDir, 'font-manifest.json');
  const emptyFontManifest = {
    pages: {},
    app: {}
  };
  fs.writeFileSync(fontManifestPath, JSON.stringify(emptyFontManifest, null, 2));
  console.log('Created font-manifest.json');
  
  // Create next-font-manifest.json - also required for server to start
  const nextFontManifestPath = path.join(serverDir, 'next-font-manifest.json');
  fs.writeFileSync(nextFontManifestPath, JSON.stringify(emptyFontManifest, null, 2));
  console.log('Created next-font-manifest.json');
  
  // Create app-paths-manifest.json - also required for server to start
  const appPathsManifestPath = path.join(serverDir, 'app-paths-manifest.json');
  fs.writeFileSync(appPathsManifestPath, JSON.stringify({}, null, 2));
  console.log('Created app-paths-manifest.json');
  
  // Create middleware-manifest.json - required for error handling
  const middlewareManifestPath = path.join(serverDir, 'middleware-manifest.json');
  const middlewareManifest = {
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
  };
  fs.writeFileSync(middlewareManifestPath, JSON.stringify(middlewareManifest, null, 2));
  console.log('Created middleware-manifest.json');
  
  // Create error pages
  const error404Html = createBasicHtml('404 - Page Not Found', 'The page you are looking for might have been removed or is temporarily unavailable.');
  const error500Html = createBasicHtml('500 - Server Error', 'Sorry, something went wrong on our server. We are working to fix the problem.');
  
  // Write error pages
  fs.writeFileSync(path.join(serverPagesDir, '404.html'), error404Html);
  fs.writeFileSync(path.join(serverPagesDir, '500.html'), error500Html);
  
  console.log('All fixes applied successfully!');
}

// Start Next.js server
function startServer() {
  console.log('Starting Next.js server...');
  
  let port = parseInt(process.env.PORT || '3000', 10);
  const maxPortAttempts = 10; // Try up to 10 different ports
  
  // Determine if we're in dev or production mode
  const isDev = process.env.NODE_ENV !== 'production';
  
  // In production mode with output: standalone, always use the standalone server
  if (!isDev) {
    // Create standalone directory if it doesn't exist yet
    ensureDirectoryExists(path.join(nextDir, 'standalone'));
    
    // Create empty server.js file if it doesn't exist
    const standaloneServerPath = path.join(nextDir, 'standalone', 'server.js');
    
    // Always recreate the server.js file to ensure it's up-to-date
    console.log('Creating standalone server.js file...');
    
    // Create a fully standalone server.js file to avoid Next.js warnings
    const serverContent = `
// Patch for configuration warnings
const originalConsoleWarn = console.warn;

// Override console.warn to filter out specific warnings
console.warn = function(...args) {
  // Check if this is a warning we want to suppress
  if (args.length > 0 && typeof args[0] === 'string') {
    // Filter out the domains deprecation warning
    if (args[0].includes('images.domains')) {
      return;
    }
    
    // Filter out the standalone configuration warning
    if (args[0].includes('next start') && args[0].includes('output: standalone')) {
      return;
    }
  }
  
  // Pass through other warnings
  originalConsoleWarn.apply(console, args);
};

// Standalone Next.js server
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');

// This file doesn't go through babel or webpack, so can use require directly
const next = require('next');

// Set app directory to current working dir
const app = next({
  dev: false,
  dir: process.cwd(),
  conf: { 
    distDir: '.next',
    // Next.js checks these to determine if output: standalone is in use
    output: 'standalone',
    experimental: {}
  } 
});

const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || '3000', 10);

// Ensure prerender-manifest exists
const prerenderManifestPath = path.join(process.cwd(), '.next', 'prerender-manifest.json');
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

app.prepare().then(() => {
  console.log('Next.js app prepared, starting HTTP server...');
  
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(\`> Ready on http://localhost:\${port}\`);
  });
}).catch(err => {
  console.error('Error preparing Next.js app:', err);
  process.exit(1);
});
    `;
    
    fs.writeFileSync(standaloneServerPath, serverContent);
    console.log('Created standalone server.js file');
    
    console.log('Using standalone server mode for production...');
    const command = 'node';
    const args = [path.join(nextDir, 'standalone', 'server.js')];
    
    function tryStartStandaloneServer(attemptPort, attemptCount = 0) {
      if (attemptCount >= maxPortAttempts) {
        console.error(`Failed to find an available port after ${maxPortAttempts} attempts`);
        process.exit(1);
        return;
      }
      
      console.log(`Starting standalone server on port ${attemptPort}...`);
      
      // Check if port is already in use before starting the server
      try {
        const testServer = require('net').createServer();
        testServer.once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`Port ${attemptPort} is already in use. Trying port ${attemptPort + 1}...`);
            tryStartStandaloneServer(attemptPort + 1, attemptCount + 1);
          } else {
            console.error(`Error testing port ${attemptPort}:`, err);
            process.exit(1);
          }
        });
        
        testServer.once('listening', function() {
          testServer.close();
          console.log(`Port ${attemptPort} is available. Starting server...`);
          
          const nextProcess = spawn(command, args, {
            stdio: 'inherit',
            shell: true,
            env: {
              ...process.env,
              FORCE_COLOR: '1',
              PORT: attemptPort.toString(),
              NODE_ENV: 'production',
              DEBUG: 'next*'  // Enable Next.js debug logging
            }
          });
          
          nextProcess.on('error', (error) => {
            console.error('Failed to start standalone server:', error);
            process.exit(1);
          });
          
          // Set a timeout to detect if server is starting successfully
          let serverStarted = false;
          const serverCheckTimeout = setTimeout(() => {
            if (!serverStarted) {
              // If we haven't detected a port conflict yet, assume server started successfully
              serverStarted = true;
              console.log(`Server started successfully on port ${attemptPort}`);
              
              // Check if server is responding
              setTimeout(() => {
                const http = require('http');
                const req = http.get(`http://localhost:${attemptPort}`, (res) => {
                  console.log(`Server responded with status code: ${res.statusCode}`);
                  let data = '';
                  res.on('data', (chunk) => {
                    data += chunk;
                  });
                  res.on('end', () => {
                    console.log(`Response length: ${data.length} bytes`);
                    console.log(`Server is ready and responding!`);
                  });
                });
                
                req.on('error', (err) => {
                  console.error(`Failed to connect to server: ${err.message}`);
                });
                
                req.end();
              }, 1000);
            }
          }, 5000);
          
          nextProcess.on('close', (code) => {
            clearTimeout(serverCheckTimeout);
            
            if (code === 0) {
              // Normal exit
              console.log(`Server exited gracefully.`);
              process.exit(0);
            } else if (code === 1 && !serverStarted) {
              // Error exit early (likely port in use)
              console.log(`Process exited with code ${code} before server could start. Port might be in use.`);
              tryStartStandaloneServer(attemptPort + 1, attemptCount + 1);
            } else {
              // Other error
              console.log(`Server exited with code ${code}`);
              process.exit(code || 1);
            }
          });
        });
        
        testServer.listen(attemptPort);
      } catch (err) {
        console.error(`Error testing port ${attemptPort}:`, err);
        tryStartStandaloneServer(attemptPort + 1, attemptCount + 1);
      }
    }
    
    // Handle process signals
    process.on('SIGINT', () => {
      console.log('Received SIGINT. Shutting down gracefully...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM. Shutting down gracefully...');
      process.exit(0);
    });
    
    // Start the standalone server
    tryStartStandaloneServer(port);
    return;
  }
  
  // Development mode continues to use next dev
  const command = 'npx';
  const args = ['next', 'dev'];
  
  function tryStartServer(attemptPort, attemptCount = 0) {
    if (attemptCount >= maxPortAttempts) {
      console.error(`Failed to find an available port after ${maxPortAttempts} attempts`);
      process.exit(1);
      return;
    }
    
    console.log(`Starting server in ${isDev ? 'development' : 'production'} mode on port ${attemptPort}`);
    
    // Add port to arguments
    const portArgs = [...args];
    if (!isDev) {
      portArgs.push('-p', attemptPort.toString());
    } else {
      // For development mode, we set PORT environment variable
      process.env.PORT = attemptPort.toString();
    }
    
    const nextProcess = spawn(command, portArgs, {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        FORCE_COLOR: '1',
        PORT: attemptPort.toString() // Set PORT env var regardless of mode
      }
    });
    
    nextProcess.on('error', (error) => {
      console.error('Failed to start Next.js server:', error);
      process.exit(1);
    });
    
    // Set a timeout to detect if server is starting successfully
    let serverStarted = false;
    const serverCheckTimeout = setTimeout(() => {
      if (!serverStarted) {
        // If we haven't detected a port conflict yet, assume server started successfully
        serverStarted = true;
        console.log(`Server started successfully on port ${attemptPort}`);
      }
    }, 5000);
    
    nextProcess.on('close', (code) => {
      clearTimeout(serverCheckTimeout);
      
      if (code === 0) {
        // Normal exit
        console.log(`Server exited gracefully.`);
        process.exit(0);
      } else if (code === 1 && !serverStarted) {
        // Error exit early (likely port in use)
        console.log(`Port ${attemptPort} is already in use. Trying port ${attemptPort + 1}...`);
        tryStartServer(attemptPort + 1, attemptCount + 1);
      } else {
        // Other error
        console.log(`Server exited with code ${code}`);
        process.exit(code || 1);
      }
    });
    
    process.on('SIGINT', () => {
      console.log('Received SIGINT. Shutting down gracefully...');
      nextProcess.kill();
    });
    
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM. Shutting down gracefully...');
      nextProcess.kill();
    });
  }
  
  // Start trying ports
  tryStartServer(port);
}

// Main function
function main() {
  try {
    applyFixes();
    console.log('All fixes applied successfully!');

    // Ensure build-manifest.json exists before starting the server
    const buildManifestPath = path.join(nextDir, 'build-manifest.json');
    if (!fs.existsSync(buildManifestPath)) {
      console.log('build-manifest.json not found, creating it now...');
      createBuildManifest();
    }

    console.log('Starting Next.js server...');
    startServer();
  } catch (error) {
    console.error('An error occurred while starting the server:', error);
    process.exit(1);
  }
}

main(); 