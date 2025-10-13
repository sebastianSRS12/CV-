import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    ...props
  }, ref) => {
    // Base styles that apply to all buttons
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-md transition-all',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:outline-none',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      'dark:focus:ring-offset-gray-900',
      'bg-neutral-200 text-neutral-900 border border-neutral-300',
      fullWidth ? 'w-full' : '',
    ];
    
    // Variant styles
    const variants = {
      primary: [
        'bg-indigo-600 text-white',
        'hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600',
        'focus:ring-indigo-500 dark:ring-offset-gray-900',
        'shadow-sm hover:shadow-md',
      ],
      secondary: [
        'bg-gray-100 text-gray-800',
        'hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
        'focus:ring-gray-300 dark:ring-offset-gray-900',
        'shadow-sm hover:shadow',
      ],
      outline: [
        'border border-gray-300 bg-white text-gray-700',
        'hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200',
        'focus:ring-indigo-500 dark:ring-offset-gray-900',
        'shadow-sm',
      ],
      ghost: [
        'text-gray-700 hover:bg-gray-100',
        'dark:text-gray-200 dark:hover:bg-gray-800',
        'focus:ring-indigo-500 dark:ring-offset-gray-900',
      ],
      danger: [
        'bg-red-600 text-white',
        'hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600',
        'focus:ring-red-500 dark:ring-offset-gray-900',
        'shadow-sm hover:shadow-md',
      ],
      link: [
        'text-indigo-600 hover:text-indigo-800',
        'dark:text-indigo-400 dark:hover:text-indigo-300',
        'underline-offset-4 hover:underline',
        'focus:ring-0 focus:ring-offset-0',
      ],
    };

    // Size styles
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    // Combine all classes
    const buttonClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClasses}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2 -ml-1">{leftIcon}</span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2 -mr-1">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
