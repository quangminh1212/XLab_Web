'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icons, IconProps, Characters, Layout, Colors } from '@/shared/symbols';

// Define button variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

// Define button sizes
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Icons;
  iconPosition?: 'left' | 'right';
  iconProps?: Omit<IconProps, 'className'>;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

// Helper function to get the button classes based on variant and size
const getButtonClasses = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  fullWidth: boolean = false,
  disabled: boolean = false
): string => {
  
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Size classes
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 py-2.5 text-lg',
  }[size];
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus-visible:ring-primary-500 shadow-sm disabled:from-primary-400 disabled:to-primary-500',
    secondary: 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 hover:from-slate-200 hover:to-slate-300 focus-visible:ring-slate-500 shadow-sm disabled:from-slate-50 disabled:to-slate-100 dark:from-slate-800 dark:to-slate-700 dark:text-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600',
    outline: 'border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-500 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-500 dark:text-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus-visible:ring-red-500 shadow-sm',
  }[variant];
  
  return `${baseClasses} ${widthClasses} ${sizeClasses} ${variantClasses}`;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  iconProps,
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Determine if button is disabled
  const isDisabled = disabled || isLoading;
  
  // Get the classes based on props
  const classes = getButtonClasses(variant, size, fullWidth, isDisabled);
  
  // Get the icon element if provided
  const IconComponent = icon ? Icons[icon] : null;
  const iconSize = size === 'lg' ? 20 : size === 'sm' ? 16 : 18;
  
  // Define common icon classes
  const iconClasses = size === 'sm' ? 'mr-1.5' : 'mr-2';
  const rightIconClasses = size === 'sm' ? 'ml-1.5' : 'ml-2';
  
  return (
    <button 
      className={`${classes} ${className}`}
      disabled={isDisabled} 
      {...props}
    >
      {isLoading ? (
        <>
          <Icons.Search className={iconClasses} size={iconSize} />
          {typeof children === 'string' ? 'Đang xử lý...' : children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && IconComponent && (
            <IconComponent 
              className={iconClasses} 
              size={iconSize}
              {...iconProps} 
            />
          )}
          
          {children}
          
          {icon && iconPosition === 'right' && IconComponent && (
            <IconComponent 
              className={rightIconClasses} 
              size={iconSize}
              {...iconProps} 
            />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
