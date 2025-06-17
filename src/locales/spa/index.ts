import { auth } from './auth';
import { common } from './common';
import { cart } from './cart';
import { home } from './home';
import { product } from './product';

export const spa = {
  ...auth,
  ...common,
  ...cart,
  ...home,
  ...product
}; 