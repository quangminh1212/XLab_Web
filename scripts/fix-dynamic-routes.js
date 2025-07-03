// Script to fix dynamic server usage in API routes
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all API route files
const apiRoutePattern = 'src/app/api/**/{route,page}.{js,ts,tsx}';
const apiRoutes = glob.sync(apiRoutePattern, { cwd: process.cwd() });

console.log(`Found ${apiRoutes.length} API route files to process...`);

// Add dynamic export to each file if it doesn't exist
let fixedCount = 0;
apiRoutes.forEach((routePath) => {
  const filePath = path.join(process.cwd(), routePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check if dynamic export already exists
  if (!content.includes('export const dynamic') && !content.includes('export var dynamic')) {
    // Add dynamic export after imports
    const updatedContent = content.replace(
      /((?:import[^;]+;[\r\n]+)*(?:\/\/[^\r\n]*[\r\n]+)*)/,
      '$1\n// Set this route to be dynamically rendered at request time\nexport const dynamic = "force-dynamic";\n\n'
    );

    fs.writeFileSync(filePath, updatedContent);
    fixedCount++;
    console.log(`Added dynamic export to: ${routePath}`);
  }
});

console.log(`Fixed ${fixedCount} API route files.`);

if (fixedCount === 0 && apiRoutes.length > 0) {
  console.log('All routes already had dynamic exports or no routes needed fixes.');
} else if (apiRoutes.length === 0) {
  console.log('No API route files found.');
}

console.log('Done!'); 