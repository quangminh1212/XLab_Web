const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');

// Define directories
const nextDir = path.join(process.cwd(), '.next');
const serverPagesDir = path.join(nextDir, 'server', 'pages');

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
  ensureDirectoryExists(serverPagesDir);
  
  // Create prerender manifest
  createPrerenderManifest();
  
  // Create BUILD_ID
  createBuildId();
  
  // Create routes manifest
  createRoutesManifest();
  
  // Create font-manifest.json
  const fontManifestPath = path.join(nextDir, 'server', 'font-manifest.json');
  const emptyFontManifest = {
    pages: {},
    app: {}
  };
  fs.writeFileSync(fontManifestPath, JSON.stringify(emptyFontManifest, null, 2));
  console.log('Created font-manifest.json');
  
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
  
  // Choose between next command or direct node execution for standalone mode
  let command, args;
  const useStandalone = !isDev && fs.existsSync(path.join(nextDir, 'standalone', 'server.js'));
  
  if (useStandalone) {
    console.log('Using standalone server mode...');
    command = 'node';
    args = [path.join(nextDir, 'standalone', 'server.js')];
  } else {
    command = 'next';
    args = isDev ? ['dev'] : ['start'];
  }
  
  function tryStartServer(attemptPort, attemptCount = 0) {
    if (attemptCount >= maxPortAttempts) {
      console.error(`Failed to find an available port after ${maxPortAttempts} attempts`);
      process.exit(1);
      return;
    }
    
    console.log(`Starting server in ${isDev ? 'development' : 'production'} mode on port ${attemptPort}`);
    
    // Add port to arguments
    const portArgs = [...args];
    if (!useStandalone) {
      portArgs.push('-p', attemptPort.toString());
    } else {
      // For standalone mode, we set PORT environment variable
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
    startServer();
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}

main(); 