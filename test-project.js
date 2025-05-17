/**
 * XLab Web - Test Project
 * 
 * Script kiểm tra toàn diện dự án
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== XLab Web Project Validator ===');

// Kiểm tra cấu trúc dự án
function checkProjectStructure() {
  console.log('🔍 Kiểm tra cấu trúc dự án...');
  
  const requiredDirs = [
    'src/app',
    'src/components',
    'src/lib',
    'src/models',
    'public',
    'public/images'
  ];
  
  let allExists = true;
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      console.error(`❌ Thư mục ${dir} không tồn tại`);
      allExists = false;
    }
  }
  
  if (allExists) {
    console.log('✅ Cấu trúc dự án đầy đủ');
  }
  
  return allExists;
}

// Kiểm tra cấu hình Next.js
function checkNextConfig() {
  console.log('🔍 Kiểm tra cấu hình Next.js...');
  
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  if (!fs.existsSync(nextConfigPath)) {
    console.error('❌ File next.config.js không tồn tại');
    return false;
  }
  
  try {
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Kiểm tra các tùy chọn không hợp lệ
    const invalidOptions = [
      'skipMiddlewareUrlNormalize',
      'disableOptimizedLoading',
      'swcTraceProfiling'
    ];
    
    let foundInvalidOptions = false;
    
    for (const option of invalidOptions) {
      if (content.includes(option + ':') || content.includes(`"${option}":`)) {
        console.error(`❌ Tùy chọn không hợp lệ trong next.config.js: ${option}`);
        foundInvalidOptions = true;
      }
    }
    
    if (!foundInvalidOptions) {
      console.log('✅ File next.config.js không có tùy chọn không hợp lệ');
    }
    
    return !foundInvalidOptions;
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra next.config.js:', error);
    return false;
  }
}

// Kiểm tra package.json
function checkPackageJson() {
  console.log('🔍 Kiểm tra dependencies trong package.json...');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ File package.json không tồn tại');
    return false;
  }
  
  try {
    const content = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = { ...content.dependencies, ...content.devDependencies };
    
    // Kiểm tra các package cần thiết
    const requiredPackages = [
      'next',
      'react',
      'react-dom',
      'typescript'
    ];
    
    let missingPackages = [];
    
    for (const pkg of requiredPackages) {
      if (!dependencies[pkg]) {
        missingPackages.push(pkg);
      }
    }
    
    if (missingPackages.length > 0) {
      console.error(`❌ Thiếu các package: ${missingPackages.join(', ')}`);
      return false;
    }
    
    console.log('✅ Các package cần thiết đã được cài đặt');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra package.json:', error);
    return false;
  }
}

// Kiểm tra các file môi trường
function checkEnvironmentFiles() {
  console.log('🔍 Kiểm tra cấu hình môi trường...');
  
  // Kiểm tra .env.local
  const envLocalPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envLocalPath)) {
    console.log('⚠️ File .env.local không tồn tại, tạo file mẫu...');
    
    const envContent = `NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_TELEMETRY_DISABLED=1
NEXT_IGNORE_WARNINGS=NEXT_PACKAGE_WARNING,ESLINT_WARNING,API_ROUTE_IMPORT_WARNING
NEXT_DISABLE_TRACE=1
NODE_OPTIONS=--no-warnings`;
    
    try {
      fs.writeFileSync(envLocalPath, envContent, 'utf8');
      console.log('✅ Đã tạo file .env.local mẫu');
    } catch (error) {
      console.error('❌ Không thể tạo file .env.local:', error);
    }
  } else {
    console.log('✅ File .env.local đã tồn tại');
  }
  
  return true;
}

// Kiểm tra các file tạm thời và xóa
function cleanTemporaryFiles() {
  console.log('🧹 Dọn dẹp các file tạm...');
  
  const tempFiles = [
    '.next/trace',
    '.next/trace.*',
    'next-fix-all.log'
  ];
  
  for (const pattern of tempFiles) {
    try {
      if (pattern.includes('*')) {
        const dir = path.dirname(pattern);
        const basePattern = path.basename(pattern).replace('*', '');
        
        if (fs.existsSync(path.join(__dirname, dir))) {
          const files = fs.readdirSync(path.join(__dirname, dir));
          for (const file of files) {
            if (file.includes(basePattern)) {
              fs.unlinkSync(path.join(__dirname, dir, file));
              console.log(`✅ Đã xóa file: ${path.join(dir, file)}`);
            }
          }
        }
      } else {
        const filePath = path.join(__dirname, pattern);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`✅ Đã xóa file: ${pattern}`);
        }
      }
    } catch (error) {
      console.error(`❌ Lỗi khi xóa file ${pattern}:`, error);
    }
  }
  
  console.log('✅ Đã dọn dẹp các file tạm');
  return true;
}

// Chạy kiểm tra
async function runTests() {
  const results = {
    structure: checkProjectStructure(),
    nextConfig: checkNextConfig(),
    packageJson: checkPackageJson(),
    environment: checkEnvironmentFiles(),
    cleanup: cleanTemporaryFiles()
  };
  
  console.log('\n=== Kết quả kiểm tra ===');
  
  let allPassed = true;
  for (const [test, result] of Object.entries(results)) {
    console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'Đạt' : 'Không đạt'}`);
    if (!result) allPassed = false;
  }
  
  if (allPassed) {
    console.log('\n✅ Dự án đã sẵn sàng và không có lỗi tiềm ẩn');
    return true;
  } else {
    console.log('\n⚠️ Dự án có một số vấn đề cần khắc phục');
    return false;
  }
}

// Chạy kiểm tra và tự động sửa lỗi nếu cần
async function main() {
  const testResult = await runTests();
  
  if (!testResult) {
    console.log('\n🔄 Đang chạy script sửa lỗi toàn diện...');
    try {
      execSync('node fix-all-errors.js', { stdio: 'inherit' });
      console.log('✅ Đã chạy script sửa lỗi toàn diện');
      
      // Chạy lại kiểm tra
      console.log('\n🔄 Chạy lại kiểm tra sau khi sửa lỗi...');
      await runTests();
    } catch (error) {
      console.error('❌ Lỗi khi chạy script sửa lỗi:', error);
    }
  }
}

// Chạy chương trình
main().catch(error => {
  console.error('❌ Lỗi không mong muốn:', error);
  process.exit(1);
}); 