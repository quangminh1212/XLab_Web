/**
 * Script sửa lỗi cho Windows 10
 */
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const exists = util.promisify(fs.exists);

const MODULES_PATH = path.join(process.cwd(), 'node_modules');

async function patchFile(filePath, searchFunction, replaceFunction) {
  try {
    if (!await exists(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    let content = await readFile(filePath, 'utf8');
    const original = content;
    
    // Tìm và thay thế nội dung
    content = searchFunction(content);
    
    // Nếu có thay đổi, ghi lại file
    if (content !== original) {
      await writeFile(filePath, content, 'utf8');
      console.log(`✅ Patched: ${filePath}`);
    } else {
      console.log(`ℹ️ No change needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error patching ${filePath}:`, error);
  }
}

async function fixRequireHook() {
  const filePath = path.join(MODULES_PATH, 'next', 'dist', 'server', 'require-hook.js');
  await patchFile(filePath, (content) => {
    // Kiểm tra xem có dòng __non_webpack_require__ không
    if (content.includes('__non_webpack_require__')) {
      // Thay thế tất cả các trường hợp của __non_webpack_require__ bằng một biểu thức an toàn hơn
      return content.replace(
        /let resolve = process\.env\.NEXT_MINIMAL \? __non_webpack_require__\.resolve : require\.resolve;/g,
        'let resolve = require.resolve;'
      );
    }
    return content;
  });
}

async function fixJSONParse() {
  // Sửa lỗi JSON.parse trong file webpack
  const webpackFiles = [
    path.join(MODULES_PATH, 'next', 'dist', 'compiled', 'webpack', 'bundle5.js'),
    path.join(MODULES_PATH, 'webpack', 'lib', 'NormalModule.js')
  ];
  
  for (const filePath of webpackFiles) {
    await patchFile(filePath, (content) => {
      // Tìm các lỗi tiềm ẩn với JSON.parse và thêm kiểm tra
      return content.replace(
        /JSON\.parse\(([^)]+)\)/g, 
        'JSON.parse($1 || "{}")'
      );
    });
  }
}

async function fixWindowsPathIssues() {
  // Sửa lỗi đường dẫn trên Windows
  const pathFiles = [
    path.join(MODULES_PATH, 'next', 'dist', 'server', 'utils.js'),
    path.join(MODULES_PATH, 'next', 'dist', 'server', 'load-components.js')
  ];
  
  for (const filePath of pathFiles) {
    await patchFile(filePath, (content) => {
      // Đảm bảo đường dẫn Windows được xử lý đúng
      return content
        .replace(/path\.join\(([^)]+)\)/g, 'path.join($1).replace(/\\\\/g, "/")')
        .replace(/path\.resolve\(([^)]+)\)/g, 'path.resolve($1).replace(/\\\\/g, "/")');
    });
  }
}

async function main() {
  console.log('🛠️ Starting Windows 10 Next.js fixes...');
  
  await fixRequireHook();
  await fixJSONParse();
  await fixWindowsPathIssues();
  
  console.log('✅ All fixes applied!');
}

main().catch(err => {
  console.error('❌ Error in fix script:', err);
  process.exit(1);
}); 