// Helper tạo nonce và CSP header an toàn theo môi trường

export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  // Middleware/App Router chạy trên runtime có Web Crypto
  crypto.getRandomValues(bytes);
  // Trả về chuỗi hex an toàn (không cần btoa, tránh noUncheckedIndexedAccess)
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

export function buildCSP(nonce: string, isProd: boolean, strictStyles: boolean = false): string {
  // Lưu ý:
  // - Tạm thời giữ 'unsafe-inline' cho script để tránh phá vỡ nếu có inline script của framework/chưa gắn nonce đầy đủ.
  // - Dev: cho phép 'unsafe-eval' để hỗ trợ sourcemap/eval.
  // - Dần dần có thể bỏ 'unsafe-inline' sau khi gắn nonce cho mọi inline scripts (nếu có).
  const scriptSrc = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"].concat(
    isProd ? [] : ["'unsafe-eval'"]
  );
  // Style: ở prod có thể bật strict để bỏ 'unsafe-inline'
  const styleSrc = strictStyles ? ["'self'", `'nonce-${nonce}'`] : ["'self'", "'unsafe-inline'"];

  const connectBase = ["'self'", 'https:'].concat(isProd ? [] : ['ws:', 'http:']);

  return [
    "default-src 'self'",
    "base-uri 'self'",
    // Ảnh: prod chỉ https, dev cho phép http để test local
    isProd ? "img-src 'self' data: blob: https:" : "img-src 'self' data: blob: https: http:",
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    "font-src 'self' data:",
    `connect-src ${connectBase.join(' ')}`,
    "frame-ancestors 'none'",
    "object-src 'none'",
    // Bổ sung các directive an toàn
    "form-action 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join('; ');
}

