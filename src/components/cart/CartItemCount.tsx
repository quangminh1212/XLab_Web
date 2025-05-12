'use client';

import React from 'react';
import { useCart } from './CartContext';

export const CartItemCount = React.memo(() => {
  const { itemCount } = useCart();
  
  if (!itemCount || itemCount === 0) {
    return (
      <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
        0
      </span>
    );
  }
  
  return (
    <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
      {itemCount > 99 ? '99+' : itemCount}
    </span>
  );
});

CartItemCount.displayName = 'CartItemCount';

export default CartItemCount; 