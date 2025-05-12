'use client';

import { CartProvider as CartContextProvider } from './CartContext';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  return <CartContextProvider>{children}</CartContextProvider>;
};

export default CartProvider; 