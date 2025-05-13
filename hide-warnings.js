// Script to hide Next.js warnings
console.log('Setting up environment to hide Next.js warnings...');

// Set environment variables to disable various warnings
process.env.NODE_OPTIONS = '--no-warnings';
process.env.NEXT_IGNORE_WARNINGS = 'NEXT_PACKAGE_WARNING,ESLINT_WARNING,API_ROUTE_IMPORT_WARNING';

console.log('Warning suppression configured successfully!'); 