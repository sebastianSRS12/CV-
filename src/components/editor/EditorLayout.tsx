'use client';

import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export interface EditorLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  padded?: boolean;
  withContainer?: boolean;
  containerClassName?: string;
  contentClassName?: string;
}

export function EditorLayout({
  children,
  className,
  fullWidth = false,
  padded = true,
  withContainer = true,
  containerClassName,
  contentClassName,
}: EditorLayoutProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering the layout after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200" />
    );
  }

  const content = (
    <div
      className={cn(
        'min-h-screen w-full',
        'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
        'text-gray-900 dark:text-gray-100 transition-colors duration-200',
        padded ? 'py-8' : '',
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'h-full w-full',
            withContainer ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' : ''
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              'h-full w-full',
              withContainer ? 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden' : '',
              contentClassName
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return content;
}
