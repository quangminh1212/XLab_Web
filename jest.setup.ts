import '@testing-library/jest-dom';

// Giảm nhiễu log và tránh lỗi "Cannot log after tests are done"
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

