const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Fixing export error issues...');

// Define directories and files
const nextDir = path.join(process.cwd(), '.next');
const exportDir = path.join(nextDir, 'export');
const serverPagesDir = path.join(nextDir, 'server', 'pages');

// Create directories if they don't exist
function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Created directory: ${directoryPath}`);
  }
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

// Create all necessary directories
ensureDirectoryExists(serverPagesDir);
ensureDirectoryExists(exportDir);

// Write the error pages directly to both locations
console.log('Creating error pages in multiple locations...');
const error404Html = createBasicHtml('404 - Page Not Found', 'The page you are looking for might have been removed or is temporarily unavailable.');
const error500Html = createBasicHtml('500 - Server Error', 'Sorry, something went wrong on our server. We are working to fix the problem.');

// Write to server/pages directory
fs.writeFileSync(path.join(serverPagesDir, '404.html'), error404Html);
fs.writeFileSync(path.join(serverPagesDir, '500.html'), error500Html);

// Write to export directory 
fs.writeFileSync(path.join(exportDir, '404.html'), error404Html);
fs.writeFileSync(path.join(exportDir, '500.html'), error500Html);

// Create a minimal _error.js
const errorJs = `
export default function Error() {
  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Error</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
        An error occurred. Please try again later.
      </p>
      <a 
        href="/" 
        style={{ 
          display: 'inline-block', 
          background: '#2563eb', 
          color: 'white', 
          padding: '0.7rem 1.5rem', 
          borderRadius: '4px', 
          textDecoration: 'none'
        }}
      >
        Go to Homepage
      </a>
    </div>
  );
}
`;

fs.writeFileSync(path.join(serverPagesDir, '_error.js'), errorJs);

// Create prerender-manifest.json
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

// Create a .nojekyll file to bypass GitHub Pages Jekyll processing if using GitHub Pages
fs.writeFileSync(path.join(nextDir, '.nojekyll'), '');

console.log('Export error fix completed successfully!');

// Create hook for post-build process
const hookScriptPath = path.join(process.cwd(), 'scripts', 'post-build.js');
const hookScript = `
const fs = require('fs');
const path = require('path');

console.log('Running post-build fixes...');

// Define directories
const nextDir = path.join(process.cwd(), '.next');
const exportDir = path.join(nextDir, 'export');
const serverPagesDir = path.join(nextDir, 'server', 'pages');

// Ensure directories exist
if (!fs.existsSync(serverPagesDir)) {
  fs.mkdirSync(serverPagesDir, { recursive: true });
}
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

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

// Copy error pages if needed
const error404ExportPath = path.join(exportDir, '404.html');
const error500ExportPath = path.join(exportDir, '500.html');
const error404ServerPath = path.join(serverPagesDir, '404.html');
const error500ServerPath = path.join(serverPagesDir, '500.html');

// Helper function to create a basic error page
function createBasicHtml(title, message) {
  return \`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>\${title}</title>
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
    <h1>\${title}</h1>
    <p>\${message}</p>
    <a href="/" class="btn">Go to Homepage</a>
  </div>
</body>
</html>
\`;
}

// Create 404 page content
const error404Html = createBasicHtml('404 - Page Not Found', 'The page you are looking for might have been removed or is temporarily unavailable.');

// Create 500 page content
const error500Html = createBasicHtml('500 - Server Error', 'Sorry, something went wrong on our server. We are working to fix the problem.');

// Always ensure the server pages directory has the error pages
fs.writeFileSync(error404ServerPath, error404Html);
fs.writeFileSync(error500ServerPath, error500Html);

// Create error pages in export directory
fs.writeFileSync(error404ExportPath, error404Html);
fs.writeFileSync(error500ExportPath, error500Html);

console.log('Post-build fixes completed successfully!');
`;

fs.writeFileSync(hookScriptPath, hookScript);
console.log(`Created post-build hook script at ${hookScriptPath}`);

console.log('All error fixes applied successfully!'); 