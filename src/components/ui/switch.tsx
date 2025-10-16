import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  labelPosition?: 'left' | 'right';
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(({
  className,
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  labelPosition = 'right',
  ...props
}, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked);

  React.useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const toggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onCheckedChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };

  const switchElement = (
    <button
      ref={ref}
      role="switch"
      type="button"
      aria-checked={isChecked}
      disabled={disabled}
      className={cn(
        'group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:bg-primary-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isChecked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
        className
      )}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out',
          isChecked ? 'translate-x-5' : 'translate-x-0',
          disabled && 'bg-gray-100 dark:bg-gray-300'
        )}
      />
    </button>
  );

  if (label) {
    return (
      <div className="flex items-center">
        {labelPosition === 'left' && (
          <span className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
        )}
        {switchElement}
        {labelPosition === 'right' && (
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
        )}
      </div>
    );
  }

  return switchElement;
});

Switch.displayName = 'Switch';

export { Switch };
