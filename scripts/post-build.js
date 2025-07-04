
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
