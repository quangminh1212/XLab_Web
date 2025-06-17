import { auth } from './auth';
import { common } from './common';
import { cart } from './cart';
import { home } from './home';
import { product } from './product';
import { account } from './account';
import { admin } from './admin';
import { about } from './about';
import { contact } from './contact';
import { coupon } from './coupon';
import { footer } from './footer';
import { notifications } from './notifications';
import { orders } from './orders';
import { payment } from './payment';
import { placeholder } from './placeholder';
import { products } from './products';
import { services } from './services';
import { support } from './support';
import { system } from './system';
import { terms } from './terms';
import { test } from './test';
import { testimonials } from './testimonials';
import { voucher } from './voucher';
import { warranty } from './warranty';

export const spa = {
  ...auth,
  ...common,
  ...cart,
  ...home,
  ...product,
  ...account,
  ...admin,
  ...about,
  ...contact,
  ...coupon,
  ...footer,
  ...notifications,
  ...orders,
  ...payment,
  ...placeholder,
  ...products,
  ...services,
  ...support,
  ...system,
  ...terms,
  ...test,
  ...testimonials,
  ...voucher,
  ...warranty
}; 