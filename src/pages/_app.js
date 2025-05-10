import { useEffect } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Load timestamp handler script
    const script = document.createElement('script');
    script.src = '/timestamp-handler.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;