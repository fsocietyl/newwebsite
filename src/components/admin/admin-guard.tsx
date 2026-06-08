'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useTranslations } from '@/components/providers/locale-provider';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login');
    }
  }, [loading, user, router]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[var(--text-secondary)]">
        {t('status.loading')}
      </div>
    );
  }

  return <>{children}</>;
}
