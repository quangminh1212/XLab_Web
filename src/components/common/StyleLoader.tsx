import React from 'react';
import Head from 'next/head';

/**
 * StyleLoader component to ensure CSS styles are loaded correctly without 404 errors
 */
export const StyleLoader: React.FC = () => {
  return (
    <Head>
      <style jsx global>{`
        /* Inline critical CSS for initial render - ensures styles are loaded */
        body {
          font-family: var(--font-inter, ui-sans-serif, system-ui);
          background-color: rgb(249, 250, 251);
        }
        
        /* Fix for vendor CSS */
        .vendors-css-loaded {
          display: block;
        }
      `}</style>
    </Head>
  );
};

export default StyleLoader; 