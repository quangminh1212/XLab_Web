// Danh sách các route không cần static generation
export const dynamicRoutes = [
  '/login',
  '/register',
  '/auth-test',
  '/test-image',
  '/privacy',
  '/payment/success',
  '/payment/checkout',
  '/auth/error',
  '/admin',
  '/_not-found',
  '/404'
];

// Export một đối tượng cấu hình cho các route
export const routeConfig = dynamicRoutes.reduce((acc, route) => {
  acc[route] = { dynamic: 'force-dynamic' };
  return acc;
}, {}); 