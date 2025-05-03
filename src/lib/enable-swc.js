'use strict';

// Script để khắc phục lỗi "Found lockfile missing swc dependencies"

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Hàm kiểm tra SWC được cài đặt đúng cách hay không
 * @returns {boolean} true nếu SWC đã cài đặt đúng, false nếu chưa
 */
function checkSWCInstalled() {
  try {
    // Tên gói SWC cho Windows
    const swcPackage = '@next/swc-win32-x64-msvc';
    
    // Kiểm tra trong dependencies
    const packageJsonPath = path.resolve('./package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Kiểm tra trong dependencies hoặc devDependencies
      const inDeps = packageJson.dependencies && packageJson.dependencies[swcPackage];
      const inDevDeps = packageJson.devDependencies && packageJson.devDependencies[swcPackage];
      
      if (inDeps || inDevDeps) {
        // Kiểm tra thư mục node_modules/@next/swc-win32-x64-msvc có tồn tại không
        const swcPath = path.resolve('./node_modules/@next/swc-win32-x64-msvc');
        return fs.existsSync(swcPath);
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking SWC installation:', error.message);
    return false;
  }
}

/**
 * Hàm cài đặt SWC nếu chưa có
 */
function installSWCIfNeeded() {
  try {
    if (!checkSWCInstalled()) {
      console.log('Installing SWC for Windows...');
      execSync('npm install @next/swc-win32-x64-msvc@15.2.4 --save --no-fund --no-audit --quiet', { stdio: 'inherit' });
      console.log('SWC installed successfully.');
    } else {
      console.log('SWC is already installed correctly.');
    }
  } catch (error) {
    console.error('Error installing SWC:', error.message);
  }
}

// Tự động cài đặt SWC nếu cần thiết
installSWCIfNeeded();

module.exports = {}; 