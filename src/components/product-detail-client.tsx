'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Brand, Product } from '@/types/content';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import { getLocalizedField, getLocalizedList } from '@/lib/locale-utils';
import { Breadcrumbs } from '@/components/sections/breadcrumbs';
import { getStoreCategoryLabel } from '@/lib/store-category-translations';

type Props = {
  product: Product;
  brand?: Brand;
};

export function ProductDetailClient({ product, brand }: Props) {
  const t = useTranslations();
  const { locale } = useLocale();
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState({
    materials: true,
    finishes: false,
    dimensions: false,
  });

  const displayName = getLocalizedField(product, 'name', locale);
  const description = getLocalizedField(product, 'description', locale);
  const images = product.images?.length ? product.images : ['/images/placeholder.svg'];
  const hasMultipleImages = images.length > 1;
  const categoryLabel = getLocalizedField(product, 'category', locale) || getStoreCategoryLabel(product.category, t) || product.category;
  const localizedMaterials = getLocalizedList(product, 'materials', locale);
  const localizedFinishes = getLocalizedList(product, 'finishes', locale);
  const localizedBrandName = brand ? getLocalizedField(brand, 'name', locale) : '';

  const breadcrumbs = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: `/products/${product.slug}/`, label: displayName },
  ];
  const whatsAppHref = `https://wa.me/905061380111?text=Merhaba,%20${encodeURIComponent(displayName)}%20için%20sipariş%20vermek%20istiyorum.`;
  const showPrevImage = () => setActiveIndex((current) => (current - 1 + images.length) % images.length);
  const showNextImage = () => setActiveIndex((current) => (current + 1) % images.length);

  return (
    <div className="page bg-[#090909] text-[var(--text-primary)]">
      <div className="mx-auto grid min-h-screen max-w-[1380px] gap-8 px-4 pb-24 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.72fr)] lg:gap-10 lg:px-10">
        <div className="space-y-4">
          <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-[28px] border border-[var(--gold-border)] bg-[#151515] shadow-[0_18px_70px_rgba(0,0,0,0.24)] sm:aspect-[4/4.2] lg:aspect-[4/4.55]">
            <Image
              src={images[activeIndex]}
              alt={displayName}
              fill
              className="object-contain p-4 sm:p-6"
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
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
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:gap-3">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border bg-[#151515] sm:h-20 sm:w-20 ${
                  activeIndex === index
                    ? 'border-[var(--gold)] shadow-[0_8px_22px_rgba(201,168,76,0.18)]'
                    : 'border-white/10 opacity-75 hover:opacity-100'
                } transition`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${displayName} thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-1.5"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-[var(--gold-border)] bg-[#111111] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.18)] sm:p-7 lg:p-9">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[rgba(166,126,32,0.9)]">{categoryLabel}</p>
            <h1 className="mt-3 font-serif text-[1.55rem] leading-[0.98] text-[var(--text-primary)] sm:text-[1.95rem] lg:text-[2.25rem]">{displayName}</h1>
            {brand && <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[rgba(166,126,32,0.9)]">{localizedBrandName || brand.name}</p>}
            <p className="mt-5 text-[14px] leading-7 text-[var(--text-secondary)] sm:text-[15px] sm:leading-8">{description}</p>
          </div>

          <div className="mt-8 border-t border-white/10 sm:mt-10">
            {localizedMaterials.length > 0 && (
              <AccordionRow
                title={t('productPage.materials')}
                open={open.materials}
                onToggle={() => setOpen((state) => ({ ...state, materials: !state.materials }))}
              >
                {localizedMaterials.join(', ')}
              </AccordionRow>
            )}
            {localizedFinishes.length > 0 && (
              <AccordionRow
                title={t('productPage.finishes')}
                open={open.finishes}
                onToggle={() => setOpen((state) => ({ ...state, finishes: !state.finishes }))}
              >
                {localizedFinishes.join(', ')}
              </AccordionRow>
            )}
            {product.dimensions && (
              <AccordionRow
                title={t('productPage.dimensions')}
                open={open.dimensions}
                onToggle={() => setOpen((state) => ({ ...state, dimensions: !state.dimensions }))}
              >
                {product.dimensions}
              </AccordionRow>
            )}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <motion.a
              href={whatsAppHref}
              target="_blank"
              rel="noreferrer"
              whileTap={{ scale: 0.97 }}
              className="hidden items-center justify-center rounded-full bg-[var(--gold)] px-6 py-4 text-sm font-medium uppercase tracking-[0.24em] text-black transition-colors hover:bg-white hover:text-black lg:inline-flex"
            >
              {t('productPage.whatsAppOrder')}
            </motion.a>

            <button
              type="button"
              onClick={() => setLightbox(images[activeIndex])}
              className="w-full rounded-full border border-white/12 px-6 py-4 text-xs uppercase tracking-[0.24em] text-[var(--text-primary)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] sm:mt-0"
            >
              {t('productPage.openImage')}
            </button>
          </div>
          <div className="h-16 lg:hidden" />
        </div>
      </div>

      <motion.a
        href={whatsAppHref}
        target="_blank"
        rel="noreferrer"
        whileTap={{ scale: 0.98 }}
        className="fixed inset-x-0 bottom-0 z-50 inline-flex items-center justify-center bg-[var(--gold)] px-6 py-4 text-sm font-medium uppercase tracking-[0.24em] text-black shadow-[0_-10px_35px_rgba(0,0,0,0.24)] fixed-bottom-safe lg:hidden"
      >
        {t('productPage.whatsAppOrder')}
      </motion.a>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/92 px-6 py-10 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={() => setLightbox(null)}
          >
            <div className="mx-auto flex h-full max-h-[90vh] w-full max-w-6xl flex-col gap-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-[var(--text-primary)]">
                <p className="font-serif text-xl">{displayName}</p>
                <button type="button" className="text-sm uppercase tracking-[0.28em] text-[var(--gold)]" onClick={() => setLightbox(null)}>
                  {t('cta.close')}
                </button>
              </div>
              <div className="relative flex-1 overflow-hidden border border-[var(--gold-border)]">
                <Image src={lightbox} alt={`${displayName} enlarged`} fill className="object-contain" sizes="1200px" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccordionRow({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: string;
}) {
  return (
    <div className="border-b border-white/10 py-2.5">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-[48px] w-full items-center justify-between text-left text-[10px] uppercase tracking-[0.24em] text-[var(--text-primary)]"
      >
        <span>{title}</span>
        <span className="text-[var(--gold)]">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-sm leading-7 text-[var(--text-secondary)]">{children}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
