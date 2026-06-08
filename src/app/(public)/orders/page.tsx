'use client';

import { CustomOrderForm } from '@/components/forms/custom-order-form';
import { useTranslations } from '@/components/providers/locale-provider';

export default function CustomOrdersPage() {
  const t = useTranslations();

  return (
    <div className="page">
      <section className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="relative flex flex-col justify-between bg-[#0d0d0d] py-10 px-5 sm:p-8 lg:p-16 xl:p-20">
          <div className="absolute inset-y-0 left-4 w-px bg-[var(--gold-border)] sm:left-6 md:left-10" />
          <div className="relative z-10">
            <p className="eyebrow mb-4 sm:mb-6">{t('nav.orders')}</p>
            <h1 className="max-w-xl font-serif text-[clamp(2rem,5vw,5rem)] leading-[1.04] text-white">
              {t('sections.customOrderTitle')}
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-8 text-[var(--text-secondary)] sm:mt-8">
              {t('sections.customOrderSubtitle')}
            </p>
          </div>

          <div className="relative z-10 mt-8 space-y-4 text-sm leading-7 text-[var(--text-secondary)] lg:mt-0">
            <p className="label-tag">{t('ordersPage.formBadge')}</p>
            <p>{t('ordersPage.formTitle')}</p>
            <p>{t('ordersPage.formSubtitle')}</p>
          </div>
        </div>

        <div className="bg-[var(--bg-base)] px-5 pb-10 pt-8 sm:p-8 lg:p-16 xl:p-20">
          <CustomOrderForm />
        </div>
      </section>
    </div>
  );
}
