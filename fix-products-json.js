const fs = require('fs');
const path = require('path');

// Function to generate ID from product name
function generateIdFromName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/[\s_-]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
}

// Path to the products JSON file
const filePath = path.join(process.cwd(), 'src/data/products.json');

console.log('Reading products file...');
try {
  // First read the file as raw text to diagnose syntax issues
  const rawData = fs.readFileSync(filePath, 'utf8');
  
  console.log('Attempting to fix JSON syntax issues...');
  
  // Try to identify and fix JSON syntax errors
  let fixedData = rawData;
  try {
    // Use a trick to find any JSON parsing errors
    JSON.parse(rawData);
    console.log('No JSON syntax errors found in the file');
  } catch (parseError) {
    console.error('JSON syntax error found:', parseError.message);
    
    // Get the position of the error
    const errorPosition = parseError.message.match(/position (\d+)/);
    if (errorPosition && errorPosition[1]) {
      const pos = parseInt(errorPosition[1]);
      const context = rawData.substring(Math.max(0, pos - 30), pos + 30);
      console.log('Error context:', context);

      // Common JSON syntax error fixes
      let fixedData = rawData;
      // Fix missing commas between properties
      fixedData = fixedData.replace(/}\s*"/g, '},"');
      // Fix extra commas before closing brackets
      fixedData = fixedData.replace(/,\s*}/g, '}');
      // Fix extra commas before closing arrays
      fixedData = fixedData.replace(/,\s*]/g, ']');
      
      try {
        // Verify the fixes worked
        JSON.parse(fixedData);
        console.log('Successfully fixed JSON syntax issues');
        rawData = fixedData;
      } catch (newError) {
        console.error('Could not automatically fix JSON:', newError.message);
        process.exit(1);
      }
    }
  }
  
  // Now parse the data as JSON
  const products = JSON.parse(rawData);
  
  console.log(`Loaded ${products.length} products`);
  
  // Update each product ID based on its name
  const updatedProducts = products.map(product => {
    const oldId = product.id;
    const newId = generateIdFromName(product.name);
    console.log(`Updating product: "${product.name}"`);
    console.log(`  Old ID: ${oldId}`);
    console.log(`  New ID: ${newId}`);
    
    return {
      ...product,
      id: newId
    };
  });
  
  // Save the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2), 'utf8');
  console.log('Products file updated successfully with new IDs based on product names');
  
} catch (error) {
  console.error('Error processing the products file:', error);
  process.exit(1);
} 