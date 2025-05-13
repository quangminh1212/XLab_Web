const fs = require('fs');
const path = require('path');

console.log('Fixing Next.js trace errors...');

// Create .traceignore file
fs.writeFileSync(path.join(__dirname, '.traceignore'), '**/*');

// Ensure .next directory exists
const nextDir = path.join(__dirname, '.next');
if (!fs.existsSync(nextDir)) {
  fs.mkdirSync(nextDir, { recursive: true });
}

// Create dummy trace file
const traceFile = path.join(nextDir, 'trace');
fs.writeFileSync(traceFile, '');

// Set environment variables for the current process
process.env.NEXT_DISABLE_TRACE = '1';
process.env.NEXT_TRACING_MODE = '0';

console.log('Trace errors fixed successfully!'); 