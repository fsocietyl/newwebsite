'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useTranslations } from '@/components/providers/locale-provider';

export default function NotFound() {
  const t = useTranslations();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.error('[404] Page not found', window.location.href);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#080808] px-4 text-center">
      <h1 className="font-serif text-[100px] leading-none text-[var(--gold)] sm:text-[140px] xl:text-[200px]">404</h1>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] sm:mt-4 sm:text-sm">{t('notfound.title')}</p>
      <Link
        href="/"
        className="mt-6 inline-flex min-w-[160px] items-center justify-center border border-[var(--gold-border)] px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-[var(--gold)] transition-colors hover:bg-[var(--gold)] hover:text-black active:opacity-80 sm:mt-10 sm:px-10 sm:py-4 sm:text-xs"
      >
        {t('notfound.back')}
      </Link>
    </div>
  );
}
