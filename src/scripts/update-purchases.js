/**
 * Script tự động chạy để cập nhật số lượt mua hàng ngày
 * Có thể chạy script này thông qua cronjob hàng ngày
 *
 * Ví dụ cài đặt cron job trên server Linux:
 * 0 0 * * * node /path/to/update-purchases.js
 */

const fetch = require('node-fetch');

// URL API cập nhật số lượt mua
const API_URL = 'http://localhost:3000/api/admin/products/update-purchases';
const AUTH_KEY = process.env.UPDATE_PURCHASES_AUTH_KEY;
if (!AUTH_KEY) {
  console.error('UPDATE_PURCHASES_AUTH_KEY is required in environment variables');
  process.exit(1);
}

async function updatePurchases() {
  try {
    console.log('Đang cập nhật số lượt mua hàng ngày...');

    const response = await fetch(`${API_URL}?authKey=${AUTH_KEY}`);
    const data = await response.json();

    if (data.success) {
      console.log('✅', data.message);
    } else {
      console.error('❌ Lỗi:', data.error);
    }
  } catch (error) {
    console.error('❌ Lỗi khi gọi API cập nhật số lượt mua:', error);
  }
}

// Chạy hàm cập nhật
updatePurchases();
