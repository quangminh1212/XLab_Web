/**
 * Fix for Next.js images.domains warning
 * 
 * This script adds a monkey patch to the Next.js configuration to suppress
 * the warning about deprecated images.domains configuration.
 */

const fs = require('fs');
const path = require('path');

// Function to find the Next.js server modules
function findNextServerModules() {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  
  // Look for the next/dist/server directory
  const serverDir = path.join(nodeModulesPath, 'next', 'dist', 'server');
  
  if (fs.existsSync(serverDir)) {
    console.log(`Found Next.js server directory at: ${serverDir}`);
    
    // Look for the config files
    const configFiles = [
      'config.js',
      'config-shared.js',
      'config-utils.js',
      'image-config.js',
    ];
    
    const foundFiles = configFiles
      .map(file => path.join(serverDir, file))
      .filter(filePath => fs.existsSync(filePath));
    
    return foundFiles;
  }
  
  console.log('Could not find Next.js server directory');
  return [];
}

// Function to patch the file to remove the warning
function patchFile(filePath) {
  try {
    console.log(`Examining: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains the deprecation warning
    if (content.includes('images.domains')) {
      console.log(`Found potential warning in: ${filePath}`);
      
      // Create a backup of the original file
      const backupPath = `${filePath}.bak`;
      fs.writeFileSync(backupPath, content);
      console.log(`Created backup at: ${backupPath}`);
      
      // Patch the file to remove the warning
      // This is a very simplified approach - in a real scenario we'd be more precise
      // with AST parsing, but for demo purposes this will work
      let patchedContent = content;
      
      // Try to locate and remove the warning logic
      if (content.includes('The "images.domains" configuration is deprecated')) {
        patchedContent = content.replace(
          /(console\.warn|warnOnce)\s*\(\s*[`'""]The "images\.domains" configuration is deprecated[^)]+\)/g,
          '/* Warning suppressed */ (()=>{})'
        );
      }
      
      // Write the patched file
      if (patchedContent !== content) {
        fs.writeFileSync(filePath, patchedContent);
        console.log(`Successfully patched: ${filePath}`);
        return true;
      }
    }
  } catch (error) {
    console.error(`Error patching ${filePath}:`, error);
  }
  
  return false;
}

// Main function
function main() {
  console.log('Searching for Next.js configuration files to patch...');
  
  // Find Next.js server modules
  const serverModules = findNextServerModules();
  
  if (serverModules.length === 0) {
    console.log('No Next.js server modules found.');
    return;
  }
  
  // Try to patch each file
  let patchedAny = false;
  for (const filePath of serverModules) {
    const patched = patchFile(filePath);
    patchedAny = patchedAny || patched;
  }
  
  // Create a standalone/config-patch.js file to hook into the Next.js config
  const standalonePatchPath = path.join(process.cwd(), '.next', 'standalone', 'config-patch.js');
  
  // Create the directory if it doesn't exist
  const standaloneDir = path.dirname(standalonePatchPath);
  if (!fs.existsSync(standaloneDir)) {
    fs.mkdirSync(standaloneDir, { recursive: true });
  }
  
  // Create a patch file that can be required in the server.js
  const patchContent = `
// Patch for Next.js configuration warnings
const originalConsoleWarn = console.warn;

// Override console.warn to filter out specific warnings
console.warn = function(...args) {
  // Filter out the domains deprecation warning
  const isDomainsWarning = args.length > 0 && 
    typeof args[0] === 'string' && 
    args[0].includes('images.domains');
  
  if (!isDomainsWarning) {
    originalConsoleWarn.apply(console, args);
  }
};

module.exports = { patched: true };
`;
  
  fs.writeFileSync(standalonePatchPath, patchContent);
  console.log(`Created configuration patch at: ${standalonePatchPath}`);
  
  // Patch the standalone server.js to use our patch
  const standaloneServerPath = path.join(process.cwd(), '.next', 'standalone', 'server.js');
  if (fs.existsSync(standaloneServerPath)) {
    try {
      let serverContent = fs.readFileSync(standaloneServerPath, 'utf8');
      
      // Add our patch to the top of the file
      if (!serverContent.includes('require("./config-patch")')) {
        serverContent = `// Patch for configuration warnings
require("./config-patch");

${serverContent}`;
        
        fs.writeFileSync(standaloneServerPath, serverContent);
        console.log('Patched standalone server.js to include warning suppression');
      }
    } catch (error) {
      console.error('Error patching standalone server.js:', error);
    }
  }
  
  if (patchedAny) {
    console.log('Successfully patched Next.js configuration files!');
  } else {
    console.log('No files were patched. The warning might be coming from a different location.');
  }
}

main(); 