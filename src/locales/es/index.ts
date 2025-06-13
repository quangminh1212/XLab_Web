import admin from './admin';
import terms from './terms';
import nav from './nav';
import home from './home';
import common from './common';
import footer from './footer';

// Combinar todas las traducciones
const es = {
  ...admin,
  ...terms,
  ...nav,
  ...home,
  ...common,
  ...footer,
};

export default es; 