import admin from './admin';
import terms from './terms';
import nav from './nav';
import home from './home';
import common from './common';
import footer from './footer';
import product from './product';
import products from './products';

// Kết hợp tất cả các phần dịch
const vi = {
  ...admin,
  ...terms,
  ...nav,
  ...home,
  ...common,
  ...footer,
  ...product,
  ...products,
};

export default vi; 