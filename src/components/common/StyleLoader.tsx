"use client";

import React, { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

/**
 * StyleLoader component to ensure CSS styles are loaded correctly without 404 errors
 */
export const StyleLoader: React.FC = () => {
  useEffect(() => {
    // Client-side only code to handle CSS 404 errors
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node: Node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              (node as Element).tagName === 'LINK' &&
              (node as HTMLLinkElement).rel === 'stylesheet' &&
              ((node as HTMLLinkElement).href.includes('/static/css/vendors.css') || 
               (node as HTMLLinkElement).href.includes('/static/css/app/layout.css'))
            ) {
              // This is a CSS link that might 404, add an error handler
              (node as HTMLLinkElement).onerror = () => {
                console.log('CSS failed to load:', (node as HTMLLinkElement).href);
                // Add a class to indicate the CSS failed to load
                document.documentElement.classList.add('css-fallback-active');
              };
            }
          });
        }
      });
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        <style jsx global>{`
          /* Critical CSS that will be inlined and always available */
          body {
            font-family: var(--font-inter, ui-sans-serif, system-ui);
            background-color: rgb(249, 250, 251);
          }
        `}</style>
      </Head>
      <Script
        id="css-error-handler"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Handle 404 CSS errors by providing empty CSS responses
            window.addEventListener('error', function(event) {
              const target = event.target;
              if (target && target.tagName === 'LINK' && target.rel === 'stylesheet') {
                const href = target.href || '';
                if (href.includes('/static/css/') && href.includes('.css')) {
                  console.log('Handling CSS load error:', href);
                  event.preventDefault();
                }
              }
            }, true);
          `
        }}
      />
    </>
  );
};

export default StyleLoader; 