/**
 * Script to update .gitignore with patterns for files generated during development
 */

const fs = require('fs');
const path = require('path');

// Path to the .gitignore file
const gitignorePath = path.join(__dirname, '.gitignore');

// Read existing .gitignore content
let gitignoreContent = '';
try {
  gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
} catch (error) {
  console.error('Error reading .gitignore file:', error);
  process.exit(1);
}

// Define patterns to ignore
const ignorePatterns = [
  '# Next.js runtime files',
  '/.next/',
  '/.next/cache/',
  '/.next/static/webpack/',
  '/.next/static/chunks/',
  '/.next/static/development/',
  '/.next/static/css/',
  '/.next/server/pages/',
  '/.next/server/chunks/',
  '/.next/server/vendor-chunks/',
  '/.next/server/*.json',
  '/.next/build-manifest.json',
  '/.next/app-paths-manifest.json',
  '/.next/next-font-manifest.json',
  '/.next/middleware-manifest.json',
  '/.next/trace',
  '**/*.hot-update.js',
  '**/*.hot-update.json',
  '/node_modules/.cache/',
  '/.swc/',
  '/.turbo/',
];

// Normalize existing content by removing duplicates
const existingLines = gitignoreContent.split('\n');
const uniqueLines = new Set(existingLines);

// Check if patterns already exist
const newPatterns = ignorePatterns.filter(pattern => !uniqueLines.has(pattern));

if (newPatterns.length === 0) {
  console.log('All required patterns already exist in .gitignore');
  process.exit(0);
}

// Add new patterns
const updatedContent = gitignoreContent.trim() + '\n\n# Added by update-gitignore.js\n' + newPatterns.join('\n');

// Write updated content back to .gitignore
try {
  fs.writeFileSync(gitignorePath, updatedContent);
  console.log(`Successfully added ${newPatterns.length} new patterns to .gitignore`);
} catch (error) {
  console.error('Error updating .gitignore file:', error);
  process.exit(1);
} 