import '../lib/web-polyfill';
import '../lib/useIsomorphicLayoutEffect';
import '../app/globals.css';

/**
 * App component - Entry point cho ứng dụng Next.js
 * Sử dụng polyfill cho web API và hook sửa lỗi useLayoutEffect
 */
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
