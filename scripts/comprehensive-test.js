const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 COMPREHENSIVE PROJECT TEST SUITE');
console.log('====================================\n');

const results = {
  typescript: { status: 'unknown', details: '' },
  apiEndpoints: { status: 'unknown', details: '' },
  frontendStructure: { status: 'unknown', details: '' },
  healthCheck: { status: 'unknown', details: '' },
  build: { status: 'unknown', details: '' }
};

// Test 1: TypeScript Check
console.log('1️⃣ Running TypeScript check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  results.typescript.status = 'pass';
  results.typescript.details = 'No TypeScript errors found';
  console.log('  ✅ TypeScript check passed\n');
} catch (error) {
  results.typescript.status = 'fail';
  results.typescript.details = 'TypeScript errors found';
  console.log('  ❌ TypeScript check failed\n');
}

// Test 2: API Endpoints
console.log('2️⃣ Testing API endpoints...');
try {
  const output = execSync('node scripts/test-api-endpoints.js', { encoding: 'utf8' });
  if (output.includes('All API endpoint tests passed!')) {
    results.apiEndpoints.status = 'pass';
    results.apiEndpoints.details = 'All API endpoints working correctly';
    console.log('  ✅ API endpoints test passed\n');
  } else {
    results.apiEndpoints.status = 'fail';
    results.apiEndpoints.details = 'Some API endpoints failed';
    console.log('  ❌ API endpoints test failed\n');
  }
} catch (error) {
  results.apiEndpoints.status = 'fail';
  results.apiEndpoints.details = 'Could not test API endpoints - server may not be running';
  console.log('  ⚠️ API endpoints test skipped - server not running\n');
}

// Test 3: Frontend Structure
console.log('3️⃣ Testing frontend structure...');
try {
  const output = execSync('node scripts/test-frontend-features.js', { encoding: 'utf8' });
  const healthMatch = output.match(/Overall Frontend Health: (\d+)%/);
  if (healthMatch) {
    const healthPercentage = parseInt(healthMatch[1]);
    if (healthPercentage >= 75) {
      results.frontendStructure.status = 'pass';
      results.frontendStructure.details = `Frontend health: ${healthPercentage}%`;
    } else {
      results.frontendStructure.status = 'warn';
      results.frontendStructure.details = `Frontend health: ${healthPercentage}% - needs improvement`;
    }
  } else {
    results.frontendStructure.status = 'fail';
    results.frontendStructure.details = 'Could not determine frontend health';
  }
  console.log(`  ✅ Frontend structure test completed\n`);
} catch (error) {
  results.frontendStructure.status = 'fail';
  results.frontendStructure.details = 'Frontend structure test failed';
  console.log('  ❌ Frontend structure test failed\n');
}

// Test 4: Health Check
console.log('4️⃣ Running health check...');
try {
  const output = execSync('node scripts/comprehensive-health-check.js', { encoding: 'utf8' });
  if (output.includes('PROJECT HEALTH: EXCELLENT') || output.includes('PROJECT HEALTH: GOOD')) {
    results.healthCheck.status = 'pass';
    results.healthCheck.details = 'Project health is good';
  } else {
    results.healthCheck.status = 'warn';
    results.healthCheck.details = 'Project health needs attention';
  }
  console.log('  ✅ Health check completed\n');
} catch (error) {
  results.healthCheck.status = 'fail';
  results.healthCheck.details = 'Health check failed';
  console.log('  ❌ Health check failed\n');
}

// Test 5: Build Test (optional - can be slow)
console.log('5️⃣ Testing build process...');
try {
  console.log('  Building project (this may take a while)...');
  execSync('npm run build', { stdio: 'pipe' });
  results.build.status = 'pass';
  results.build.details = 'Build completed successfully';
  console.log('  ✅ Build test passed\n');
} catch (error) {
  results.build.status = 'fail';
  results.build.details = 'Build failed';
  console.log('  ❌ Build test failed\n');
}

// Generate comprehensive report
console.log('📋 COMPREHENSIVE TEST REPORT');
console.log('=============================\n');

const testCategories = [
  { name: 'TypeScript Check', key: 'typescript', weight: 20 },
  { name: 'API Endpoints', key: 'apiEndpoints', weight: 25 },
  { name: 'Frontend Structure', key: 'frontendStructure', weight: 20 },
  { name: 'Health Check', key: 'healthCheck', weight: 15 },
  { name: 'Build Process', key: 'build', weight: 20 }
];

let totalScore = 0;
let maxScore = 0;

testCategories.forEach(({ name, key, weight }) => {
  const result = results[key];
  let score = 0;
  let icon = '';
  
  switch (result.status) {
    case 'pass':
      score = weight;
      icon = '✅';
      break;
    case 'warn':
      score = weight * 0.7;
      icon = '⚠️';
      break;
    case 'fail':
      score = 0;
      icon = '❌';
      break;
    default:
      score = 0;
      icon = '❓';
  }
  
  totalScore += score;
  maxScore += weight;
  
  console.log(`${icon} ${name}: ${result.status.toUpperCase()}`);
  console.log(`   ${result.details}`);
  console.log(`   Score: ${score}/${weight}\n`);
});

const overallScore = Math.round((totalScore / maxScore) * 100);

console.log('🎯 OVERALL PROJECT SCORE');
console.log('=========================');
console.log(`Score: ${totalScore}/${maxScore} (${overallScore}%)\n`);

if (overallScore >= 90) {
  console.log('🎉 EXCELLENT! Your project is in outstanding condition.');
  console.log('✨ All major systems are working correctly.');
} else if (overallScore >= 75) {
  console.log('👍 GOOD! Your project is in solid condition.');
  console.log('💡 Minor improvements could be made.');
} else if (overallScore >= 60) {
  console.log('⚠️ FAIR. Your project has some issues that should be addressed.');
  console.log('🔧 Focus on the failed tests above.');
} else {
  console.log('❌ POOR. Your project has significant issues.');
  console.log('🚨 Immediate attention required for failed components.');
}

// Recommendations
console.log('\n💡 RECOMMENDATIONS');
console.log('==================');

const recommendations = [];

if (results.typescript.status === 'fail') {
  recommendations.push('🔧 Fix TypeScript errors before proceeding');
}

if (results.apiEndpoints.status === 'fail') {
  recommendations.push('🌐 Ensure development server is running and API endpoints are working');
}

if (results.frontendStructure.status !== 'pass') {
  recommendations.push('🎨 Complete missing frontend components and pages');
}

if (results.healthCheck.status !== 'pass') {
  recommendations.push('🏥 Run health improvements: npm run health-improve');
}

if (results.build.status === 'fail') {
  recommendations.push('🏗️ Fix build issues - check for missing dependencies or syntax errors');
}

if (recommendations.length === 0) {
  console.log('🎉 No immediate recommendations - your project is in great shape!');
} else {
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
}

// Save report to file
const reportData = {
  timestamp: new Date().toISOString(),
  overallScore,
  results,
  recommendations
};

fs.writeFileSync('TEST_REPORT.json', JSON.stringify(reportData, null, 2));
console.log('\n📄 Detailed report saved to TEST_REPORT.json');

console.log('\n✨ Comprehensive testing completed!');
