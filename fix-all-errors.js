const fs = require('fs');
const path = require('path');

console.log('Starting Next.js error fixes...');

// Create necessary directories
const dirs = [
  '.next',
  '.next/server',
  '.next/static',
  '.next/cache',
  '.next/cache/webpack'
];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Create necessary manifest files
const manifestFiles = {
  '.next/server/pages-manifest.json': '{}',
  '.next/server/app-paths-manifest.json': '{}'
};

Object.entries(manifestFiles).forEach(([file, content]) => {
  const filePath = path.join(__dirname, file);
  console.log(`Creating/updating file: ${file}`);
  fs.writeFileSync(filePath, content);
});

// Create trace ignore file
fs.writeFileSync(path.join(__dirname, '.traceignore'), '**/*');

// Create dummy trace file
const traceFile = path.join(__dirname, '.next', 'trace');
fs.writeFileSync(traceFile, '');

console.log('All fixes applied successfully!'); 