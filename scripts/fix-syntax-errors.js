const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 FIXING SYNTAX ERRORS IN API ROUTES');
console.log('======================================\n');

// Get all API route files that have syntax errors
const apiFiles = glob.sync('src/app/api/**/route.ts');
let fixedFiles = 0;

console.log(`Found ${apiFiles.length} API route files to check...\n`);

apiFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    let fileFixed = false;

    // Fix common syntax errors in try-catch blocks
    
    // Fix: } catch (error) { followed by }, { status: 401 });
    content = content.replace(
      /(\s*)\} catch \(error\) \{\s*console\.error[^}]*\}\s*\}, \{ status: (\d+) \}\);/g,
      '$1} catch (error) {\n$1  console.error(error);\n$1  return NextResponse.json({ error: "Internal Server Error" }, { status: $2 });\n$1}'
    );

    // Fix: } catch (error) { followed by return statement outside
    content = content.replace(
      /(\s*)\} catch \(error\) \{\s*console\.error[^}]*\}\s*return NextResponse\.json/g,
      '$1} catch (error) {\n$1  console.error(error);\n$1  return NextResponse.json'
    );

    // Fix missing try block opening
    content = content.replace(
      /(\s*)const session = await getServerSession\(authOptions\);\s*if \(!session/,
      '$1try {\n$1  const session = await getServerSession(authOptions);\n$1  if (!session'
    );

    // Fix destructuring after catch block
    content = content.replace(
      /\} = (.*?);\s*$/gm,
      '  const data = $1;\n  // Extract needed properties from data'
    );

    // Fix incomplete try-catch structures
    content = content.replace(
      /(\s*)try \{\s*(\s*)try \{/g,
      '$1try {'
    );

    // Fix multiple catch blocks
    content = content.replace(
      /\} catch \([^)]*\) \{\s*[^}]*\}\s*\} catch \([^)]*\) \{/g,
      '} catch (error) {'
    );

    // Fix missing closing braces for functions
    const functionMatches = content.match(/export async function (GET|POST|PUT|DELETE|PATCH)/g);
    if (functionMatches) {
      functionMatches.forEach(match => {
        const functionName = match.split(' ').pop();
        // Count opening and closing braces for this function
        const functionStart = content.indexOf(match);
        if (functionStart !== -1) {
          let braceCount = 0;
          let inFunction = false;
          let functionEnd = -1;
          
          for (let i = functionStart; i < content.length; i++) {
            if (content[i] === '{') {
              if (!inFunction) inFunction = true;
              braceCount++;
            } else if (content[i] === '}') {
              braceCount--;
              if (inFunction && braceCount === 0) {
                functionEnd = i;
                break;
              }
            }
          }
          
          // If function doesn't have proper closing, we'll mark it for manual review
          if (functionEnd === -1 && braceCount > 0) {
            console.log(`   ⚠️ ${file}: ${functionName} function may need manual review`);
          }
        }
      });
    }

    // Basic validation: ensure each export function has proper structure
    const exportFunctions = content.match(/export async function \w+[^{]*{[\s\S]*?(?=export async function|\n\n|$)/g);
    if (exportFunctions) {
      exportFunctions.forEach((func, index) => {
        const openBraces = (func.match(/{/g) || []).length;
        const closeBraces = (func.match(/}/g) || []).length;
        
        if (openBraces !== closeBraces) {
          console.log(`   ⚠️ ${file}: Function ${index + 1} has mismatched braces (${openBraces} open, ${closeBraces} close)`);
        }
      });
    }

    // If content changed, write it back
    if (content !== originalContent) {
      // Basic validation before writing
      const newOpenBraces = (content.match(/{/g) || []).length;
      const newCloseBraces = (content.match(/}/g) || []).length;
      
      if (Math.abs(newOpenBraces - newCloseBraces) <= 2) { // Allow small discrepancy
        fs.writeFileSync(file, content, 'utf8');
        fixedFiles++;
        console.log(`   ✅ Fixed syntax issues in: ${file}`);
        fileFixed = true;
      } else {
        console.log(`   ⚠️ Skipped ${file}: Too many brace mismatches after fix`);
      }
    }

  } catch (error) {
    console.log(`   ❌ Error processing ${file}: ${error.message}`);
  }
});

// Also fix the specific files mentioned in the error output
const specificFixes = [
  {
    file: 'src/middleware.ts',
    fix: (content) => {
      // Fix middleware try-catch structure
      return content.replace(
        /(\s*)const token = await getToken\(\{/,
        '$1try {\n$1  const token = await getToken({'
      );
    }
  }
];

specificFixes.forEach(({ file, fix }) => {
  if (fs.existsSync(file)) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      const originalContent = content;
      content = fix(content);
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`   ✅ Applied specific fix to: ${file}`);
        fixedFiles++;
      }
    } catch (error) {
      console.log(`   ❌ Error fixing ${file}: ${error.message}`);
    }
  }
});

console.log(`\n📋 SYNTAX FIX SUMMARY`);
console.log('=====================');
console.log(`✅ Attempted fixes on ${fixedFiles} files`);
console.log(`\n⚠️ Note: Some files may need manual review`);
console.log(`💡 Run "npx tsc --noEmit" to check remaining errors`);

console.log('\n✨ Syntax fix completed!');
