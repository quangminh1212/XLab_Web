const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Màu sắc cho console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}=== Bắt đầu kiểm tra và sửa lỗi bảo mật ===${colors.reset}\n`);

// Kiểm tra và cập nhật các phụ thuộc có lỗi bảo mật
console.log(`${colors.yellow}Kiểm tra các phụ thuộc có lỗi bảo mật...${colors.reset}`);
try {
  console.log(execSync('npm audit').toString());
  console.log(`${colors.green}Đang cố gắng sửa các lỗi bảo mật không phá vỡ dự án...${colors.reset}`);
  console.log(execSync('npm audit fix').toString());
  console.log(`${colors.yellow}Lưu ý: Một số lỗi bảo mật có thể yêu cầu cập nhật thủ công.${colors.reset}`);
} catch (error) {
  console.log(`${colors.red}Lỗi khi kiểm tra bảo mật: ${error.message}${colors.reset}`);
}

// Kiểm tra file .env.local
console.log(`\n${colors.yellow}Kiểm tra file .env.local...${colors.reset}`);
if (!fs.existsSync(path.join(process.cwd(), '.env.local'))) {
  console.log(`${colors.red}Không tìm thấy file .env.local. Đang tạo từ .env.example...${colors.reset}`);
  try {
    if (fs.existsSync(path.join(process.cwd(), '.env.example'))) {
      fs.copyFileSync(
        path.join(process.cwd(), '.env.example'),
        path.join(process.cwd(), '.env.local')
      );
      console.log(`${colors.green}Đã tạo .env.local từ .env.example${colors.reset}`);
      console.log(`${colors.yellow}Hãy cập nhật các giá trị trong .env.local với thông tin thực tế${colors.reset}`);
    } else {
      console.log(`${colors.red}Không tìm thấy .env.example để tạo .env.local${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}Lỗi khi tạo .env.local: ${error.message}${colors.reset}`);
  }
} else {
  console.log(`${colors.green}File .env.local đã tồn tại.${colors.reset}`);
}

// Kiểm tra NEXTAUTH_SECRET trong .env.local
console.log(`\n${colors.yellow}Kiểm tra NEXTAUTH_SECRET trong .env.local...${colors.reset}`);
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
  if (!envContent.includes('NEXTAUTH_SECRET=') || envContent.includes('NEXTAUTH_SECRET=your-secret-key')) {
    console.log(`${colors.red}NEXTAUTH_SECRET không được cấu hình đúng trong .env.local${colors.reset}`);
    console.log(`${colors.yellow}Hãy cập nhật NEXTAUTH_SECRET với một chuỗi ngẫu nhiên an toàn${colors.reset}`);
  } else {
    console.log(`${colors.green}NEXTAUTH_SECRET đã được cấu hình.${colors.reset}`);
  }
} catch (error) {
  console.log(`${colors.red}Lỗi khi kiểm tra NEXTAUTH_SECRET: ${error.message}${colors.reset}`);
}

// Kiểm tra các lỗi ESLint
console.log(`\n${colors.yellow}Kiểm tra các lỗi ESLint...${colors.reset}`);
try {
  execSync('npm run lint');
  console.log(`${colors.green}Không có lỗi ESLint nghiêm trọng.${colors.reset}`);
} catch (error) {
  console.log(`${colors.red}Có lỗi ESLint. Đang cố gắng sửa...${colors.reset}`);
  try {
    execSync('npm run lint:fix');
    console.log(`${colors.green}Đã cố gắng sửa các lỗi ESLint tự động.${colors.reset}`);
  } catch (fixError) {
    console.log(`${colors.red}Không thể sửa tất cả các lỗi ESLint tự động: ${fixError.message}${colors.reset}`);
  }
}

// Kiểm tra cấu hình Content Security Policy
console.log(`\n${colors.yellow}Kiểm tra cấu hình Content Security Policy...${colors.reset}`);
try {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  if (!nextConfigContent.includes('Content-Security-Policy')) {
    console.log(`${colors.red}Không tìm thấy cấu hình Content-Security-Policy trong next.config.js${colors.reset}`);
    console.log(`${colors.yellow}Hãy thêm header Content-Security-Policy vào next.config.js${colors.reset}`);
  } else {
    console.log(`${colors.green}Đã tìm thấy cấu hình Content-Security-Policy.${colors.reset}`);
  }
} catch (error) {
  console.log(`${colors.red}Lỗi khi kiểm tra cấu hình CSP: ${error.message}${colors.reset}`);
}

console.log(`\n${colors.bright}${colors.green}=== Hoàn thành kiểm tra và sửa lỗi bảo mật ===${colors.reset}`);
console.log(`${colors.yellow}Lưu ý: Một số vấn đề có thể cần được giải quyết thủ công.${colors.reset}`);
