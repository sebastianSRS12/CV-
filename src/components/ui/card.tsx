import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'filled' | 'elevated';
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      outline: 'bg-transparent border border-gray-200 dark:border-gray-700',
      filled: 'bg-gray-50 dark:bg-gray-800/50',
      elevated: 'bg-white dark:bg-gray-800 shadow-lg border border-transparent',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg overflow-hidden',
          'transition-all duration-200',
          variants[variant],
          hoverable && 'hover:shadow-md dark:hover:shadow-gray-800/50',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 p-6',
        'border-b border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Tag = 'h3', ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-tight tracking-tight',
        'text-gray-900 dark:text-white',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm text-gray-500 dark:text-gray-400',
        'leading-relaxed',
        className
      )}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn('p-6', className)} 
      {...props} 
    />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center p-6 pt-0',
        'border-t border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
export type { CardProps, CardTitleProps };
