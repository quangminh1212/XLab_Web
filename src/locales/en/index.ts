import { admin } from './admin';
import { common } from './common';
import { home } from './home';
import { pages } from './pages';
import { auth } from './auth';
import { account } from './account';
import { products } from './products';

export const en = {
  ...admin,
  ...common,
  ...home,
  ...pages,
  ...auth,
  ...account,
  ...products,
}; 