const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 AUTO-FIXING PROJECT ISSUES');
console.log('==============================\n');

let fixedFiles = 0;
let totalFixes = 0;

// 1. Replace console.log with logger
console.log('1️⃣ Replacing console.log with proper logging...');

const tsFiles = glob.sync('src/**/*.{ts,tsx}', { 
  ignore: ['**/node_modules/**', '**/logger.ts', '**/error-handler.ts'] 
});

tsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let fileFixed = false;

  // Skip files that already import logger
  if (content.includes('import { logger }') || content.includes('import logger')) {
    return;
  }

  // Replace console.log with logger.log (but keep console.warn and console.error)
  const consoleLogMatches = content.match(/console\.log\(/g);
  if (consoleLogMatches && consoleLogMatches.length > 0) {
    // Add logger import at the top
    const importMatch = content.match(/^(import[^;]+;?\n)*/m);
    if (importMatch) {
      const lastImportIndex = importMatch[0].length;
      content = content.slice(0, lastImportIndex) + 
                "import { logger } from '@/lib/logger';\n" + 
                content.slice(lastImportIndex);
    } else {
      content = "import { logger } from '@/lib/logger';\n\n" + content;
    }

    // Replace console.log with logger.log
    content = content.replace(/console\.log\(/g, 'logger.log(');
    fileFixed = true;
    totalFixes += consoleLogMatches.length;
  }

  if (fileFixed) {
    fs.writeFileSync(file, content, 'utf8');
    fixedFiles++;
    console.log(`   ✅ Fixed ${consoleLogMatches.length} console.log in: ${file}`);
  }
});

console.log(`   Fixed console.log in ${fixedFiles} files\n`);

// 2. Fix TODO comments by converting to proper issue tracking
console.log('2️⃣ Converting TODO comments to proper format...');

let todoFixedFiles = 0;
let todoFixes = 0;

tsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let fileFixed = false;

  // Convert TODO to proper format with context
  content = content.replace(
    /\/\/\s*TODO:?\s*(.+)/gi,
    '// TODO: $1 - Consider creating GitHub issue for tracking'
  );

  // Convert FIXME to proper format
  content = content.replace(
    /\/\/\s*FIXME:?\s*(.+)/gi,
    '// FIXME: $1 - Requires immediate attention'
  );

  // Convert HACK to proper format
  content = content.replace(
    /\/\/\s*HACK:?\s*(.+)/gi,
    '// HACK: $1 - Temporary solution, needs refactoring'
  );

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    todoFixedFiles++;
    const matches = originalContent.match(/\/\/\s*(TODO|FIXME|HACK)/gi);
    todoFixes += matches ? matches.length : 0;
    console.log(`   ✅ Formatted TODO/FIXME comments in: ${file}`);
    fileFixed = true;
  }
});

console.log(`   Formatted TODO comments in ${todoFixedFiles} files\n`);

// 3. Fix some 'any' types with better types
console.log('3️⃣ Improving type safety...');

let typeFixedFiles = 0;
let typeFixes = 0;

tsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let fileFixed = false;

  // Replace common any patterns with better types
  const replacements = [
    // Function parameters
    { pattern: /\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, replacement: '($1: unknown)' },
    // Object properties
    { pattern: /:\s*any\[\]/g, replacement: ': unknown[]' },
    // Event handlers
    { pattern: /\(\s*event\s*:\s*any\s*\)/g, replacement: '(event: Event)' },
    { pattern: /\(\s*e\s*:\s*any\s*\)/g, replacement: '(e: Event)' },
    // Generic any
    { pattern: /Record<string,\s*any>/g, replacement: 'Record<string, unknown>' },
  ];

  replacements.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      typeFixes += matches.length;
      fileFixed = true;
    }
  });

  if (fileFixed) {
    fs.writeFileSync(file, content, 'utf8');
    typeFixedFiles++;
    console.log(`   ✅ Improved types in: ${file}`);
  }
});

console.log(`   Improved types in ${typeFixedFiles} files\n`);

// 4. Add basic error handling to async functions
console.log('4️⃣ Adding basic error handling...');

let errorHandlingFixedFiles = 0;
let errorHandlingFixes = 0;

tsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let fileFixed = false;

  // Look for async functions without try-catch
  const asyncFunctionPattern = /async\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*{([^}]+)}/g;
  
  content = content.replace(asyncFunctionPattern, (match, functionName, body) => {
    // Check if already has try-catch
    if (body.includes('try') && body.includes('catch')) {
      return match;
    }

    // Add basic try-catch wrapper
    const wrappedBody = `{
    try {${body}
    } catch (error) {
      console.error('Error in ${functionName}:', error);
      throw error;
    }
  }`;

    errorHandlingFixes++;
    fileFixed = true;
    return `async function ${functionName}${match.substring(match.indexOf('('), match.indexOf('{'))}${wrappedBody}`;
  });

  if (fileFixed) {
    fs.writeFileSync(file, content, 'utf8');
    errorHandlingFixedFiles++;
    console.log(`   ✅ Added error handling to: ${file}`);
  }
});

console.log(`   Added error handling to ${errorHandlingFixedFiles} files\n`);

// 5. Fix import order (basic)
console.log('5️⃣ Organizing imports...');

let importFixedFiles = 0;

tsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Extract all imports
  const importLines = [];
  const nonImportLines = [];
  const lines = content.split('\n');
  let inImportSection = true;

  lines.forEach(line => {
    if (line.trim().startsWith('import ') || line.trim().startsWith('export ') && line.includes('from')) {
      if (inImportSection) {
        importLines.push(line);
      } else {
        nonImportLines.push(line);
      }
    } else if (line.trim() === '') {
      if (inImportSection && importLines.length > 0) {
        importLines.push(line);
      } else {
        nonImportLines.push(line);
      }
    } else {
      inImportSection = false;
      nonImportLines.push(line);
    }
  });

  // Sort imports: external packages first, then internal
  const externalImports = importLines.filter(line => 
    line.includes('from \'') && !line.includes('from \'@/') && !line.includes('from \'./') && !line.includes('from \'../')
  );
  const internalImports = importLines.filter(line => 
    line.includes('from \'@/') || line.includes('from \'./') || line.includes('from \'../')
  );
  const otherLines = importLines.filter(line => 
    !line.includes('from \'') || line.trim() === ''
  );

  const sortedImports = [
    ...externalImports.sort(),
    '',
    ...internalImports.sort(),
    ...otherLines
  ].filter((line, index, arr) => {
    // Remove consecutive empty lines
    return !(line === '' && arr[index - 1] === '');
  });

  const newContent = [...sortedImports, '', ...nonImportLines].join('\n');

  if (newContent !== originalContent && importLines.length > 1) {
    fs.writeFileSync(file, newContent, 'utf8');
    importFixedFiles++;
    console.log(`   ✅ Organized imports in: ${file}`);
  }
});

console.log(`   Organized imports in ${importFixedFiles} files\n`);

// Summary
console.log('📋 AUTO-FIX SUMMARY');
console.log('===================');
console.log(`✅ Fixed console.log statements in ${fixedFiles} files`);
console.log(`✅ Formatted TODO comments in ${todoFixedFiles} files`);
console.log(`✅ Improved types in ${typeFixedFiles} files`);
console.log(`✅ Added error handling to ${errorHandlingFixedFiles} files`);
console.log(`✅ Organized imports in ${importFixedFiles} files`);
console.log(`\n🎉 Total fixes applied: ${totalFixes + todoFixes + typeFixes + errorHandlingFixes}`);
console.log('\n✨ Auto-fix completed! Run the health check again to see improvements.');
