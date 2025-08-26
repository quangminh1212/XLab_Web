export function buildCsp(isProd: boolean): string {
  // Cập nhật whitelist theo nhu cầu thực tế (CDN, analytics, fonts...)
  const self = "'self'";
  const unsafeInline = "'unsafe-inline'"; // cân nhắc loại bỏ nếu có thể

  // Whitelists ví dụ: cập nhật từ env nếu cần
  const imgHosts = [self, 'data:', 'blob:', 'https:'];
  const scriptHosts = [self, unsafeInline];
  const styleHosts = [self, unsafeInline];
  const fontHosts = [self, 'data:'];
  const connectHosts = [self, 'https:'];
  const _frameAncestors = [self];

  // Cho phép bổ sung domain động qua ENV, ví dụ: CDN_SCRIPT_HOSTS, IMG_HOSTS,
  function fromEnv(name: string) {
    return (process.env[name] || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const scriptExtra = fromEnv('CDN_SCRIPT_HOSTS');
  const imgExtra = fromEnv('CDN_IMG_HOSTS');
  const styleExtra = fromEnv('CDN_STYLE_HOSTS');
  const connectExtra = fromEnv('CONNECT_HOSTS');
  const fontExtra = fromEnv('CDN_FONT_HOSTS');

  const csp = [
    `default-src ${self}`,
    `base-uri ${self}`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `img-src ${[...imgHosts, ...imgExtra].join(' ')}`,
    `script-src ${[...scriptHosts, ...scriptExtra].join(' ')}`,
    `style-src ${[...styleHosts, ...styleExtra].join(' ')}`,
    `font-src ${[...fontHosts, ...fontExtra].join(' ')}`,
    `connect-src ${[...connectHosts, ...connectExtra].join(' ')}`,
    `form-action ${self}`,
  ].join('; ');

  return isProd ? csp : '';
}

