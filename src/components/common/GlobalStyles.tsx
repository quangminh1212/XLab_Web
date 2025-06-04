'use client';

import React from 'react';

export default function GlobalStyles() {
  return (
    <style jsx global>{`
      /* Critical CSS for immediate render */
      body {
        font-family: var(--font-inter, ui-sans-serif, system-ui);
        background-color: rgb(249, 250, 251);
      }

      /* Custom CSS fallback for CSS files that might be missing */
      .vendors-css-fallback,
      .app-layout-css-fallback {
        display: block;
      }
    `}</style>
  );
}
