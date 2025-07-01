const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to prepare the application for Vercel deployment
 * With improved error handling and package installation fixes
 */

console.log('🔧 Preparing environment for Vercel deployment...');

try {
  // Create necessary directories
  const requiredDirs = [
    '.next/cache/webpack',
    '.next/server/chunks',
    '.next/static/chunks',
    '.next/static/css',
  ];

  requiredDirs.forEach((dir) => {
    const fullPath = path.join(process.cwd(), dir);
    try {
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created directory: ${fullPath}`);
      }
    } catch (err) {
      console.log(`⚠️ Could not create directory ${fullPath}: ${err.message}`);
      // Non-blocking - continue with other directories
    }
  });

  // Check for .env file
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    try {
      fs.writeFileSync(envPath, 'NODE_ENV=production\n');
      console.log('✅ Created basic .env file');
    } catch (err) {
      console.log(`⚠️ Could not create .env file: ${err.message}`);
    }
  }

  // Verify key dependencies
  try {
    console.log('📦 Installing critical dependencies if missing...');
    
    // Check if next is installed
    try {
      execSync('npm list next --depth=0', { stdio: 'ignore' });
    } catch (e) {
      console.log('⚠️ Next.js not installed properly, installing specific version...');
      execSync('npm install next@15.2.4 --no-save --no-package-lock', { stdio: 'inherit' });
    }
    
    // Ensure json5 is installed
    try {
      execSync('npm list json5 --depth=0', { stdio: 'ignore' });
    } catch (e) {
      console.log('⚠️ json5 not installed properly, installing specific version...');
      execSync('npm install json5@2.2.3 --no-save --no-package-lock', { stdio: 'inherit' });
    }
  } catch (error) {
    console.log('⚠️ Error checking dependencies:', error.message);
    // Continue with the build process
  }

  console.log('✅ Vercel environment preparation completed successfully');
} catch (error) {
  // Log error but don't fail the build
  console.error('⚠️ Error during Vercel setup:', error.message);
  console.log('Continuing with build process...');
} 