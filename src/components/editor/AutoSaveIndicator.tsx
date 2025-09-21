'use client';

import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  className?: string;
}

export function AutoSaveIndicator({ isSaving, lastSaved, className }: AutoSaveIndicatorProps) {
  return (
    <div className={cn(
      "flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400",
      className
    )}>
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving changes...</span>
        </>
      ) : (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span>
            {lastSaved 
              ? `Saved at ${lastSaved.toLocaleTimeString()}` 
              : 'All changes saved'}
          </span>
        </>
      )}
    </div>
  );
}
