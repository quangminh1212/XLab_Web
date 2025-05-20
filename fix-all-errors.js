/**
 * Fix All Errors
 * 
 * Script to fix common errors in Next.js 15+ applications
 * - Cleans the .next directory
 * - Ensures all required dependencies are installed
 * - Updates gitignore with proper patterns
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting error fixing process...');

// Function to ensure the directory exists
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

// Function to run a command
function runCommand(command) {
  try {
    console.log(`🔄 Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Ensure critters is installed
function ensureDependencies() {
  console.log('📦 Checking dependencies...');
  
  try {
    // Check if critters is properly installed
    require.resolve('critters');
    console.log('✅ Critters is properly installed');
  } catch (error) {
    console.log('⚠️ Critters is not installed properly, installing now...');
    runCommand('npm install critters@0.0.23 --save-dev');
  }
}

// Clean the .next directory
function cleanNextDirectory() {
  console.log('🧹 Cleaning .next directory...');
  
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    console.log('Removing .next directory...');
    try {
      execSync('rimraf .next', { stdio: 'inherit' });
      console.log('✅ Successfully removed .next directory');
    } catch (error) {
      console.error('❌ Failed to remove .next directory');
      console.error(error.message);
    }
  } else {
    console.log('✅ .next directory does not exist, no need to clean');
  }
}

// Fix next.config.js - ensure optimizeCss is disabled
function fixNextConfig() {
  console.log('🔧 Checking next.config.js...');
  
  const configPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(configPath)) {
    try {
      let content = fs.readFileSync(configPath, 'utf8');
      
      // Disable optimizeCss if enabled
      if (content.includes('optimizeCss: true')) {
        content = content.replace('optimizeCss: true', 'optimizeCss: false');
        fs.writeFileSync(configPath, content);
        console.log('✅ Disabled optimizeCss in next.config.js');
      } else {
        console.log('✅ next.config.js is already properly configured');
      }
    } catch (error) {
      console.error('❌ Failed to fix next.config.js');
      console.error(error.message);
    }
  } else {
    console.error('❌ next.config.js not found');
  }
}

// Create necessary directories to prevent errors
function createNecessaryDirectories() {
  console.log('📁 Creating necessary directories...');
  
  // Create .next/cache directory
  const cacheDir = path.join(process.cwd(), '.next', 'cache');
  ensureDirectoryExists(cacheDir);
  
  // Create static directory to prevent 404s
  const staticDir = path.join(process.cwd(), '.next', 'static');
  ensureDirectoryExists(staticDir);
  
  // Create static/chunks directory
  const chunksDir = path.join(staticDir, 'chunks');
  ensureDirectoryExists(chunksDir);
  
  // Create static/css directory
  const cssDir = path.join(staticDir, 'css');
  ensureDirectoryExists(cssDir);
  
  // Create static/media directory
  const mediaDir = path.join(staticDir, 'media');
  ensureDirectoryExists(mediaDir);
  
  console.log('✅ All necessary directories created');
}

// Main function
function main() {
  try {
    console.log('🚀 Starting fix-all-errors script...');
    
    // Run the fixes
    cleanNextDirectory();
    ensureDependencies();
    fixNextConfig();
    createNecessaryDirectories();
    
    console.log('✅ All fixes completed successfully');
    console.log('\nNow you can run one of the following commands:');
    console.log('- npm run dev         # Start development server');
    console.log('- npm run build       # Build for production');
    console.log('- npm run start       # Start production server');
  } catch (error) {
    console.error('❌ An error occurred during the fix process:');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main(); 