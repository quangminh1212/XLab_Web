const fs = require('fs');
const path = require('path');

// Function to recursively search for files
function findFiles(dir, pattern, callback) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }
    
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
        findFiles(filePath, pattern, callback);
      } else if (pattern.test(file.name)) {
        fs.readFile(filePath, 'utf8', (err, content) => {
          if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
          }
          
          // Check for domains configuration
          if (content.includes('domains:') || content.includes('images.domains')) {
            callback(filePath, content);
          }
        });
      }
    }
  });
}

// Search for Next.js configuration with domains settings
console.log('Searching for images.domains configuration...');

findFiles(process.cwd(), /\.(js|jsx|ts|tsx|mjs|cjs)$/, (file, content) => {
  console.log(`Found potential domains config in: ${file}`);
  
  // Extract lines around the domains config
  const lines = content.split('\n');
  const matchingLineIdx = lines.findIndex(line => 
    line.includes('domains:') || line.includes('images.domains')
  );
  
  if (matchingLineIdx !== -1) {
    const startIdx = Math.max(0, matchingLineIdx - 5);
    const endIdx = Math.min(lines.length - 1, matchingLineIdx + 10);
    
    console.log('\nContext:');
    for (let i = startIdx; i <= endIdx; i++) {
      if (i === matchingLineIdx) {
        console.log(`> ${i+1}: ${lines[i]}`); // Highlight the matching line
      } else {
        console.log(`  ${i+1}: ${lines[i]}`);
      }
    }
    console.log('\n---\n');
  }
}); 