#!/usr/bin/env node

/**
 * Script để sửa xung đột giữa SWC và Babel trong Next.js
 * Vấn đề: Khi có file .babelrc, Next.js sẽ dùng Babel thay vì SWC gây xung đột với tính năng next/font
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

console.log('XLab Web - SWC/Babel Conflict Fix');
console.log('------------------------------');

try {
    // Bước 1: Kiểm tra và xóa file .babelrc
    console.log('[1/5] Kiểm tra và xóa file .babelrc...');
    const babelrcPath = path.join(process.cwd(), '.babelrc');
    const babelrcBackupPath = path.join(process.cwd(), '.babelrc.backup');
    
    if (fs.existsSync(babelrcPath)) {
        console.log('File .babelrc được tìm thấy, tạo backup và xóa...');
        fs.copyFileSync(babelrcPath, babelrcBackupPath);
        fs.unlinkSync(babelrcPath);
        console.log('Đã xóa .babelrc và tạo bản sao lưu .babelrc.backup');
    } else {
        console.log('File .babelrc không tồn tại, bỏ qua...');
    }

    // Bước 2: Cập nhật next.config.js
    console.log('[2/5] Cập nhật next.config.js để sử dụng SWC...');
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    const nextConfigBackupPath = path.join(process.cwd(), 'next.config.js.backup');
    
    // Tạo bản sao lưu nếu tồn tại file cấu hình
    if (fs.existsSync(nextConfigPath)) {
        fs.copyFileSync(nextConfigPath, nextConfigBackupPath);
        console.log('Đã tạo bản sao lưu next.config.js.backup');
    }
    
    // Tạo nội dung mới cho next.config.js
    const newConfig = `// next.config.js
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  // Đã xóa tùy chọn swcMinify không được hỗ trợ
}

module.exports = nextConfig
`;
    
    fs.writeFileSync(nextConfigPath, newConfig);
    console.log('Đã cập nhật next.config.js với cấu hình SWC');

    // Bước 3: Xóa thư mục .next (cache)
    console.log('[3/5] Xóa thư mục .next...');
    const nextDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
        if (os.platform() === 'win32') {
            execSync('rd /s /q .next', { stdio: 'ignore' });
        } else {
            execSync('rm -rf .next', { stdio: 'ignore' });
        }
        console.log('Đã xóa thư mục .next');
    } else {
        console.log('Thư mục .next không tồn tại, bỏ qua...');
    }

    // Bước 4: Thiết lập biến môi trường trong .env.local
    console.log('[4/5] Thiết lập biến môi trường...');
    const envPath = path.join(process.cwd(), '.env.local');
    fs.writeFileSync(envPath, 'NODE_OPTIONS=--max_old_space_size=4096\n');
    console.log('Đã thiết lập NODE_OPTIONS=--max_old_space_size=4096 trong .env.local');

    // Bước 5: Xóa cache
    console.log('[5/5] Xóa cache trong node_modules/.cache...');
    const cachePath = path.join(process.cwd(), 'node_modules', '.cache');
    if (fs.existsSync(cachePath)) {
        const cacheItems = fs.readdirSync(cachePath);
        for (const item of cacheItems) {
            const itemPath = path.join(cachePath, item);
            if (fs.statSync(itemPath).isDirectory()) {
                if (os.platform() === 'win32') {
                    try {
                        execSync(`rd /s /q "${itemPath}"`, { stdio: 'ignore' });
                    } catch (e) {
                        console.log(`Không thể xóa ${itemPath}: ${e.message}`);
                    }
                } else {
                    try {
                        execSync(`rm -rf "${itemPath}"`, { stdio: 'ignore' });
                    } catch (e) {
                        console.log(`Không thể xóa ${itemPath}: ${e.message}`);
                    }
                }
            }
        }
        console.log('Đã xóa cache trong node_modules/.cache');
    } else {
        console.log('Thư mục node_modules/.cache không tồn tại, bỏ qua...');
    }

    console.log('\n===== THÔNG BÁO QUAN TRỌNG =====');
    console.log('Đã cấu hình Next.js để sử dụng SWC thay vì Babel.');
    console.log('Đã loại bỏ tùy chọn swcMinify không được hỗ trợ.');
    console.log('Đã thêm cấu hình compiler.styledComponents để hỗ trợ styled-components.');
    console.log('LƯU Ý: Không sử dụng file .babelrc khi bạn cần các tính năng yêu cầu SWC.');
    console.log('Nếu bạn cần cấu hình babel, hãy sử dụng next.config.js thay thế.');
    console.log('===============================\n');
    
    console.log('Khởi động lại ứng dụng bằng lệnh: npm run dev');
} catch (error) {
    console.error('Đã xảy ra lỗi:', error.message);
    process.exit(1);
} 