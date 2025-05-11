
// Timestamp Handler - Giúp xử lý các file có timestamp
// Thêm vào _app.js để bắt các request với timestamp và điều hướng về file gốc
console.log('Timestamp handler loaded');

// Hàm làm việc với các file có timestamp
function handleTimestampedAssets() {
  // Detect timestamp params in URLs and redirect
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('v')) {
    // Handle timestamp parameters
    console.log('Detected timestamp parameter in URL');
  }
}

// Export handler
export { handleTimestampedAssets };
