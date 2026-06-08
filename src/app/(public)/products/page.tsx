'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useContent } from '@/components/providers/content-provider';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import { Card3D } from '@/components/ui/card-3d';
import { getLocalizedField } from '@/lib/locale-utils';

export default function ProductsPage() {
  const { products } = useContent();
  const { locale } = useLocale();
  const t = useTranslations();

  return (
    <div className="page">
      <section className="flex h-[30vh] min-h-[200px] items-end px-4 pb-8 sm:h-[35vh] sm:px-6 md:h-[40vh] md:px-8 md:pb-12">
        <div className="container-shell">
          <p className="eyebrow mb-3 sm:mb-4">{t('nav.products')}</p>
          <h1 className="font-serif text-[clamp(40px,8vw,120px)] tracking-[0.1em] text-white">{t('products.title')}</h1>
          <p className="mt-2 text-sm tracking-[0.18em] text-[var(--gold)] sm:mt-3">
            <em className="font-serif text-xl normal-case">{t('productsPage.hint')}</em>
          </p>
        </div>
      </section>

      <section className="bg-[#090909] px-4 pb-16 pt-8 sm:px-6 sm:pt-10 md:px-10 md:pb-24">
        <div className="container-shell grid gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => {
            const displayName = getLocalizedField(product, 'name', locale);
            const categoryLabel = getLocalizedField(product, 'category', locale);
            const description = getLocalizedField(product, 'description', locale);
            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, delay: (index % 6) * 0.05 }}
                className="h-full"
              >
                <Link href={`/products/${product.slug}/`} className="group block h-full active:opacity-80">
                  <Card3D className="h-full overflow-hidden rounded-[28px] border border-[var(--gold-border)] bg-[#101010] shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
                    <div className="relative aspect-[1/1] overflow-hidden bg-[#171717]">
                      <Image
                        src={product.images?.[0] ?? '/images/placeholder.svg'}
                        alt={displayName}
                        fill
                        className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      />
                    </div>
                    <div className="flex h-full flex-col gap-4 px-4 pb-4 pt-5">
                      <div className="space-y-2 text-center">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold)]">{categoryLabel}</p>
                        <h2 className="line-clamp-2 min-h-[1.65rem] font-serif text-[0.52rem] leading-snug text-[var(--text-primary)] sm:min-h-[1.8rem] sm:text-[0.6rem]">
                          {displayName}
                        </h2>
                      </div>
                      <p className="line-clamp-2 min-h-[2.6rem] text-center text-[13px] leading-5 text-[var(--text-secondary)]">{description}</p>
                      <div className="mt-auto pt-1">
                        <span className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[var(--gold-border)] px-5 text-[11px] uppercase tracking-[0.18em] text-[var(--text-primary)] transition group-hover:border-[var(--gold)] group-hover:text-[var(--gold)]">
                          {t('products.card.view')}
                        </span>
                      </div>
                    </div>
                  </Card3D>
                </Link>
              </motion.div>
            );
          })}
          {products.length === 0 && <p className="text-center text-[var(--text-secondary)]">{t('products.empty')}</p>}
        </div>
      </section>
    </div>
  );
}
