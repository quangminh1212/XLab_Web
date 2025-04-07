/**
 * Script kiểm tra phiên bản Node.js
 */
const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = parseInt(semver[0], 10);
const minor = parseInt(semver[1], 10);

console.log(`Kiểm tra phiên bản Node.js: ${currentNodeVersion}`);

// Kiểm tra phiên bản tối thiểu là Node.js 16
if (major < 16) {
  console.error(
    `Bạn đang sử dụng Node.js ${currentNodeVersion}.\n` +
    `Dự án này yêu cầu Node.js 16 hoặc mới hơn.\n` +
    `Vui lòng cập nhật phiên bản Node.js của bạn.`
  );
  process.exit(1);
}

// Đối với Windows, có thể cần thêm các xử lý đặc biệt
if (process.platform === 'win32') {
  if (major < 18) {
    console.warn(
      `Lưu ý: Bạn đang sử dụng Node.js ${currentNodeVersion} trên Windows.\n` +
      `Một số tính năng có thể không hoạt động như mong đợi. Khuyến nghị sử dụng Node.js 18 hoặc mới hơn.`
    );
  }
  
  // Kiểm tra xem có sử dụng nullish coalescing operator hay optional chaining không
  try {
    // Thử đánh giá một biểu thức với toán tử nullish coalescing
    eval('const test = null ?? "default"');
    console.log('✅ Trình biên dịch hỗ trợ toán tử nullish coalescing (??)')
  } catch (e) {
    console.error(
      '❌ Phiên bản Node.js của bạn không hỗ trợ toán tử nullish coalescing (??).\n' +
      'Điều này có thể gây ra lỗi khi chạy dự án.\n' +
      'Vui lòng cập nhật lên Node.js 14 hoặc mới hơn.'
    );
    process.exit(1);
  }
  
  try {
    // Thử đánh giá một biểu thức với toán tử optional chaining
    eval('const obj = {}; const test = obj?.property');
    console.log('✅ Trình biên dịch hỗ trợ toán tử optional chaining (?.)')
  } catch (e) {
    console.error(
      '❌ Phiên bản Node.js của bạn không hỗ trợ toán tử optional chaining (?).\n' +
      'Điều này có thể gây ra lỗi khi chạy dự án.\n' +
      'Vui lòng cập nhật lên Node.js 14 hoặc mới hơn.'
    );
    process.exit(1);
  }
  
  try {
    // Thử đánh giá một biểu thức với toán tử logical OR assignment
    eval('let a = null; a = a || "default"');
    console.log('✅ Trình biên dịch hỗ trợ toán tử logical OR assignment (||=)')
  } catch (e) {
    console.error(
      '❌ Phiên bản Node.js của bạn không hỗ trợ toán tử logical OR assignment (||=).\n' +
      'Điều này có thể gây ra lỗi "Unexpected token \'||\'"\n' +
      'Vui lòng cập nhật lên Node.js 16 hoặc mới hơn, hoặc sửa các toán tử ||= thành a = a || "default".'
    );
    // Không exit ngay, chỉ cảnh báo
  }
}

console.log('✅ Kiểm tra phiên bản Node.js hoàn tất'); 