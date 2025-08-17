import '@testing-library/jest-dom';

// Giảm nhiễu log và tránh lỗi "Cannot log after tests are done"
const noop = () => {};
// Ghi đè console toàn cục sau khi môi trường test được khởi tạo
// Tránh dùng spyOn vì BufferedConsole của Jest vẫn có thể ném lỗi sau khi tests kết thúc
// (khi có log bất đồng bộ). Ghi đè trực tiếp sẽ an toàn hơn.
// Lưu ý: chỉ áp dụng trong môi trường test
// eslint-disable-next-line no-global-assign
console = { ...console, log: noop, warn: noop, error: noop } as Console;

