'use client';

import { SessionProvider } from 'next-auth/react';
import { type ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';

type ProvidersProps = {
  children: ReactNode;
  themeProps?: any;
};

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider {...themeProps}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
