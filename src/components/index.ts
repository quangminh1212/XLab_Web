/**
 * Main components export file
 * 
 * This file exports all components in a structured way to simplify imports
 * throughout the application. Components are organized by category.
 */

// Layout components
export * from './layout';

// Common components
export * from './common';

// Product related components
export * from './product';
export { default as ProductImage } from './ProductImage';

// Authentication components
export * from './auth';
export { default as withAdminAuth } from './withAdminAuth';

// Shopping cart components
export * from './cart';

// Payment components
export * from './payment';

// Admin components
export * from './admin';

// Home page components
export * from './home';

// Language switcher
export { default as LanguageSwitcher } from './LanguageSwitcher';
