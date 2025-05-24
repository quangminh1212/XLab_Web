#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🚀 Đang khởi động XLab Web Development Server...');

// Set environment variables để tắt telemetry và cache
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.SWC_DISABLE_CACHE = '1';

// Khởi động next dev trực tiếp với environment variables
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1',
    SWC_DISABLE_CACHE: '1'
  }
});

nextProcess.on('close', (code) => {
  console.log(`Development server đã dừng với code: ${code}`);
});

nextProcess.on('error', (err) => {
  console.error('Lỗi khởi động server:', err.message);
});

// Xử lý tín hiệu dừng
process.on('SIGINT', () => {
  console.log('\n⏹️ Đang dừng development server...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
}); 