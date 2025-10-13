import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    helperText,
    id,
    fullWidth = true,
    leftIcon,
    rightIcon,
    containerClassName,
    labelClassName,
    inputClassName,
    disabled,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className={cn(
        'relative',
        fullWidth ? 'w-full' : 'w-auto',
        containerClassName
      )}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-1',
              'text-gray-700 dark:text-gray-300',
              hasError && 'text-red-700 dark:text-red-400',
              disabled && 'opacity-60',
              labelClassName
            )}
          >
            {label}
            {props.required && (
              <span className="text-red-500 dark:text-red-400 ml-1">*</span>
            )}
          </label>
        )}
        
        <div className="relative rounded-md shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                {leftIcon}
              </span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
            className={cn(
              'block w-full rounded-md border-0 py-1.5',
              'text-gray-900 dark:text-gray-100',
              'bg-white dark:bg-gray-800',
              'ring-1 ring-inset',
              'focus:ring-2 focus:ring-inset focus:ring-indigo-500',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'sm:text-sm sm:leading-6',
              'transition-colors duration-200',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-3',
              rightIcon ? 'pr-10' : 'pr-3',
              hasError
                ? 'ring-red-300 focus:ring-red-500 text-red-900 dark:ring-red-700 dark:focus:ring-red-500 dark:text-red-100'
                : 'ring-gray-300 dark:ring-gray-600 focus:ring-indigo-600 dark:focus:ring-indigo-500',
              inputClassName,
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                {rightIcon}
              </span>
            </div>
          )}
        </div>
        
        {hasError ? (
          <p 
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        ) : helperText ? (
          <p 
            id={`${inputId}-help`}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
// InputProps is already exported in the interface definition
