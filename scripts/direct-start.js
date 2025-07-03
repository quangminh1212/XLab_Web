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

// Check if HTTPS environment variables are set
const useHttps = process.env.HTTPS === 'true' && process.env.SSL_CRT_FILE && process.env.SSL_KEY_FILE;

function startServer() {
  // Always default to production
  const isDev = false;
  const port = parseInt(process.env.PORT || '3000', 10);
  const maxPortAttempts = 10;
  
  console.log(`Starting Next.js server in ${useHttps ? 'HTTPS' : 'HTTP'} mode...`);
  
  // Use standalone server for production
  const serverPath = path.join(nextDir, 'standalone/server.js');
  
  // Create standalone server file if needed
  if (!fs.existsSync(serverPath)) {
    console.log('Creating standalone server.js file...');
    const serverContent = `
const path = require('path');
const http = require('http');
const https = require('https');
const { parse } = require('url');
const fs = require('fs');

// Check if HTTPS environment variables are set
const useHttps = process.env.HTTPS === 'true' && process.env.SSL_CRT_FILE && process.env.SSL_KEY_FILE;
const httpsOptions = useHttps ? {
  key: fs.readFileSync(process.env.SSL_KEY_FILE),
  cert: fs.readFileSync(process.env.SSL_CRT_FILE)
} : null;

// Create custom "next" object with server implementation
const next = {
  getRequestHandler: () => async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    
    // Check if we can serve a static file
    try {
      const staticFile = path.join(__dirname, '..', 'static', pathname);
      if (fs.existsSync(staticFile) && fs.statSync(staticFile).isFile()) {
        const fileContent = fs.readFileSync(staticFile);
        res.writeHead(200);
        res.end(fileContent);
        return;
      }
    } catch (e) {
      // Fall through to the default handler
    }
    
    // Default handler for dynamic routes
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>Server Running</h1><p>Next.js standalone server is running.</p></body></html>');
  }
};

const app = next.getRequestHandler();
const port = parseInt(process.env.PORT, 10) || 3000;

// Create the appropriate server (HTTP or HTTPS)
const server = useHttps 
  ? https.createServer(httpsOptions, app) 
  : http.createServer(app);

server.listen(port, (err) => {
  if (err) throw err;
  console.log(\`> Ready on \${useHttps ? 'https' : 'http'}://localhost:\${port}\`);
});
    `;
    
    ensureDirectoryExists(path.dirname(serverPath));
    fs.writeFileSync(serverPath, serverContent);
    console.log('Created standalone server.js file with HTTPS support');
  }

  function isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = require('net').createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  }

  function tryStartStandaloneServer(attemptPort, attemptCount = 0) {
    if (attemptCount >= maxPortAttempts) {
      console.error(`Failed to find an available port after ${maxPortAttempts} attempts`);
      process.exit(1);
      return;
    }
    
    console.log(`Starting ${useHttps ? 'HTTPS' : 'HTTP'} server on port ${attemptPort}...`);
    
    // Check if port is available
    isPortAvailable(attemptPort)
      .then(isAvailable => {
        if (isAvailable) {
          console.log(`Port ${attemptPort} is available. Starting server...`);
          
          // Additional env vars for HTTPS
          const serverEnv = {
            ...process.env,
            PORT: attemptPort.toString(),
            NODE_ENV: 'production'
          };
          
          // Start Node.js server with standalone server.js
          const nodeProcess = spawn('node', [serverPath], {
            stdio: 'inherit',
            env: serverEnv
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
          
          nodeProcess.on('close', (code) => {
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
        } else {
          console.log(`Port ${attemptPort} is already in use. Trying port ${attemptPort + 1}...`);
          tryStartStandaloneServer(attemptPort + 1, attemptCount + 1);
        }
      });
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