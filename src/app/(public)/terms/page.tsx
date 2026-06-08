'use client';

import { useTranslations } from '@/components/providers/locale-provider';

export default function TermsPage() {
  const t = useTranslations();
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <h1 className="text-4xl text-white">{t('legal.termsTitle')}</h1>
      <p className="text-sm text-stone-300">{t('legal.termsBody1')}</p>
      <p className="text-sm text-stone-300">{t('legal.termsBody2')}</p>
    </div>
  );
}
