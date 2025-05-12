// API Routes cho frontend
const API_ROUTES = {
  // Auth
  AUTH: {
    SESSION: '/api/auth/session',
    SIGNIN: '/api/auth/signin',
    SIGNOUT: '/api/auth/signout',
    CALLBACK: '/api/auth/callback',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    CREATE: '/api/products/new',
  },
  
  // Orders
  ORDERS: {
    LIST: '/api/orders',
    HISTORY: '/api/orders/history',
    DETAIL: (id: string) => `/api/orders/${id}`,
    CREATE: '/api/orders/create',
  },
  
  // Cart
  CART: {
    ADD: '/api/cart/add',
  },
  
  // Admin
  ADMIN: {
    PRODUCTS: {
      LIST: '/api/admin/products',
      DETAIL: (id: string) => `/api/admin/products/${id}`,
      UPDATE: (id: string) => `/api/admin/products/${id}`,
      DELETE: (id: string) => `/api/admin/products/${id}`,
    },
    ORDERS: {
      LIST: '/api/admin/orders',
      DETAIL: (id: string) => `/api/admin/orders/${id}`,
      UPDATE: (id: string) => `/api/admin/orders/${id}`,
    },
    USERS: {
      LIST: '/api/admin/users',
      DETAIL: (id: string) => `/api/admin/users/${id}`,
    },
    SETTINGS: '/api/admin/settings',
  },
};

export default API_ROUTES; 