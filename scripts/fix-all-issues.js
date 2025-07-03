const { execSync } = require('child_process');
const path = require('path');

console.log('='.repeat(50));
console.log('XLab Web - Fix All Issues');
console.log('='.repeat(50));

// Run fixes in order
try {
  console.log('\n1. Clean cache and build directories');
  execSync('npx rimraf .next node_modules/.cache', { stdio: 'inherit' });

  console.log('\n2. Fix dynamic routes');
  execSync('node scripts/fix-dynamic-routes.js', { stdio: 'inherit' });

  console.log('\n3. Fix Next.js errors');
  execSync('node scripts/fix-next-errors.js', { stdio: 'inherit' });

  console.log('\n4. Fix security issues');
  if (require('fs').existsSync(path.join(process.cwd(), 'scripts/fix-security-issues.js'))) {
    execSync('node scripts/fix-security-issues.js', { stdio: 'inherit' });
  } else {
    console.log('Security fix script not found, skipping');
  }

  // Build the application
  console.log('\n5. Building the application');
  execSync('next build', { stdio: 'inherit' });

  // Fix prerender manifest
  console.log('\n6. Fix prerender manifest');
  execSync('node scripts/fix-prerender-manifest.js', { stdio: 'inherit' });

  console.log('\n='.repeat(50));
  console.log('All fixes completed successfully!');
  console.log('='.repeat(50));
} catch (error) {
  console.error('\nAn error occurred while fixing issues:');
  console.error(error.message);
  process.exit(1);
} 