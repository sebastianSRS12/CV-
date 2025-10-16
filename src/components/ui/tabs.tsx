import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
}

interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isActive?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
}

interface TabPanelsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, children, fullWidth = false, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col', fullWidth ? 'w-full' : 'w-auto', className)}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Tabs.displayName = 'Tabs';

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, fullWidth = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          'flex items-center gap-1 overflow-x-auto',
          'border-b border-gray-200 dark:border-gray-700',
          'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
          fullWidth ? 'w-full' : 'w-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabList.displayName = 'TabList';

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({
    className,
    children,
    isActive = false,
    icon,
    variant = 'default',
    size = 'md',
    ...props
  }, ref) => {
    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
    };

    const variantClasses = {
      default: cn(
        'border-b-2 font-medium',
        isActive
          ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
      ),
      pills: cn(
        'rounded-full font-medium',
        isActive
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      ),
      underline: cn(
        'border-b-2 font-medium',
        isActive
          ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
      ),
    };

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap',
          'transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
          'dark:focus-visible:ring-offset-gray-900',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);
Tab.displayName = 'Tab';

const TabPanels = React.forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabPanels.displayName = 'TabPanels';

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ className, children, isActive = false, ...props }, ref) => {
    if (!isActive) return null;
    
    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn('py-2 focus:outline-none', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabPanel.displayName = 'TabPanel';

export { Tabs, TabList, Tab, TabPanels, TabPanel };
export type { TabsProps, TabListProps, TabProps, TabPanelsProps, TabPanelProps };
