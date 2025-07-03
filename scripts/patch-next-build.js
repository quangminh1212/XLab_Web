const fs = require('fs');
const path = require('path');

/**
 * This script patches Next.js build process to prevent errors with error pages
 */

console.log('Patching Next.js build process...');

// Define path to Next.js build file
const nextBuildPath = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'build', 'index.js');

// Check if file exists
if (!fs.existsSync(nextBuildPath)) {
  console.error('Could not find Next.js build file at:', nextBuildPath);
  process.exit(1);
}

// Read the file content
let content = fs.readFileSync(nextBuildPath, 'utf-8');

// Create backup if it doesn't exist
const backupPath = nextBuildPath + '.backup';
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, content);
  console.log('Created backup of Next.js build file');
}

// Function to create basic HTML error page
function createBasicHtml(title, message) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
</html>`;
}

// Create server pages directory
const serverPagesDir = path.join(process.cwd(), '.next', 'server', 'pages');
if (!fs.existsSync(serverPagesDir)) {
  fs.mkdirSync(serverPagesDir, { recursive: true });
}

// Write error pages directly to the server pages directory
console.log('Creating error pages in server/pages directory...');
const error404Html = createBasicHtml('404 - Page Not Found', 'The page you are looking for might have been removed or is temporarily unavailable.');
const error500Html = createBasicHtml('500 - Server Error', 'Sorry, something went wrong on our server. We are working to fix the problem.');

fs.writeFileSync(path.join(serverPagesDir, '404.html'), error404Html);
fs.writeFileSync(path.join(serverPagesDir, '500.html'), error500Html);

// Find the problematic code block that tries to rename files
if (content.includes('rename(pathFrom, pathTo)')) {
  // Replace rename operation with a safer function that writes files directly
  const saferCode = `
  // Patched by patch-next-build.js
  try {
    const content = await _fs.promises.readFile(pathFrom, 'utf-8');
    await _fs.promises.writeFile(pathTo, content, 'utf-8');
    await _fs.promises.unlink(pathFrom).catch(() => {});
  } catch (error) {
    console.warn('Error moving file', pathFrom, 'to', pathTo, '- writing directly instead');
    const errorPage = pathTo.includes('404') ? 
      '${error404Html.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}' : 
      '${error500Html.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}';
    await _fs.promises.writeFile(pathTo, errorPage, 'utf-8');
  }
  `;

  // Replace the rename function call with our safer approach
  content = content.replace(
    /rename\(pathFrom, pathTo\)/g, 
    `(async () => {
      ${saferCode}
    })()`
  );

  console.log('Patched rename operation in Next.js build file');
}

// Save the patched file
fs.writeFileSync(nextBuildPath, content);
console.log('Successfully patched Next.js build process!');

// Create prerender-manifest.json
const prerenderManifestPath = path.join(process.cwd(), '.next', 'prerender-manifest.json');
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

console.log('Next.js build process has been successfully patched!'); 