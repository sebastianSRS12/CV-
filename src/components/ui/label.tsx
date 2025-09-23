import * as React from 'react';
import { cn } from '@/lib/utils/cn';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    required?: boolean;
    error?: boolean;
    disabled?: boolean;
  }
>(({ className, children, required, error, disabled, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium leading-6',
        'text-gray-900 dark:text-gray-100',
        error && 'text-red-600 dark:text-red-400',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-red-500 dark:text-red-400">*</span>
      )}
    </label>
  );
});

Label.displayName = 'Label';

export { Label };
