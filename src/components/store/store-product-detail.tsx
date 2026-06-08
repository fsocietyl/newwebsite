'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import { getStoreCategoryLabel } from '@/lib/store-category-translations';
import { getStoreTranslation, type StoreProductRecord } from '@/lib/store-products';

const STORAGE_KEY = 'store-cart';

export function StoreProductDetail({ item }: { item: StoreProductRecord }) {
  const t = useTranslations();
  const { locale } = useLocale();
  const [added, setAdded] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeImage, setActiveImage] = useState(item.image);
  const activeIndex = Math.max(item.images.indexOf(activeImage), 0);

  useEffect(() => {
    console.info('[store] product detail loaded', { slug: item.slug });
  }, [item.slug]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const cart = raw ? JSON.parse(raw) : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCartCount(Array.isArray(cart) ? cart.length : 0);
    } catch (error) {
      console.error('[store] load cart failed', error);
    }
  }, []);

  const priceText = useMemo(
    () => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.price),
    [item.price],
  );

  const name = getStoreTranslation(item.nameTranslations ?? item.name, locale) || item.name;
  const description = getStoreTranslation(item.descriptionTranslations ?? item.description, locale) || item.description;
  const categoryLabel = getStoreCategoryLabel(item.category, t) || t('nav.newProducts');
  const whatsAppHref = `https://wa.me/905061380111?text=${encodeURIComponent(name)}`;
  const hasMultipleImages = item.images.length > 1;
  const showPrevImage = () => {
    if (!item.images.length) return;
    const nextIndex = (activeIndex - 1 + item.images.length) % item.images.length;
    setActiveImage(item.images[nextIndex]);
  };
  const showNextImage = () => {
    if (!item.images.length) return;
    const nextIndex = (activeIndex + 1) % item.images.length;
    setActiveImage(item.images[nextIndex]);
  };

  const addToCart = () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const cart = raw ? JSON.parse(raw) : [];
      if (!cart.find((entry: StoreProductRecord) => entry.slug === item.slug)) {
        cart.push(item);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      }
      setAdded(true);
    } catch (error) {
      console.error('[store] addToCart failed', error);
    }
  };

  return (
    <div className="page bg-[#090909] text-[var(--text-primary)]">
      <div className="mx-auto grid min-h-screen max-w-[1380px] gap-8 px-4 pb-24 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.72fr)] lg:gap-10 lg:px-10">
        <div className="space-y-4">
          <div className="relative aspect-[4/4.6] overflow-hidden rounded-[28px] border border-[var(--gold-border)] bg-[#151515] shadow-[0_18px_70px_rgba(0,0,0,0.24)] sm:aspect-[4/4.2] lg:aspect-[4/4.55]">
            <Image
              src={activeImage}
              alt={name}
              fill
              className="object-contain p-4 sm:p-6"
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
              unoptimized
            />
            {hasMultipleImages ? (
              <>
                <button
                  type="button"
                  onClick={showPrevImage}
                  className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>
          {item.images.length > 1 && (
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:gap-3">
              {item.images.map((imageUrl) => (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={() => setActiveImage(imageUrl)}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border bg-[#151515] transition sm:h-20 sm:w-20 ${
                    activeImage === imageUrl
                      ? 'border-[var(--gold)] shadow-[0_8px_22px_rgba(201,168,76,0.18)]'
                      : 'border-white/10 opacity-75 hover:opacity-100'
                  }`}
                >
                  <Image src={imageUrl} alt={name} fill className="object-contain p-1.5" sizes="80px" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[32px] border border-[var(--gold-border)] bg-[#111111] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.18)] sm:p-7 lg:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[rgba(166,126,32,0.9)]">{categoryLabel}</p>
              <h1 className="mt-3 font-serif text-[1.55rem] leading-[0.98] text-[var(--text-primary)] sm:text-[1.95rem] lg:text-[2.25rem]">{name}</h1>
            </div>
            <Link
              href="/store/cart/"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[var(--text-primary)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          <p className="mt-5 text-[14px] leading-7 text-[var(--text-secondary)] sm:text-[15px] sm:leading-8">{description}</p>
          <p className="mt-7 font-serif text-[2rem] text-[var(--text-primary)] sm:text-[2.3rem]">{priceText}</p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:grid sm:grid-cols-2">
            <button
              onClick={addToCart}
              className="w-full rounded-full border border-white/12 px-6 py-4 text-sm uppercase tracking-[0.24em] text-[var(--text-primary)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] active:opacity-80"
              style={{ minHeight: '52px' }}
            >
              {added ? t('storePage.cart') : t('storePage.addToCart')}
            </button>
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="hidden w-full items-center justify-center rounded-full bg-[var(--gold)] px-6 py-4 text-sm uppercase tracking-[0.24em] text-black transition hover:bg-white hover:text-black lg:inline-flex"
              style={{ minHeight: '52px' }}
            >
              {t('storePage.buyDirect')}
            </a>
          </div>
          <div className="h-16 lg:hidden" />
        </div>
      </div>

      <a
        href={whatsAppHref}
        target="_blank"
        rel="noreferrer"
        className="fixed inset-x-0 bottom-0 z-50 inline-flex items-center justify-center bg-[var(--gold)] px-6 py-4 text-sm uppercase tracking-[0.24em] text-black shadow-[0_-10px_35px_rgba(0,0,0,0.24)] fixed-bottom-safe lg:hidden"
      >
        {t('storePage.buyDirect')}
      </a>
    </div>
  );
}
