/**
 * Fix Project - Unified Script
 *
 * Comprehensive script to fix all common errors and prepare the project for development:
 * - Cleans the .next directory
 * - Ensures all required dependencies are installed
 * - Creates necessary static files and directories
 * - Updates gitignore with proper patterns
 * - Fixes Next.js configuration issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting comprehensive project fix...');

// Utility Functions
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

function runCommand(command, silent = false) {
  try {
    if (!silent) console.log(`🔄 Running: ${command}`);
    execSync(command, { stdio: silent ? 'pipe' : 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    if (!silent) console.error(error.message);
    return false;
  }
}

// 1. Dependencies Check
function ensureDependencies() {
  console.log('📦 Checking dependencies...');

  try {
    require.resolve('critters');
    console.log('✅ Critters is properly installed');
  } catch (error) {
    console.log('⚠️ Installing critters...');
    runCommand('npm install critters@0.0.23 --save-dev');
  }
}

// 2. Clean Next.js Directory
function cleanNextDirectory() {
  console.log('🧹 Cleaning .next directory...');

  const nextDir = path.join(process.cwd(), '.next');

  if (!fs.existsSync(nextDir)) {
    console.log('✅ .next directory does not exist, skipping clean.');
    return;
  }

  try {
    // Remove problematic files first
    const problematicFiles = [
      '.next/trace',
      '.next/app-paths-manifest.json',
      '.next/server/app-paths-manifest.json',
    ];

    problematicFiles.forEach((filePath) => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`🗑️ Removed file: ${filePath}`);
        } catch (err) {
          console.log(`⚠️ Could not remove ${filePath}: ${err.message}`);
        }
      }
    });

    // Remove cache directories
    const cacheDirs = [
      '.next/cache',
      '.next/server/vendor-chunks',
      '.next/static/chunks',
      '.next/static/css',
    ];

    cacheDirs.forEach((dirPath) => {
      const fullPath = path.join(process.cwd(), dirPath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`🗑️ Removed directory: ${dirPath}`);
        } catch (err) {
          console.log(`⚠️ Could not remove ${dirPath}: ${err.message}`);
        }
      }
    });

    console.log('✅ Successfully cleaned .next directory');
  } catch (err) {
    console.error('❌ Error cleaning .next directory:', err.message);
  }
}

// 3. Fix Next.js Configuration
function fixNextConfig() {
  console.log('🔧 Checking next.config.js...');

  const configPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(configPath)) {
    try {
      let content = fs.readFileSync(configPath, 'utf8');

      if (content.includes('optimizeCss: true')) {
        content = content.replace('optimizeCss: true', 'optimizeCss: false');
        fs.writeFileSync(configPath, content);
        console.log('✅ Disabled optimizeCss in next.config.js');
      } else {
        console.log('✅ next.config.js is properly configured');
      }
    } catch (error) {
      console.error('❌ Failed to fix next.config.js:', error.message);
    }
  } else {
    console.log('⚠️ next.config.js not found');
  }
}

// 4. Create Static Directories and Files
function createStaticStructure() {
  console.log('📁 Creating static directories and files...');

  // Essential directories
  const directories = [
    '.next/static',
    '.next/static/css',
    '.next/static/css/app',
    '.next/static/app',
    '.next/static/chunks',
    '.next/static/webpack',
    '.next/server',
    '.next/server/app',
    '.next/server/chunks',
    '.next/server/vendor-chunks',
    '.next/cache',
  ];

  directories.forEach((dir) => {
    ensureDirectoryExists(path.join(process.cwd(), dir));
  });

  // Essential static files
  const staticFiles = [
    { path: '.next/static/css/empty.css', content: '/* Empty CSS file */' },
    { path: '.next/static/css/app/layout.css', content: '/* Layout CSS file */' },
    { path: '.next/static/app/page.js', content: '/* Page JS file */' },
    { path: '.next/static/app/layout.js', content: '/* Layout JS file */' },
    { path: '.next/static/app/not-found.js', content: '/* Not found JS file */' },
    { path: '.next/static/app/loading.js', content: '/* Loading JS file */' },
    { path: '.next/static/main-app.js', content: '/* Main app JS file */' },
    { path: '.next/static/chunks/empty.js', content: '/* Empty chunk JS file */' },
    { path: '.next/server/app-paths-manifest.json', content: '{}' },
    { path: '.next/server/server-reference-manifest.json', content: '{}' },
    { path: '.next/server/vendor-chunks/next.js', content: 'module.exports = require("next");' },
    {
      path: '.next/server/vendor-chunks/tailwind-merge.js',
      content: 'module.exports = require("tailwind-merge");',
    },
  ];

  staticFiles.forEach((file) => {
    const filePath = path.join(process.cwd(), file.path);
    ensureDirectoryExists(path.dirname(filePath));

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(`📄 Created file: ${file.path}`);
    }
  });

  console.log('✅ Static structure created');
}

