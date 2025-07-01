const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📊 Đang phân tích sức khỏe dự án XLab Web...');
console.log('================================================');

// Đường dẫn tệp và thư mục quan trọng
const ROOT_DIR = process.cwd();
const packageJsonPath = path.join(ROOT_DIR, 'package.json');
const tsconfigPath = path.join(ROOT_DIR, 'tsconfig.json');
const nextConfigPath = path.join(ROOT_DIR, 'next.config.js');

// Mảng để theo dõi các vấn đề
const issues = [];
const warnings = [];
const successes = [];

// Kiểm tra tệp package.json
try {
  const packageJson = require(packageJsonPath);
  successes.push('✅ Đọc file package.json thành công');
  
  // Kiểm tra phiên bản Node
  const nodeVersion = packageJson.engines && packageJson.engines.node;
  if (nodeVersion) {
    successes.push(`✅ Yêu cầu phiên bản Node: ${nodeVersion}`);
  } else {
    warnings.push('⚠️ Không xác định phiên bản Node yêu cầu trong package.json');
  }
  
  // Kiểm tra scripts
  if (packageJson.scripts && Object.keys(packageJson.scripts).length > 0) {
    successes.push(`✅ Có ${Object.keys(packageJson.scripts).length} scripts trong package.json`);
  } else {
    issues.push('❌ Không tìm thấy scripts trong package.json');
  }
} catch (error) {
  issues.push(`❌ Lỗi khi đọc package.json: ${error.message}`);
}

// Kiểm tra cấu hình TypeScript
try {
  const tsconfig = require(tsconfigPath);
  successes.push('✅ Đọc file tsconfig.json thành công');
  
  // Kiểm tra strictNullChecks
  if (tsconfig.compilerOptions && tsconfig.compilerOptions.strictNullChecks === false) {
    warnings.push('⚠️ strictNullChecks đang bị tắt trong tsconfig.json');
  } else {
    successes.push('✅ strictNullChecks đang được bật');
  }
} catch (error) {
  issues.push(`❌ Lỗi khi đọc tsconfig.json: ${error.message}`);
}

// Kiểm tra Next.js config
try {
  if (fs.existsSync(nextConfigPath)) {
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    successes.push('✅ Đọc file next.config.js thành công');
    
    // Kiểm tra headers bảo mật
    if (nextConfigContent.includes('headers()') && nextConfigContent.includes('X-Content-Type-Options')) {
      successes.push('✅ Đã cấu hình security headers trong next.config.js');
    } else {
      warnings.push('⚠️ Cấu hình security headers có thể chưa đầy đủ trong next.config.js');
    }
  } else {
    issues.push('❌ Không tìm thấy file next.config.js');
  }
} catch (error) {
  issues.push(`❌ Lỗi khi đọc next.config.js: ${error.message}`);
}

// Kiểm tra cấu trúc thư mục
const requiredDirs = ['src', 'public', 'components', 'pages', 'app'];
requiredDirs.forEach(dir => {
  const fullPath = path.join(ROOT_DIR, dir === 'components' || dir === 'pages' || dir === 'app' ? `src/${dir}` : dir);
  if (fs.existsSync(fullPath)) {
    successes.push(`✅ Thư mục ${dir} tồn tại`);
  } else {
    warnings.push(`⚠️ Không tìm thấy thư mục ${dir}`);
  }
});

// Kiểm tra TypeScript errors
try {
  console.log('\n🔍 Đang kiểm tra lỗi TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  successes.push('✅ Không có lỗi TypeScript');
} catch (error) {
  const errorOutput = error.stdout ? error.stdout.toString() : '';
  const errorCount = (errorOutput.match(/error TS\d+/g) || []).length;
  issues.push(`❌ Phát hiện ${errorCount} lỗi TypeScript`);
}

// In báo cáo
console.log('\n📋 BÁO CÁO SỨC KHỎE DỰ ÁN');
console.log('================================================');

if (successes.length > 0) {
  console.log('\n🟢 THÀNH CÔNG:');
  successes.forEach(success => console.log(`  ${success}`));
}

if (warnings.length > 0) {
  console.log('\n🟡 CẢNH BÁO:');
  warnings.forEach(warning => console.log(`  ${warning}`));
}

if (issues.length > 0) {
  console.log('\n🔴 VẤN ĐỀ:');
  issues.forEach(issue => console.log(`  ${issue}`));
}

// Tính điểm sức khỏe
const totalChecks = successes.length + warnings.length + issues.length;
const healthScore = Math.round((successes.length / totalChecks) * 100);

console.log('\n================================================');
console.log(`📊 ĐIỂM SỨC KHỎE DỰ ÁN: ${healthScore}/100`);

// Phân loại sức khỏe
if (healthScore >= 90) {
  console.log('🟢 Rất tốt: Dự án đang trong tình trạng rất tốt!');
} else if (healthScore >= 70) {
  console.log('🟢 Tốt: Dự án đang hoạt động tốt với một số cảnh báo nhỏ.');
} else if (healthScore >= 50) {
  console.log('🟡 Trung bình: Dự án cần một số cải tiến.');
} else {
  console.log('🔴 Kém: Dự án cần được xem xét và cải thiện ngay lập tức!');
}

console.log('================================================'); 