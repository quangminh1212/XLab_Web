/**
 * Utility to handle CSS loading errors in Next.js
 * This prevents 404 errors for CSS files that don't exist by intercepting requests
 */

export function setupCssErrorHandler() {
  if (typeof window !== 'undefined') {
    // Intercept fetch requests for CSS files
    const originalFetch = window.fetch;
    window.fetch = function (url: RequestInfo | URL, options?: RequestInit) {
      if (
        typeof url === 'string' &&
        (url.includes('/static/css/vendors.css') || url.includes('/static/css/app/layout.css'))
      ) {
        // Return an empty CSS file instead of 404
        return Promise.resolve(
          new Response('/* Empty CSS */', {
            status: 200,
            headers: { 'Content-Type': 'text/css' },
          }),
        );
      }

      // Otherwise, proceed with the original fetch
      return originalFetch.call(window, url, options);
    };

    // Handle link errors for CSS files
    window.addEventListener(
      'error',
      function (event) {
        const target = event.target as HTMLElement;
        if (
          target &&
          target.tagName === 'LINK' &&
          (target as HTMLLinkElement).rel === 'stylesheet'
        ) {
          const href = (target as HTMLLinkElement).href || '';
          if (href.includes('/static/css/') && href.includes('.css')) {
            // Prevent the error from propagating
            event.preventDefault();
            console.log('Handled CSS load error:', href);
          }
        }
      },
      true,
    );
  }
}

export default setupCssErrorHandler;
