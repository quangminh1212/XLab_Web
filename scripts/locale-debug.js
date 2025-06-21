#!/usr/bin/env node

/**
 * Locale Debugging Setup Script
 * 
 * This script configures the debugging level for the locale system in the XLab Web application.
 * It modifies environment variables during development to control the verbosity of locale debugging.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Debug levels matching the TypeScript enum
const DEBUG_LEVELS = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  VERBOSE: 4
};

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Display the main menu
 */
function showMenu() {
  console.log('\n=== XLab Web Localization Debug Tool ===');
  console.log('\n1. Set debug level');
  console.log('2. Generate missing translations report');
  console.log('3. Clear missing translations log');
  console.log('4. Show debug configuration');
  console.log('5. Exit');
  
  rl.question('\nSelect an option (1-5): ', (answer) => {
    switch (answer) {
      case '1':
        setDebugLevel();
        break;
      case '2':
        generateReport();
        break;
      case '3':
        clearMissingTranslations();
        break;
      case '4':
        showConfiguration();
        break;
      case '5':
        console.log('Exiting locale debug tool.');
        rl.close();
        break;
      default:
        console.log('Invalid option. Please try again.');
        showMenu();
    }
  });
}

/**
 * Set the debug level
 */
function setDebugLevel() {
  console.log('\n=== Set Debug Level ===');
  console.log('0. NONE - No debugging information');
  console.log('1. ERROR - Only error messages');
  console.log('2. WARN - Errors and warnings (including missing translations)');
  console.log('3. INFO - General information, warnings, and errors (default in development)');
  console.log('4. VERBOSE - All debug information including translation resolution');
  
  rl.question('\nSelect a debug level (0-4): ', (answer) => {
    const level = parseInt(answer);
    
    if (isNaN(level) || level < 0 || level > 4) {
      console.log('Invalid level. Please select a number between 0 and 4.');
      setDebugLevel();
      return;
    }
    
    // Get the level name from the numeric value
    const levelName = Object.keys(DEBUG_LEVELS).find(key => DEBUG_LEVELS[key] === level);
    
    // Add debug command to .env file
    updateEnvFile(level, levelName);
    
    // Output to console
    console.log(`\nDebug level set to ${level} (${levelName})`);
    console.log('Restart your development server for the changes to take effect.');
    
    // Return to main menu
    showMenu();
  });
}

/**
 * Update or create .env.local file with debug level
 */
function updateEnvFile(level, levelName) {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace existing LOCALE_DEBUG_LEVEL if present
    if (envContent.match(/LOCALE_DEBUG_LEVEL=/)) {
      envContent = envContent.replace(
        /LOCALE_DEBUG_LEVEL=.*/,
        `LOCALE_DEBUG_LEVEL=${level} # ${levelName}`
      );
    } else {
      // Add to the end if not present
      envContent = `${envContent.trim()}\n\n# Locale debugging level\nLOCALE_DEBUG_LEVEL=${level} # ${levelName}\n`;
    }
  } else {
    // Create new .env.local file
    envContent = `# Locale debugging level\nLOCALE_DEBUG_LEVEL=${level} # ${levelName}\n`;
  }
  
  // Write to file
  fs.writeFileSync(envPath, envContent);
  console.log(`Updated ${envPath} with debug level ${levelName}`);
}

/**
 * Generate a report of missing translations
 * (This simulates the browser-based report generation)
 */
function generateReport() {
  console.log('\n=== Missing Translations Report ===');
  console.log('This functionality requires a running application.');
  console.log('To generate a missing translations report:');
  console.log('1. Open your application in a web browser');
  console.log('2. Open the browser console');
  console.log('3. Run: window.__LOCALE_DEBUG.generateMissingTranslationsReport()');
  
  rl.question('\nPress Enter to return to the main menu...', () => {
    showMenu();
  });
}

/**
 * Clear missing translations log
 * (This simulates the browser-based clearing)
 */
function clearMissingTranslations() {
  console.log('\n=== Clear Missing Translations ===');
  console.log('This functionality requires a running application.');
  console.log('To clear missing translations:');
  console.log('1. Open your application in a web browser');
  console.log('2. Open the browser console');
  console.log('3. Run: window.__LOCALE_DEBUG.clearMissingTranslations()');
  
  rl.question('\nPress Enter to return to the main menu...', () => {
    showMenu();
  });
}

/**
 * Show current debug configuration
 */
function showConfiguration() {
  console.log('\n=== Current Debug Configuration ===');
  
  // Check .env.local file
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/LOCALE_DEBUG_LEVEL=(\d+)/);
    
    if (match) {
      const level = parseInt(match[1]);
      const levelName = Object.keys(DEBUG_LEVELS).find(key => DEBUG_LEVELS[key] === level);
      console.log(`Current debug level: ${level} (${levelName})`);
    } else {
      console.log('No debug level configured in .env.local');
      console.log('Default level: 3 (INFO) in development, 1 (ERROR) in production');
    }
  } else {
    console.log('No .env.local file found');
    console.log('Default level: 3 (INFO) in development, 1 (ERROR) in production');
  }
  
  rl.question('\nPress Enter to return to the main menu...', () => {
    showMenu();
  });
}

// Start the application
console.log('\nLocale Debugging Setup Script');
console.log('This tool helps you configure locale debugging for the XLab Web application.');
showMenu(); 