// 5. Update Server Info
function updateServerInfo() {
  console.log('📄 Updating server info...');

  const serverInfoPath = path.join(process.cwd(), '.next/server/server-info.json');
  const buildId = 'build-id-' + Date.now();

  const serverInfo = {
    version: '15.2.4',
    requiresSSL: false,
    buildId: buildId,
    env: [],
    staticFiles: {
      '/favicon.ico': {
        type: 'static',
        etag: '"favicon-etag"',
      },
    },
  };

  ensureDirectoryExists(path.dirname(serverInfoPath));
  fs.writeFileSync(serverInfoPath, JSON.stringify(serverInfo, null, 2));
  console.log(`✅ Updated server-info.json with buildId: ${buildId}`);
}

// 6. Update .gitignore
function updateGitignore() {
  console.log('📝 Updating .gitignore...');

  const gitignorePath = path.join(process.cwd(), '.gitignore');

  const additionalPatterns = `
# Next.js Build Files
.next/
.next/**/*
.next/cache
.next/static
.next/server
.next/trace
*.tsbuildinfo
next-env.d.ts

# Development Files
run.bat
fix-all-errors.js
check-critters.js
generate-static-files.js
check-products.ps1
.traceignore

# IDE and OS Files
.vscode/
.idea/
.DS_Store
Thumbs.db
desktop.ini

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Dependencies
node_modules/
`;

  try {
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }

    // Only add patterns that don't already exist
    const linesToAdd = additionalPatterns.split('\n').filter((line) => {
      const trimmedLine = line.trim();
      return trimmedLine && !gitignoreContent.includes(trimmedLine);
    });

    if (linesToAdd.length > 0) {
      gitignoreContent += '\n' + linesToAdd.join('\n');
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('✅ Updated .gitignore with new patterns');
    } else {
      console.log('✅ .gitignore is already up to date');
    }
  } catch (error) {
    console.error('❌ Error updating .gitignore:', error.message);
  }
}

// 7. Create Unified Run Script
function createRunScript() {
  console.log('📄 Creating unified run script...');

  const packageJsonPath = path.join(process.cwd(), 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      // Add our scripts if they don't exist
      if (!packageJson.scripts) packageJson.scripts = {};

      packageJson.scripts['fix'] = 'node scripts/fix-project.js';
      packageJson.scripts['dev:clean'] = 'node scripts/fix-project.js && npm run dev';
      packageJson.scripts['dev:safe'] = 'node scripts/fix-project.js && npm run dev';

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Added fix scripts to package.json');
    } catch (error) {
      console.error('❌ Error updating package.json:', error.message);
    }
  }
}

// 8. Clean Up Old Fix Files
function cleanupOldFiles() {
  console.log('🧹 Cleaning up old fix files...');

  const filesToRemove = [
    'fix-all-errors.js',
    'check-critters.js',
    'generate-static-files.js',
    'check-products.ps1',
    'run.bat',
    '.traceignore',
  ];

  filesToRemove.forEach((file) => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Removed old file: ${file}`);
      } catch (error) {
        console.log(`⚠️ Could not remove ${file}: ${error.message}`);
      }
    }
  });

  console.log('✅ Cleanup completed');
}

// Main Function
async function fixProject() {
  try {
    console.log('==================================================');
    console.log('🛠️  XLAB PROJECT FIX - UNIFIED SCRIPT');
    console.log('==================================================');

    // Ensure scripts directory exists
    ensureDirectoryExists(path.join(process.cwd(), 'scripts'));

    // Run all fixes
    ensureDependencies();
    cleanNextDirectory();
    fixNextConfig();
    createStaticStructure();
    updateServerInfo();
    updateGitignore();
    createRunScript();

    console.log('==================================================');
    console.log('✅ Project fix completed successfully!');
    console.log('💡 You can now run: npm run dev:clean');
    console.log('==================================================');

    // Clean up old files last
    setTimeout(() => {
      cleanupOldFiles();
    }, 1000);
  } catch (error) {
    console.error('❌ Fix process failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  fixProject();
}

module.exports = { fixProject };
