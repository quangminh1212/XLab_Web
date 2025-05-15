/**
 * Script to update all product IDs based on their names
 * 
 * Run with: node utils/update-product-ids.js
 */

const fs = require('fs');
const path = require('path');

// Path to products data file
const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

// Function to generate ID from product name
function generateIdFromName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/[\s_-]+/g, '-')   // Replace spaces with hyphens
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
}

// Main function
async function updateProductIds() {
  console.log('🔍 Reading products file...');
  
  try {
    // Read products data
    const rawData = fs.readFileSync(productsFilePath, 'utf8');
    let products = JSON.parse(rawData);
    
    console.log(`📊 Found ${products.length} products`);
    
    // Track ID changes for reporting
    const idChanges = [];
    const newIds = new Map();
    
    // First pass: generate new IDs
    for (const product of products) {
      const oldId = product.id;
      const baseNewId = generateIdFromName(product.name);
      
      // Handle duplicate IDs
      let newId = baseNewId;
      let counter = 1;
      
      while (newIds.has(newId)) {
        newId = `${baseNewId}-${counter}`;
        counter++;
      }
      
      // Store the new ID
      newIds.set(newId, true);
      
      // Only track if ID changes
      if (oldId !== newId) {
        idChanges.push({ name: product.name, oldId, newId });
        product.id = newId;
      }
    }
    
    // Report changes
    if (idChanges.length > 0) {
      console.log('\n📝 ID changes:');
      for (const change of idChanges) {
        console.log(`  - "${change.name}": ${change.oldId} -> ${change.newId}`);
      }
      
      // Save updated products
      fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
      console.log(`\n✅ Updated ${idChanges.length} product IDs successfully`);
    } else {
      console.log('\n✅ All product IDs are already correctly formatted');
    }
    
  } catch (error) {
    console.error('❌ Error updating product IDs:', error);
    process.exit(1);
  }
}

// Run the script
updateProductIds().catch(console.error); 