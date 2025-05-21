const fs = require('fs');
const path = require('path');

// Path to products.json
const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

try {
  const content = fs.readFileSync(dataFilePath, 'utf8');
  // Remove literal newline characters to ensure valid JSON string literals
  const sanitized = content.replace(/[\r\n]+/g, ' ');
  fs.writeFileSync(dataFilePath, sanitized, 'utf8');
  console.log('Sanitized products.json by removing newline characters.');
} catch (error) {
  console.error('Error sanitizing products.json:', error);
  process.exit(1);
} 