const fs = require('fs');
const path = require('path');

console.log('🔍 Bắt đầu quét và sửa lỗi so sánh ngôn ngữ...');

// Danh sách các thư mục cần quét
const directories = [
  'src/app',
  'src/components',
  'src/contexts'
];

// Hàm đệ quy để tìm file TypeScript/TSX
function findTSFiles(dir) {
  let files = [];
  try {
    if (!fs.existsSync(dir)) return files;

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'node_modules' && !item.startsWith('.')) {
        files = [...files, ...findTSFiles(fullPath)];
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`⚠️  Không thể đọc thư mục: ${dir}`);
  }
  return files;
}

// Tìm tất cả file TypeScript/TSX
let tsFiles = [];
directories.forEach(dir => {
  const fullDir = path.join(process.cwd(), dir);
  const files = findTSFiles(fullDir);
  tsFiles = [...tsFiles, ...files];
});

console.log(`🔍 Đã tìm thấy ${tsFiles.length} file TypeScript/TSX để kiểm tra`);

let fixedFiles = 0;
let totalIssuesFixed = 0;

// Biểu thức chính quy để tìm và thay thế
const patterns = [
  {
    // language === 'vi' hoặc language === "vi"
    pattern: /language\s*===\s*(['"])vi\1/g,
    replacement: 'localCode === $1vi$1'
  },
  {
    // language === 'en' hoặc language === "en"
    pattern: /language\s*===\s*(['"])en\1/g,
    replacement: 'localCode === $1en$1'
  },
  {
    // (language === 'vi') hoặc (language === "vi")
    pattern: /\(language\s*===\s*(['"])vi\1\)/g,
    replacement: '(localCode === $1vi$1)'
  },
  {
    // (language === 'en') hoặc (language === "en")
    pattern: /\(language\s*===\s*(['"])en\1\)/g,
    replacement: '(localCode === $1en$1)'
  },
  {
    // Đảm bảo import localCode từ useLanguage nếu chưa có
    pattern: /const\s*{\s*language\s*,\s*t\s*}\s*=\s*useLanguage\(\);/g,
    replacement: 'const { language, t, localCode } = useLanguage();'
  },
  {
    // Đảm bảo import localCode từ useLanguage nếu chưa có (trường hợp có thêm biến khác)
    pattern: /const\s*{\s*language\s*,\s*t\s*,\s*([^}]+)\s*}\s*=\s*useLanguage\(\);/g,
    replacement: 'const { language, t, $1, localCode } = useLanguage();'
  }
];

// Quét và sửa từng file
tsFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    let fileFixed = false;
    let fileIssuesFixed = 0;

    // Áp dụng tất cả các mẫu thay thế
    patterns.forEach(({ pattern, replacement }) => {
      // Đếm số lần xuất hiện trước khi thay thế
      const matches = content.match(pattern);
      const matchCount = matches ? matches.length : 0;
      
      if (matchCount > 0) {
        content = content.replace(pattern, replacement);
        fileFixed = true;
        fileIssuesFixed += matchCount;
      }
    });

    // Chỉ ghi lại file nếu có sự thay đổi
    if (fileFixed) {
      fs.writeFileSync(file, content, 'utf8');
      fixedFiles++;
      totalIssuesFixed += fileIssuesFixed;
      console.log(`✅ Đã sửa ${fileIssuesFixed} vấn đề trong: ${path.relative(process.cwd(), file)}`);
    }
  } catch (error) {
    console.error(`❌ Lỗi khi xử lý file ${file}:`, error);
  }
});

console.log(`\n✨ Hoàn tất! Đã sửa ${totalIssuesFixed} vấn đề trong ${fixedFiles} file.`);

// Thêm thông báo nếu không tìm thấy vấn đề nào
if (fixedFiles === 0) {
  console.log('👍 Không tìm thấy vấn đề nào cần sửa chữa.');
} 