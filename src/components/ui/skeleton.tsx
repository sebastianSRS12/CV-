import * as React from 'react';
import { cn } from '@/lib/utils/cn';

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
      className
    )}
    {...props}
  />
));
Skeleton.displayName = 'Skeleton';

const SkeletonText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    lines?: number;
    lineClassName?: string;
  }
>(({ className, lines = 3, lineClassName, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('space-y-2', className)}
      {...props}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-4/5' : 'w-full',
            lineClassName
          )}
        />
      ))}
    </div>
  );
});
SkeletonText.displayName = 'SkeletonText';

export { Skeleton, SkeletonText };
