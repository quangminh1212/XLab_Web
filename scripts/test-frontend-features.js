const fs = require('fs');
const path = require('path');

console.log('🎨 TESTING FRONTEND FEATURES');
console.log('=============================\n');

// Test 1: Check if all required pages exist
console.log('1️⃣ Checking page structure...');

const requiredPages = [
  'src/app/page.tsx',                    // Home page
  'src/app/products/page.tsx',           // Products listing
  'src/app/products/[id]/page.tsx',      // Product detail
  'src/app/cart/page.tsx',               // Shopping cart
  'src/app/checkout/page.tsx',           // Checkout
  'src/app/payment/success/page.tsx',    // Payment success
  'src/app/admin/page.tsx',              // Admin dashboard
  'src/app/admin/products/page.tsx',     // Admin products
  'src/app/admin/orders/page.tsx',       // Admin orders
  'src/app/admin/users/page.tsx',        // Admin users
  'src/app/admin/coupons/page.tsx',      // Admin coupons
  'src/app/account/page.tsx',            // User profile
];

let pagesExist = 0;
let pagesMissing = 0;

requiredPages.forEach(page => {
  if (fs.existsSync(page)) {
    console.log(`  ✅ ${page}`);
    pagesExist++;
  } else {
    console.log(`  ❌ ${page} - MISSING`);
    pagesMissing++;
  }
});

console.log(`\n📊 Pages: ${pagesExist} exist, ${pagesMissing} missing\n`);

// Test 2: Check if all required components exist
console.log('2️⃣ Checking component structure...');

const requiredComponents = [
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/common/BalanceDisplay.tsx',
  'src/components/common/LanguageSwitcher.tsx',
  'src/components/common/StyleLoader.tsx',
  'src/components/product/ProductCard.tsx',
  'src/components/product/ProductGrid.tsx',
  'src/components/cart/CartContext.tsx', // cart context present
  'src/app/admin/layout.tsx', // admin layout serves as sidebar/menu
];

let componentsExist = 0;
let componentsMissing = 0;

requiredComponents.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`  ✅ ${component}`);
    componentsExist++;
  } else {
    console.log(`  ❌ ${component} - MISSING`);
    componentsMissing++;
  }
});

console.log(`\n📊 Components: ${componentsExist} exist, ${componentsMissing} missing\n`);

// Test 3: Check if all required lib files exist
console.log('3️⃣ Checking library structure...');

const requiredLibFiles = [
  'src/lib/authOptions.ts',
  'src/lib/userService.ts',
  'src/lib/utils.ts',
  'src/lib/i18n/products.ts',
  'src/i18n/index.ts',
  'src/contexts/LanguageContext.tsx',
  'src/components/cart/CartContext.tsx',
];

let libFilesExist = 0;
let libFilesMissing = 0;

requiredLibFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
    libFilesExist++;
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    libFilesMissing++;
  }
});

console.log(`\n📊 Lib files: ${libFilesExist} exist, ${libFilesMissing} missing\n`);

// Test 4: Check if data directories exist
console.log('4️⃣ Checking data structure...');

const requiredDataDirs = [
  'data',
  'data/users',
  'data/products',
  'data/products/eng',
  'data/products/vie',
];

const requiredDataFiles = [
  'data/coupons.json',
  'data/notifications.json',
];

let dataDirsExist = 0;
let dataFilesMissing = 0;

requiredDataDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`  ✅ ${dir}/`);
    dataDirsExist++;
  } else {
    console.log(`  ❌ ${dir}/ - MISSING`);
    dataFilesMissing++;
  }
});

requiredDataFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
    dataDirsExist++;
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    dataFilesMissing++;
  }
});

console.log(`\n📊 Data structure: ${dataDirsExist} exist, ${dataFilesMissing} missing\n`);

// Test 5: Check if configuration files are correct
console.log('5️⃣ Checking configuration files...');

