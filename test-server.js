const http = require('http');

console.log('Kiểm tra kết nối tới http://localhost:3001/...');

http.get('http://localhost:3001/', (res) => {
  console.log('Status Code:', res.statusCode);
  
  if (res.statusCode === 200) {
    console.log('Kết nối thành công! Trang web đã hoạt động.');
  } else if (res.statusCode === 404) {
    console.log('Lỗi 404: Không tìm thấy trang.');
  } else {
    console.log(`Nhận được mã trạng thái: ${res.statusCode}`);
  }
  
  process.exit(0);
}).on('error', (e) => {
  console.error('Lỗi kết nối:', e.message);
  console.log('Hãy chắc chắn rằng máy chủ Next.js đang chạy.');
  process.exit(1);
}); 