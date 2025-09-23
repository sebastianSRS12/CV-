'use client';

import { cn } from '@/lib/utils/cn';
import { Check, Loader2, AlertCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';

export interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  error?: string | null;
  className?: string;
  showLastSavedTime?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'detailed';
}

export function AutoSaveIndicator({
  isSaving,
  lastSaved,
  error = null,
  className,
  showLastSavedTime = true,
  showIcon = true,
  size = 'md',
  variant = 'default',
}: AutoSaveIndicatorProps) {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  const getStatusContent = () => {
    if (error) {
      return (
        <div className="flex items-center space-x-1.5 text-red-500 dark:text-red-400">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">Error saving changes</span>
        </div>
      );
    }

    if (isSaving) {
      return (
        <div className="flex items-center space-x-1.5 text-amber-500 dark:text-amber-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin flex-shrink-0" />
          <span>Saving changes...</span>
        </div>
      );
    }

    if (lastSaved) {
      const formattedTime = new Date(lastSaved).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
      
      return (
        <div className="flex items-center space-x-1.5 text-green-500 dark:text-green-400">
          <Check className="h-3.5 w-3.5 flex-shrink-0" />
          {showLastSavedTime && (
            <span className="truncate">Saved at {formattedTime}</span>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400">
        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
        <span>All changes saved</span>
      </div>
    );
  };

  const content = (
    <div
      className={cn(
        'inline-flex items-center space-x-1.5 transition-opacity duration-200',
        sizeClasses[size],
        variant === 'minimal' ? 'opacity-70 hover:opacity-100' : '',
        className
      )}
    >
      {getStatusContent()}
    </div>
  );

  if (variant === 'minimal' && (error || (lastSaved && showLastSavedTime))) {
    return (
      <TooltipProvider>
        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
          <TooltipTrigger asChild>
            <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
              {content}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end" className="max-w-xs">
            {error ? (
              <p className="text-red-500 dark:text-red-400">{error}</p>
            ) : (
              <p>Last saved at {lastSaved?.toLocaleString()}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
