import admin from './admin';
import terms from './terms';
import nav from './nav';
import home from './home';
import common from './common';
import footer from './footer';
import product from './product';

// Combine all translations
const en = {
  ...admin,
  ...terms,
  ...nav,
  ...home,
  ...common,
  ...footer,
  ...product,
};

export default en; 