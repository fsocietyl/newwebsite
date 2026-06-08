'use client';

import { LocaleProvider } from './locale-provider';
import { ContentProvider } from './content-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './auth-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>
        <ContentProvider>
          {children}
          <Toaster />
        </ContentProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}
