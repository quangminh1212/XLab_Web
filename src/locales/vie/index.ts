import { auth } from './auth';
import { common } from './common';
import { account } from './account';
import { contact } from './contact';
import { cart } from './cart';
import { footer } from './footer';
import { home } from './home';
import { product } from './product';
import { admin } from './admin';
import { terms } from './terms';
import { warranty } from './warranty';
import { testimonials } from './testimonials';
import { notifications } from './notifications';
import { orders } from './orders';

export const vie = {
  ...auth,
  ...common,
  ...account,
  ...contact,
  ...cart,
  ...footer,
  ...home,
  ...product,
  ...admin,
  ...terms,
  ...warranty,
  ...testimonials,
  ...notifications,
  ...orders
}; 