'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import { getStoreTranslation, type StoreProductRecord } from '@/lib/store-products';

const STORAGE_KEY = 'store-cart';

export default function StoreCartPage() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [items, setItems] = useState<StoreProductRecord[]>([]);

  const priceText = useMemo(
    () => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }),
    [],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const cart = raw ? JSON.parse(raw) : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(Array.isArray(cart) ? cart : []);
    } catch (error) {
      console.error('[store] load cart failed', error);
    }
  }, []);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="page px-4 py-16 sm:px-6 sm:py-24 md:px-10">
      <div className="container-narrow max-w-2xl">
        <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] sm:mb-4">{t('storePage.cart')}</p>
        <h1 className="font-serif text-4xl text-white sm:text-5xl md:text-6xl">{t('storePage.cartTitle')}</h1>

        {items.length === 0 ? (
          <div className="mt-10 border border-[var(--hairline)] bg-[var(--bg-surface)] px-6 py-12 text-center text-[var(--text-secondary)] sm:px-10">
            <p className="text-sm">{t('storePage.cartEmpty')}</p>
            <Link href="/store/" className="btn-luxury mt-6 inline-block">
              {t('newProductsPage.title')}
            </Link>
          </div>
        ) : (
          <div className="mt-8 sm:mt-10">
            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.slug} className="flex gap-3 border-b border-white/5 py-5 sm:gap-4 sm:py-6">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-[var(--bg-surface)] sm:h-20 sm:w-20">
                    <Image src={item.image} alt={getStoreTranslation(item.nameTranslations ?? item.name, locale) || item.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex flex-1 min-w-0 items-center justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-serif text-base text-white sm:text-xl">{getStoreTranslation(item.nameTranslations ?? item.name, locale) || item.name}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-[var(--text-secondary)] sm:text-sm">{getStoreTranslation(item.descriptionTranslations ?? item.description, locale) || item.description}</p>
                    </div>
                    <p className="flex-shrink-0 font-serif text-base text-[var(--gold)] sm:text-xl">{priceText.format(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-right font-serif text-xl text-[var(--gold)] sm:text-2xl">{priceText.format(total)}</p>

            <a
              href={`https://wa.me/905061380111?text=${encodeURIComponent(t('storePage.cartTitle'))}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 hidden w-full items-center justify-center bg-[var(--gold)] px-6 py-5 text-sm uppercase tracking-[0.28em] text-black transition hover:bg-white md:inline-flex"
            >
              {t('storePage.cartCheckout')}
            </a>
            {/* Spacer for fixed mobile button */}
            <div className="h-20 md:hidden" />
          </div>
        )}
      </div>
      {items.length > 0 && (
        <a
          href={`https://wa.me/905061380111?text=${encodeURIComponent(t('storePage.cartTitle'))}`}
          target="_blank"
          rel="noreferrer"
          className="fixed inset-x-0 bottom-0 z-50 inline-flex items-center justify-center bg-[var(--gold)] px-6 py-5 text-sm uppercase tracking-[0.28em] text-black shadow-[0_-10px_35px_rgba(0,0,0,0.45)] fixed-bottom-safe md:hidden"
        >
          {t('storePage.cartCheckout')}
        </a>
      )}
    </div>
  );
}
