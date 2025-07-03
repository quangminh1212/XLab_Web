const fs = require('fs');
const path = require('path');

// Define the .next directory path
const nextDir = path.join(process.cwd(), '.next');
const prerenderManifestPath = path.join(nextDir, 'prerender-manifest.json');
const exportDir = path.join(nextDir, 'export');
const serverPagesDir = path.join(nextDir, 'server', 'pages');

// Basic empty prerender manifest content
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

// Create directories if they don't exist
function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Created directory: ${directoryPath}`);
  }
}

// Check if the .next directory exists
if (!fs.existsSync(nextDir)) {
  console.log('The .next directory does not exist. Please build the project first.');
  process.exit(1);
}

// Ensure export and server/pages directories exist
ensureDirectoryExists(exportDir);
ensureDirectoryExists(serverPagesDir);

// Create basic HTML content for error pages
const basic404Html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>404 - Page Not Found</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p>The page you are looking for does not exist.</p>
  <a href="/">Go Home</a>
</body>
</html>
`;

const basic500Html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>500 - Server Error</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>500 - Server Error</h1>
  <p>Something went wrong on our server.</p>
  <a href="/">Go Home</a>
</body>
</html>
`;

// Create error pages if they don't exist
const error404Path = path.join(serverPagesDir, '404.html');
const error500Path = path.join(serverPagesDir, '500.html');

if (!fs.existsSync(error404Path)) {
  fs.writeFileSync(error404Path, basic404Html);
  console.log('Created basic 404 page');
}

if (!fs.existsSync(error500Path)) {
  fs.writeFileSync(error500Path, basic500Html);
  console.log('Created basic 500 page');
}

// Create or overwrite the prerender-manifest.json file
try {
  fs.writeFileSync(prerenderManifestPath, JSON.stringify(emptyPrerenderManifest, null, 2));
  console.log('Successfully created prerender-manifest.json file.');
} catch (error) {
  console.error('Error creating prerender-manifest.json file:', error);
  process.exit(1);
}

console.log('Done!'); 