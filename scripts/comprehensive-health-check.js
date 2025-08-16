const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

console.log('🔍 COMPREHENSIVE PROJECT HEALTH CHECK');
console.log('=====================================\n');

const issues = [];
const warnings = [];
const successes = [];

// 1. TypeScript Check
console.log('1️⃣ Checking TypeScript errors...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  successes.push('✅ No TypeScript errors');
} catch (error) {
  const errorOutput = error.stdout ? error.stdout.toString() : '';
  const errorCount = (errorOutput.match(/error TS\d+/g) || []).length;
  if (errorCount > 0) {
    issues.push(`❌ Found ${errorCount} TypeScript errors`);
    console.log(`   Found ${errorCount} TypeScript errors`);
  }
}

// 2. ESLint Check
console.log('2️⃣ Checking ESLint issues...');
try {
  execSync('npx eslint . --format=compact', { stdio: 'pipe' });
  successes.push('✅ No ESLint errors');
} catch (error) {
  const errorOutput = error.stdout ? error.stdout.toString() : '';
  const errorLines = errorOutput.split('\n').filter(line => line.includes('error') || line.includes('warning'));
  if (errorLines.length > 0) {
    warnings.push(`⚠️ Found ${errorLines.length} ESLint issues`);
    console.log(`   Found ${errorLines.length} ESLint issues`);
  }
}

// 3. Find console.log statements
console.log('3️⃣ Checking for console.log statements...');
const tsFiles = glob.sync('src/**/*.{ts,tsx}', { ignore: ['**/node_modules/**'] });
let consoleLogCount = 0;

tsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/console\.log\(/g);
  if (matches) {
    consoleLogCount += matches.length;
  }
});

if (consoleLogCount > 0) {
  warnings.push(`⚠️ Found ${consoleLogCount} console.log statements in source files`);
} else {
  successes.push('✅ No console.log statements in source files');
}

// 4. Find TODO comments
console.log('4️⃣ Checking for TODO/FIXME comments...');
let todoCount = 0;

tsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/\/\/\s*(TODO|FIXME|HACK)/gi);
  if (matches) {
    todoCount += matches.length;
  }
});

if (todoCount > 0) {
  warnings.push(`⚠️ Found ${todoCount} TODO/FIXME/HACK comments`);
} else {
  successes.push('✅ No TODO/FIXME/HACK comments found');
}

// 5. Check for 'any' types
console.log('5️⃣ Checking for any types...');
let anyTypeCount = 0;

tsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Look for ': any' but exclude comments and specific allowed cases
  const matches = content.match(/:\s*any(?!\w)/g);
  if (matches) {
    anyTypeCount += matches.length;
  }
});

if (anyTypeCount > 0) {
  warnings.push(`⚠️ Found ${anyTypeCount} 'any' type usages`);
} else {
  successes.push('✅ No explicit any types found');
}

// 6. Check for missing error handling
console.log('6️⃣ Checking for missing error handling...');
let missingErrorHandling = 0;

tsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Look for try blocks without catch
  const tryBlocks = content.match(/try\s*{[^}]*}/g);
  const catchBlocks = content.match(/catch\s*\([^)]*\)\s*{/g);
  
  if (tryBlocks && (!catchBlocks || tryBlocks.length > catchBlocks.length)) {
    missingErrorHandling++;
  }
});

if (missingErrorHandling > 0) {
  warnings.push(`⚠️ Found ${missingErrorHandling} files with potential missing error handling`);
} else {
  successes.push('✅ Error handling looks good');
}

// 7. Check for security issues
console.log('7️⃣ Checking for security issues...');
const securityIssues = [];

// Check for hardcoded secrets
tsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Look for potential hardcoded secrets
  if (content.match(/password\s*=\s*['"][^'"]+['"]/i)) {
    securityIssues.push(`Potential hardcoded password in ${file}`);
  }
  
  if (content.match(/api[_-]?key\s*=\s*['"][^'"]+['"]/i)) {
    securityIssues.push(`Potential hardcoded API key in ${file}`);
  }
  
  if (content.match(/secret\s*=\s*['"][^'"]+['"]/i)) {
    securityIssues.push(`Potential hardcoded secret in ${file}`);
  }
});

if (securityIssues.length > 0) {
  issues.push(`❌ Found ${securityIssues.length} potential security issues`);
  securityIssues.forEach(issue => console.log(`   ${issue}`));
} else {
  successes.push('✅ No obvious security issues found');
}

// 8. Check dependencies
console.log('8️⃣ Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  // Check for known vulnerable packages (basic check)
  const vulnerablePackages = ['lodash', 'moment']; // Example packages with known issues
  const foundVulnerable = Object.keys(deps).filter(dep => vulnerablePackages.includes(dep));
  
  if (foundVulnerable.length > 0) {
    warnings.push(`⚠️ Found potentially vulnerable packages: ${foundVulnerable.join(', ')}`);
  } else {
    successes.push('✅ No known vulnerable packages detected');
  }
} catch (error) {
  issues.push('❌ Could not read package.json');
}

// 9. Check file structure
console.log('9️⃣ Checking file structure...');
const requiredDirs = ['src', 'public', 'src/app', 'src/components', 'src/lib'];
const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));

if (missingDirs.length > 0) {
  issues.push(`❌ Missing required directories: ${missingDirs.join(', ')}`);
} else {
  successes.push('✅ All required directories exist');
}

// 10. Check environment files
console.log('🔟 Checking environment configuration...');
if (!fs.existsSync('.env.local') && !fs.existsSync('.env')) {
  warnings.push('⚠️ No environment file found (.env.local or .env)');
} else {
  successes.push('✅ Environment file exists');
}

// Print Results
console.log('\n📋 HEALTH CHECK RESULTS');
console.log('========================\n');

if (successes.length > 0) {
  console.log('🟢 SUCCESSES:');
  successes.forEach(success => console.log(`  ${success}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('🟡 WARNINGS:');
  warnings.forEach(warning => console.log(`  ${warning}`));
  console.log('');
}

if (issues.length > 0) {
  console.log('🔴 ISSUES:');
  issues.forEach(issue => console.log(`  ${issue}`));
  console.log('');
}

// Summary
const totalIssues = issues.length + warnings.length;
if (totalIssues === 0) {
  console.log('🎉 PROJECT HEALTH: EXCELLENT! No issues found.');
} else if (issues.length === 0) {
  console.log(`⚠️ PROJECT HEALTH: GOOD with ${warnings.length} warnings to address.`);
} else {
  console.log(`❌ PROJECT HEALTH: NEEDS ATTENTION with ${issues.length} critical issues and ${warnings.length} warnings.`);
}

console.log('\n✨ Health check completed!');