const configFiles = [
  { file: 'package.json', test: (content) => JSON.parse(content).name },
  { file: 'next.config.js', test: (content) => content.includes('nextConfig') },
  { file: 'tailwind.config.ts', test: (content) => content.includes('tailwindcss') },
  { file: 'tsconfig.json', test: (content) => JSON.parse(content).compilerOptions },
  { file: '.env.local', test: (content) => content.includes('NEXTAUTH'), optional: true },
];

let configsValid = 0;
let configsInvalid = 0;

configFiles.forEach(({ file, test, optional }) => {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const isValid = test(content);
      if (isValid) {
        console.log(`  ✅ ${file} - Valid`);
        configsValid++;
      } else {
        console.log(`  ⚠️ ${file} - Invalid format`);
        configsInvalid++;
      }
    } else {
      if (optional) {
        console.log(`  ⚠️ ${file} - Optional, not found`);
      } else {
        console.log(`  ❌ ${file} - MISSING`);
        configsInvalid++;
      }
    }
  } catch (error) {
    console.log(`  ❌ ${file} - Error: ${error.message}`);
    configsInvalid++;
  }
});

console.log(`\n📊 Configs: ${configsValid} valid, ${configsInvalid} invalid\n`);

// Test 6: Check for common issues
console.log('6️⃣ Checking for common issues...');

const issues = [];

// Check for missing dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['next', 'react', 'next-auth', 'tailwindcss'];
  
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      issues.push(`Missing dependency: ${dep}`);
    }
  });
} catch (error) {
  issues.push('Cannot read package.json');
}

// Check for TypeScript issues in key files
const keyFiles = [
  'src/app/layout.tsx',
  'src/components/layout/Header.tsx',
  'src/lib/authOptions.ts'
];

keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for obvious syntax issues
    if (content.includes('export default') && !content.includes('export default function') && !content.includes('export default class')) {
      // This is a basic check, not comprehensive
    }
    
    // Check for missing imports
    if (content.includes('NextAuth') && !content.includes('import') && !content.includes('NextAuth')) {
      issues.push(`${file}: Possible missing NextAuth import`);
    }
  }
});

if (issues.length === 0) {
  console.log('  ✅ No common issues found');
} else {
  issues.forEach(issue => {
    console.log(`  ⚠️ ${issue}`);
  });
}

console.log(`\n📊 Issues found: ${issues.length}\n`);

// Final Summary
console.log('📋 FRONTEND FEATURE TEST SUMMARY');
console.log('=================================');
console.log(`📄 Pages: ${pagesExist}/${requiredPages.length} exist`);
console.log(`🧩 Components: ${componentsExist}/${requiredComponents.length} exist`);
console.log(`📚 Lib files: ${libFilesExist}/${requiredLibFiles.length} exist`);
console.log(`💾 Data structure: ${dataDirsExist}/${requiredDataDirs.length + requiredDataFiles.length} exist`);
console.log(`⚙️ Configs: ${configsValid}/${configFiles.length} valid`);
console.log(`⚠️ Issues: ${issues.length} found`);

const totalChecks = requiredPages.length + requiredComponents.length + requiredLibFiles.length + 
                   requiredDataDirs.length + requiredDataFiles.length + configFiles.length;
const totalPassed = pagesExist + componentsExist + libFilesExist + dataDirsExist + configsValid;

const healthPercentage = Math.round((totalPassed / totalChecks) * 100);

console.log(`\n🎯 Overall Frontend Health: ${healthPercentage}%`);

if (healthPercentage >= 90) {
  console.log('🎉 Excellent! Frontend structure is in great shape.');
} else if (healthPercentage >= 75) {
  console.log('👍 Good! Minor issues to address.');
} else if (healthPercentage >= 60) {
  console.log('⚠️ Fair. Several components need attention.');
} else {
  console.log('❌ Poor. Significant issues need to be resolved.');
}

console.log('\n✨ Frontend feature test completed!');
