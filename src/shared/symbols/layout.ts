/**
 * Layout constants and patterns
 * This file provides consistent spacing, sizing, and layout patterns
 */

// Core layout values
export const Layout = {
  // Spacing scale (in pixels)
  SPACING: {
    NONE: '0',
    XXS: '2px',
    XS: '4px',
    SM: '8px',
    MD: '16px',
    LG: '24px',
    XL: '32px',
    XXL: '48px',
    XXXL: '64px',
  },

  // Z-index values for consistent layering
  Z_INDEX: {
    BACKGROUND: -1,
    DEFAULT: 1,
    HOVER: 2,
    STICKY: 100,
    HEADER: 200,
    TOOLTIP: 300,
    DROPDOWN: 400,
    MODAL: 500,
    TOAST: 600,
    OVERLAY: 700,
    MAX: 9999,
  },

  // Responsive breakpoints (in pixels)
  BREAKPOINTS: {
    XS: 480,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
  },

  // Commonly used border radiuses
  BORDER_RADIUS: {
    NONE: '0px',
    XS: '2px',
    SM: '4px',
    MD: '8px',
    LG: '16px',
    XL: '24px',
    FULL: '9999px',
  },

  // Commonly used container max-widths
  CONTAINER: {
    XS: '100%',
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    XXL: '1536px',
  },

  // Shadow values for consistent elevation
  SHADOWS: {
    NONE: 'none',
    XS: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    SM: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    XXL: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Common transition speeds
  TRANSITION: {
    FAST: '100ms',
    NORMAL: '200ms',
    SLOW: '300ms',
    SLOWER: '500ms',
    SLOWEST: '700ms',
  },
}; 