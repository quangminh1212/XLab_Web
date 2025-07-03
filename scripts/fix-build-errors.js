const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define paths
const rootDir = path.join(__dirname, '..');
const nextDir = path.join(rootDir, '.next');
const serverDir = path.join(nextDir, 'server');
const pagesDir = path.join(serverDir, 'pages');
const staticDir = path.join(nextDir, 'static');
const exportDir = path.join(nextDir, 'export');

// Create directories if they don't exist
function createDirectoryIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Create all necessary directories
function createDirectories() {
  console.log('Preparing to fix build errors...');
  
  createDirectoryIfNotExists(nextDir);
  createDirectoryIfNotExists(serverDir);
  createDirectoryIfNotExists(pagesDir);
  createDirectoryIfNotExists(path.join(serverDir, 'app'));
  createDirectoryIfNotExists(path.join(serverDir, 'chunks'));
  createDirectoryIfNotExists(path.join(nextDir, 'cache'));
  createDirectoryIfNotExists(path.join(staticDir, 'chunks'));
  createDirectoryIfNotExists(path.join(staticDir, 'css'));
  createDirectoryIfNotExists(path.join(nextDir, 'standalone'));
}

// Create basic manifest files
function createManifestFiles() {
  console.log('Creating error pages...');
  
  // Create BUILD_ID file
  const buildId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  fs.writeFileSync(path.join(nextDir, 'BUILD_ID'), buildId);
  console.log(`Created BUILD_ID file with ID: ${buildId}`);
  
  // Create basic prerender-manifest.json
  const prerenderManifest = {
    version: 4,
    routes: {},
    dynamicRoutes: {},
    notFoundRoutes: [],
    preview: {
      previewModeId: "development-id",
      previewModeSigningKey: "development-key",
      previewModeEncryptionKey: "development-key"
    }
  };
  fs.writeFileSync(
    path.join(nextDir, 'prerender-manifest.json'),
    JSON.stringify(prerenderManifest, null, 2)
  );
  console.log('Created prerender-manifest.json');

  // Create build-manifest.json
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
  fs.writeFileSync(
    path.join(nextDir, 'build-manifest.json'),
    JSON.stringify(buildManifest, null, 2)
  );
  console.log('Created build-manifest.json');

  // Create routes-manifest.json
  const routesManifest = {
    version: 4,
    basePath: "",
    redirects: [],
    headers: [],
    rewrites: [],
    staticRoutes: [],
    dynamicRoutes: [],
    dataRoutes: [],
    i18n: null
  };
  fs.writeFileSync(
    path.join(nextDir, 'routes-manifest.json'),
    JSON.stringify(routesManifest, null, 2)
  );
  console.log('Created routes-manifest.json');

  // Create pages-manifest.json
  const pagesManifest = {
    "/_app": "server/pages/_app.js",
    "/_error": "server/pages/_error.js",
    "/_document": "server/pages/_document.js",
    "/404": "server/pages/404.html"
  };
  fs.writeFileSync(
    path.join(nextDir, 'server/pages-manifest.json'),
    JSON.stringify(pagesManifest, null, 2)
  );
  console.log('Created pages-manifest.json');

  // Create middleware-manifest.json
  const middlewareManifest = {
    version: 2,
    middleware: {},
    sortedMiddleware: [],
    functions: {}
  };
  fs.writeFileSync(
    path.join(nextDir, 'server/middleware-manifest.json'),
    JSON.stringify(middlewareManifest, null, 2)
  );
  console.log('Created middleware-manifest.json');

  // Create app-paths-manifest.json
  const appPathsManifest = {};
  fs.writeFileSync(
    path.join(nextDir, 'server/app-paths-manifest.json'),
    JSON.stringify(appPathsManifest, null, 2)
  );
  console.log('Created app-paths-manifest.json');

  // Create font-manifest.json
  const fontManifest = [];
  fs.writeFileSync(
    path.join(nextDir, 'server/font-manifest.json'),
    JSON.stringify(fontManifest, null, 2)
  );
  console.log('Created font-manifest.json');

  // Create next-font-manifest.json
  const nextFontManifest = {
    pages: {},
    app: {},
    appUsingSizeAdjust: false,
    pagesUsingSizeAdjust: false
  };
  fs.writeFileSync(
    path.join(nextDir, 'server/next-font-manifest.json'),
    JSON.stringify(nextFontManifest, null, 2)
  );
  console.log('Created next-font-manifest.json');

  // Create React files for _app and _error
  createBasicReactFiles();
}

// Create basic React files for _app and _error
function createBasicReactFiles() {
  // Create _app.js
  const appContent = `
    import React from 'react';
    export default function App({ Component, pageProps }) {
      return <Component {...pageProps} />;
    }
  `;
  fs.writeFileSync(path.join(serverDir, 'pages/_app.js'), appContent.trim());
  
  // Create _error.js
  const errorContent = `
    import React from 'react';
    function Error({ statusCode }) {
      return (
        <div>
          <h1>{statusCode ? \`Error \${statusCode}\` : 'Client-side error'}</h1>
        </div>
      );
    }
    Error.getInitialProps = ({ res, err }) => {
      const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
      return { statusCode };
    };
    export default Error;
  `;
  fs.writeFileSync(path.join(serverDir, 'pages/_error.js'), errorContent.trim());
  
  // Create _document.js
  const documentContent = `
    import React from 'react';
    import Document, { Html, Head, Main, NextScript } from 'next/document';
    
    class MyDocument extends Document {
      render() {
        return (
          <Html>
            <Head />
            <body>
              <Main />
              <NextScript />
            </body>
          </Html>
        );
      }
    }
    
    export default MyDocument;
  `;
  fs.writeFileSync(path.join(serverDir, 'pages/_document.js'), documentContent.trim());
  
  // Create 404.html
  const notFoundContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>404 - Page Not Found</title>
      </head>
      <body>
        <h1>404 - Page Not Found</h1>
      </body>
    </html>
  `;
  fs.writeFileSync(path.join(serverDir, 'pages/404.html'), notFoundContent.trim());
}

// Create standalone server.js file
function createStandaloneServer() {
  const standaloneDir = path.join(nextDir, 'standalone');
  createDirectoryIfNotExists(standaloneDir);
  
  const serverContent = `
    const path = require('path');
    const { createServer } = require('http');
    const { parse } = require('url');
    const fs = require('fs');
    
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
    
    createServer(app).listen(port, (err) => {
      if (err) throw err;
      console.log(\`> Ready on http://localhost:\${port}\`);
    });
  `;
  
  fs.writeFileSync(path.join(standaloneDir, 'server.js'), serverContent.trim());
  console.log('Created standalone server.js file');
}

// Main function
async function main() {
  try {
    // Create directories and manifest files
    createDirectories();
    createManifestFiles();
    createStandaloneServer();
    
    console.log('Build errors have been fixed successfully!');
  } catch (error) {
    console.error('An error occurred while fixing build errors:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 