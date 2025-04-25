import '../lib/web-polyfill';
import '../lib/useIsomorphicLayoutEffect';
import { AppProps } from 'next/app';

/**
 * App component - Entry point cho ứng dụng Next.js
 * Sử dụng polyfill cho web API và hook sửa lỗi useLayoutEffect
 */
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp; 