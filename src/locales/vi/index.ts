import admin from './admin';
import terms from './terms';
import nav from './nav';
import home from './home';
import common from './common';
import footer from './footer';
import product from './product';
import products from './products';
import about from './about';
import contact from './contact';
import privacy from './privacy';
import user from './user';

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
  ...about,
  ...contact,
  ...privacy,
  ...user,
};

export default vi; 