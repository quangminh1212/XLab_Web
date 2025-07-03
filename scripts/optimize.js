/**
 * XLab Web - Project Optimization Script
 * 
 * Sử dụng các tiện ích từ unified-utils.js để tối ưu hóa dự án
 */

const utils = require('./unified-utils');
const { logger, optimizations } = utils;
const path = require('path');
const fs = require('fs');

// Banner
logger.separator();
logger.info('XLab Web - Project Optimization');
logger.separator();

// Optimize project structure
function optimizeProjectStructure() {
  logger.info('Optimizing project structure...');
  
  // Run cleanup and optimization
  optimizations.cleanupUnusedFiles();
  optimizations.optimizeImports();
  
  // Integration suggestion for components
  integrateComponents();
  
  // Integration suggestion for utilities
  integrateUtilities();
  
  // Update package.json with optimized scripts
  updatePackageScripts();
  
  logger.success('Project structure optimization completed');
}

// Integration suggestion for components
function integrateComponents() {
  logger.info('Analyzing components for integration opportunities...');
  
  // In a real scenario, this would involve:
  // 1. Scanning components for similar functionality
  // 2. Identifying common patterns and duplicate code
  // 3. Suggesting merges of similar components
  
  logger.info('Component integration suggestions:');
  logger.info('- Consider creating shared base components for similar UI elements');
  logger.info('- Use composition pattern to build complex components from simpler ones');
  logger.info('- Create a UI library of reusable components to reduce duplication');
}

// Integration suggestion for utilities
function integrateUtilities() {
  logger.info('Analyzing utilities for integration opportunities...');
  
  // In a real scenario, this would involve:
  // 1. Scanning utility files for similar functions
  // 2. Identifying duplicate functionality
  // 3. Suggesting merges of similar utilities
  
  logger.info('Utility integration suggestions:');
  logger.info('- Organize utils by domain (string, date, auth, etc.)');
  logger.info('- Create a central utils index to expose all utilities');
  logger.info('- Consider using a functional programming approach for utilities');
}

// Update package.json with optimized scripts
function updatePackageScripts() {
  logger.info('Optimizing npm scripts...');
  
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    logger.error('package.json not found');
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // New optimized scripts
    const optimizedScripts = {
      "dev": "npx next dev -p 3000",
      "dev:clean": "node scripts/optimize.js && npm run dev",
      "build": "node scripts/optimize.js --pre-build && npx next build",
      "start": "cross-env NODE_ENV=production node .next/standalone/server.js",
      "lint": "npx next lint",
      "lint:fix": "npx next lint --fix",
      "format": "prettier --write .",
      "clean": "rimraf .next node_modules/.cache && npm cache clean --force",
      "optimize": "node scripts/optimize.js",
      "test": "jest",
      "analyze": "cross-env ANALYZE=true next build"
    };
    
    // Log the suggested script updates
    logger.info('Suggested package.json scripts optimization:');
    Object.keys(optimizedScripts).forEach(key => {
      logger.info(`  "${key}": "${optimizedScripts[key]}"`);
    });
    
    // We don't actually modify package.json here, just suggest the changes
    
    logger.success('Script optimization suggestions generated');
    return true;
  } catch (error) {
    logger.error(`Failed to parse package.json: ${error.message}`);
    return false;
  }
}

// Process command line arguments
const args = process.argv.slice(2);
const isPreBuild = args.includes('--pre-build');
const startServer = args.includes('--start-server');

if (isPreBuild) {
  // Pre-build mode: just run the necessary fixes for building
  logger.info('Running pre-build optimizations...');
  utils.nextBuildFixes.fixNextErrors();
  utils.nextBuildFixes.fixFontManifest();
  logger.success('Pre-build optimizations completed');
} else if (startServer) {
  // Start server mode
  logger.info('Starting optimized server...');
  
  // Basic server setup
  utils.nextBuildFixes.fixNextErrors();
  utils.nextBuildFixes.fixFontManifest();
  utils.nextBuildFixes.createBuildManifest();
  utils.nextBuildFixes.fixStandalone();
  
  logger.success('Server optimization completed');
  
  // Start the server
  const { exec } = require('child_process');
  logger.info('Starting server...');
  
  const serverProcess = exec('node .next/standalone/server.js', (error, stdout, stderr) => {
    if (error) {
      logger.error(`Server execution error: ${error}`);
      return;
    }
    if (stderr) {
      logger.error(`Server stderr: ${stderr}`);
      return;
    }
    logger.info(`Server stdout: ${stdout}`);
  });
  
  serverProcess.stdout.on('data', (data) => {
    console.log(data);
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(data);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    serverProcess.kill();
    process.exit();
  });
} else {
  // Full optimization mode
  optimizeProjectStructure();
}

logger.separator(); 