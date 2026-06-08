'use client';

import { useTranslations } from '@/components/providers/locale-provider';

export default function PrivacyPage() {
  const t = useTranslations();
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <h1 className="text-4xl text-white">{t('legal.privacyTitle')}</h1>
      <p className="text-sm text-stone-300">{t('legal.privacyBody1')}</p>
      <p className="text-sm text-stone-300">{t('legal.privacyBody2')}</p>
      <p className="text-sm text-stone-300">{t('legal.privacyBody3')}</p>
    </div>
  );
}
