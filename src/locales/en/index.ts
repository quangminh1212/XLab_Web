// Imports
import translations from './translations';

// Import các namespace khi tạo thêm trong tương lai
// import account from './account';
// import admin from './admin';
// import auth from './auth';
// import common from './common';
// import home from './home';
// import pages from './pages';
// import products from './products';

// Gộp tất cả các namespace
const en = {
  ...translations,
  // Thêm các namespace khác khi cần
  // ...account,
  // ...admin,
  // ...auth,
  // ...common,
  // ...home,
  // ...pages,
  // ...products
};

export default en; 