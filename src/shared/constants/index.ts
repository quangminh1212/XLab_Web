// API Constants
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  AUTH: '/api/auth',
  CART: '/api/cart',
  ADMIN: '/api/admin',
} as const

// UI Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const

// Validation Constants
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_MAX_LENGTH: 255,
  NAME_MAX_LENGTH: 100,
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ADMIN: '/admin',
  PROFILE: '/account',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'xlab_cart',
  USER_PREFERENCES: 'xlab_user_preferences',
  THEME: 'xlab_theme',
} as const 