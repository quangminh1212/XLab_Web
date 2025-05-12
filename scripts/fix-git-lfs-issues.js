/**
 * Script để sửa lỗi mất định dạng ảnh khi tải file ZIP từ Git
 * Lỗi này xảy ra do Git LFS (Large File Storage) không hoạt động đúng trong một số trường hợp
 * Script này sẽ:
 * 1. Tạo bản sao lưu cho .gitattributes
 * 2. Chỉnh sửa .gitattributes để tắt LFS cho các file ảnh và binary
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const rootDir = path.resolve(__dirname, '..');
const gitattributesPath = path.join(rootDir, '.gitattributes');

console.log('='.repeat(50));
console.log(' Bắt đầu sửa lỗi định dạng ảnh trong Git');
console.log('='.repeat(50));

// Kiểm tra xem .gitattributes có tồn tại không
if (!fs.existsSync(gitattributesPath)) {
  console.log('Không tìm thấy file .gitattributes. Tạo file mới...');
  
  const defaultContent = `# Khai báo mặc định
* text=auto eol=lf

# Text
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.css text eol=lf
*.scss text eol=lf
*.html text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# Binary
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
*.mp4 binary
*.zip binary
*.pdf binary
*.psd binary
*.dll binary
*.exe binary
*.node binary

# Đánh dấu file swc cho Next.js
node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node binary
`;
  
  fs.writeFileSync(gitattributesPath, defaultContent, 'utf8');
  console.log('Đã tạo file .gitattributes mới với cấu hình phù hợp');
} else {
  // Tạo bản sao lưu
  fs.copyFileSync(gitattributesPath, `${gitattributesPath}.bak`);
  console.log('Đã tạo bản sao lưu .gitattributes.bak');
  
  // Đọc nội dung file
  let content = fs.readFileSync(gitattributesPath, 'utf8');
  
  // Tìm và thay thế các dòng sử dụng LFS
  const lfsPattern = /^.*filter=lfs diff=lfs merge=lfs.*$/gm;
  const hasLfsLines = lfsPattern.test(content);
  
  if (hasLfsLines) {
    // Đọc lại nội dung vì regex đã di chuyển con trỏ
    content = fs.readFileSync(gitattributesPath, 'utf8');
    
    // Thay thế LFS patterns với binary
    content = content.replace(/^(.*\.(png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|mp4|zip|pdf|psd|dll|exe|node)).*filter=lfs.*$/gm, 
                             '$1 binary');
    
    // Thêm chú thích về các dòng LFS đã bị vô hiệu hóa
    content += `
# Git LFS đã bị vô hiệu hóa để tránh lỗi định dạng ảnh khi tải ZIP
# Nếu bạn muốn bật lại Git LFS, hãy xóa file này và khôi phục từ .gitattributes.bak
`;
    
    // Ghi lại file
    fs.writeFileSync(gitattributesPath, content, 'utf8');
    console.log('Đã vô hiệu hóa Git LFS trong .gitattributes');
  } else {
    console.log('Không tìm thấy cấu hình Git LFS trong .gitattributes');
  }
}

// Kiểm tra xem Git LFS có được cài đặt không
try {
  execSync('git lfs --version', { stdio: 'ignore' });
  console.log('Git LFS đã được cài đặt trên hệ thống này');
  
  // Kiểm tra xem repo có sử dụng LFS không
  try {
    const trackingOutput = execSync('git lfs track', { encoding: 'utf8' });
    if (trackingOutput.includes('Listing tracked patterns')) {
      console.log('Repository đang sử dụng Git LFS. Đang vô hiệu hóa...');
      
      // Tạo file .lfsconfig để vô hiệu hóa LFS
      const lfsConfigPath = path.join(rootDir, '.lfsconfig');
      fs.writeFileSync(lfsConfigPath, `[lfs]
	enabled = false
`, 'utf8');
      console.log('Đã tạo file .lfsconfig để vô hiệu hóa Git LFS');
    }
  } catch (err) {
    console.log('Không thể kiểm tra cấu hình Git LFS hiện tại');
  }
} catch (err) {
  console.log('Git LFS không được cài đặt trên hệ thống này');
}

// Cập nhật package.json để thêm script sửa lỗi
try {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts['fix-lfs-issues']) {
    packageJson.scripts['fix-lfs-issues'] = 'node scripts/fix-git-lfs-issues.js';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log('Đã thêm script "fix-lfs-issues" vào package.json');
  }
} catch (err) {
  console.error('Không thể cập nhật package.json:', err.message);
}

// Thêm dòng để sửa lỗi vào run.bat
try {
  const runBatPath = path.join(rootDir, 'run.bat');
  if (fs.existsSync(runBatPath)) {
    let runBatContent = fs.readFileSync(runBatPath, 'utf8');
    
    // Kiểm tra xem đã có dòng gọi script chưa
    if (!runBatContent.includes('fix-git-lfs-issues.js')) {
      // Tìm dòng phù hợp để chèn thêm
      const insertAfter = 'Tao file .traceignore...';
      runBatContent = runBatContent.replace(
        insertAfter,
        `${insertAfter}\r\necho Dang sua loi dinh dang anh...\r\nnode scripts\\fix-git-lfs-issues.js`
      );
      
      fs.writeFileSync(runBatPath, runBatContent, 'utf8');
      console.log('Đã cập nhật run.bat để tự động sửa lỗi định dạng ảnh');
    }
  }
} catch (err) {
  console.error('Không thể cập nhật run.bat:', err.message);
}

console.log('='.repeat(50));
console.log(' Đã hoàn thành việc sửa lỗi định dạng ảnh');
console.log(' Lần tới khi tải ZIP từ Git, các file ảnh sẽ giữ nguyên định dạng');
console.log('='.repeat(50)); 