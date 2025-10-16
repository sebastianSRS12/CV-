import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    helperText,
    id,
    fullWidth = true,
    containerClassName,
    labelClassName,
    textareaClassName,
    showCharacterCount = false,
    maxLength,
    disabled,
    ...props
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const characterCount = typeof props.value === 'string' ? props.value.length : 0;
    const isMaxLengthReached = maxLength ? characterCount >= maxLength : false;

    return (
      <div className={cn(
        'relative',
        fullWidth ? 'w-full' : 'w-auto',
        containerClassName
      )}>
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
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
          
          {showCharacterCount && maxLength && (
            <span className={cn(
              'text-xs',
              isMaxLengthReached 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400'
            )}>
              {characterCount}/{maxLength}
            </span>
          )}
        </div>

        <div className="relative rounded-md shadow-sm">
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError 
                ? `${textareaId}-error` 
                : helperText 
                  ? `${textareaId}-help` 
                  : undefined
            }
            maxLength={maxLength}
            className={cn(
              'block w-full rounded-md border-0 py-1.5',
              'text-gray-900 dark:text-gray-100',
              'bg-white dark:bg-gray-800',
              'ring-1 ring-inset',
              'focus:ring-2 focus:ring-inset',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'sm:text-sm sm:leading-6',
              'transition-colors duration-200',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'resize-y min-h-[100px]',
              hasError
                ? 'ring-red-300 focus:ring-red-500 text-red-900 dark:ring-red-700 dark:focus:ring-red-500 dark:text-red-100'
                : 'ring-gray-300 dark:ring-gray-600 focus:ring-primary-600 dark:focus:ring-primary-500',
              textareaClassName,
              className
            )}
            {...props}
          />
        </div>
        
        {hasError ? (
          <p 
            id={`${textareaId}-error`}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        ) : helperText ? (
          <p 
            id={`${textareaId}-help`}
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
