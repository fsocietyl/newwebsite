'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import { Card3D } from '@/components/ui/card-3d';
import type { Locale } from '@/lib/i18n';
import { getStoreCategoryLabel } from '@/lib/store-category-translations';
import { getStoreTranslation, type StoreProductRecord } from '@/lib/store-products';

const hoverImages: Record<string, string> = {
  'store-sample': '/hero-fresh-4.webp',
  'store-sample-2': '/hero-fresh-6.webp',
};

const storeCategories = [
  'Ayna',
  'Orta Sehpa',
  'Çerçeve',
  'Barfiks & Şınav Barı',
  'Şifonyer',
  'Yemek Masası',
  'Yan Sehpa',
  'Puf & Bench',
  'Berjer',
  'Dresuar',
  'Yatak',
  'Yatak Odası Takımı',
  'Komodin',
  'Yemek Odası Sandalyesi',
  'Bahçe Masası',
  'Vitrin & Gümüşlük',
  'Çay Seti Koltuk Takımı',
  'Kanepe',
  'Yatak / Baza Başlığı',
  'Mobilya Hırdavatı',
  'Kilit',
  'Ahşap Boya & Vernik',
  'Kapı Hırdavatı',
  'Ayna Etajeri',
  'Çalışma Sandalyesi',
  'Tekerlekli Sandalye',
  'Banyo Rafları',
  'TV Sehpa & Ünitesi',
  'Duvar Rafı',
  'Bahçe Sandalyesi',
  'Koltuk Takımı',
  'Vida & Çivi & Dübel',
  'Yalıtım Malzemesi',
];

export default function NewProductsPage() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState<StoreProductRecord[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const priceText = useMemo(
    () => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }),
    [],
  );

  const categories = useMemo(() => {
    const liveCategories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return liveCategories.length > 0 ? liveCategories : storeCategories;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return products;
    }
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('store-cart');
      const cart = raw ? JSON.parse(raw) : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCartCount(Array.isArray(cart) ? cart.length : 0);
    } catch (error) {
      console.error('[store] load cart failed', error);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch('/api/store-products', { cache: 'no-store' });
        const data = (await response.json()) as StoreProductRecord[];
        if (active && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error('[store] load products failed', error);
      }
    }

    void loadProducts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page">
      <section className="relative border-b border-[var(--gold-border)] bg-[#090909] px-4 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-24 md:px-10 md:pt-28">
        <div className="container-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="max-w-3xl">
              <p className="mb-3 text-[10px] uppercase tracking-[0.34em] text-[rgba(166,126,32,0.9)] sm:mb-4">{t('nav.newProducts')}</p>
              <h1 className="font-serif text-[clamp(40px,10vw,120px)] leading-[0.9] tracking-[0.03em] text-[var(--text-primary)]">
                {t('storePage.heroTitle')}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] sm:mt-5">{t('newProductsPage.hint')}</p>
            </div>
            <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
              <div className="flex min-w-max items-center gap-2 pb-2 text-[10px] uppercase tracking-[0.16em] text-[#57534e]">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`rounded-full border px-3 py-2 transition ${
                    activeCategory === 'all'
                      ? 'border-[var(--gold-border)] bg-[rgba(255,255,255,0.08)] text-[var(--text-primary)]'
                      : 'border-white/10 bg-[rgba(255,255,255,0.03)] hover:border-[var(--gold-border)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {t('storePage.allCategories')}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory((current) => (current === category ? 'all' : category))}
                    className={`rounded-full border px-3 py-2 transition ${
                      activeCategory === category
                        ? 'border-[var(--gold-border)] bg-[rgba(255,255,255,0.08)] text-[var(--text-primary)]'
                        : 'border-white/10 bg-[rgba(255,255,255,0.03)] hover:border-[var(--gold-border)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {getStoreCategoryLabel(category, t)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Link
          href="/store/cart/"
          className="fixed bottom-24 right-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)] text-sm font-bold text-black shadow-[0_10px_30px_rgba(15,15,15,0.28)] sm:right-8 sm:h-11 sm:w-11 md:bottom-8"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-bold text-black animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>
      </section>

      <section className="bg-[#090909] px-4 pb-16 pt-8 sm:px-6 sm:pt-10 md:px-10">
        <div className="container-shell grid gap-x-6 gap-y-10 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, delay: (index % 6) * 0.05 }}
              className="h-full"
            >
              <StoreCard item={item} priceText={priceText} />
            </motion.div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="container-shell border border-[var(--gold-border)] bg-[rgba(255,255,255,0.03)] p-8 text-center text-sm text-[var(--text-secondary)]">
            {t('storePage.emptyCategory')}
          </div>
        )}
      </section>

      {cartCount > 0 && (
        <section className="px-6 pb-24 md:px-10">
          <div className="container-shell rounded-[28px] border border-[var(--gold-border)] bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_18px_60px_rgba(15,15,15,0.15)]">
            <h2 className="font-serif text-2xl text-[var(--text-primary)]">{t('storePage.cartTitle')}</h2>
            <div className="mt-4 flex flex-col gap-4">
              <CartItems priceText={priceText} locale={locale} />
              <a
                href={`https://wa.me/905061380111?text=${encodeURIComponent(t('storePage.cartTitle'))}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--gold)] px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-black transition hover:bg-white hover:text-black"
              >
                {t('storePage.cartCheckout')}
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function StoreCard({ item, priceText }: { item: StoreProductRecord; priceText: Intl.NumberFormat }) {
  const t = useTranslations();
  const { locale } = useLocale();
  const name = getStoreTranslation(item.nameTranslations ?? item.name, locale) || item.name;
  const description = getStoreTranslation(item.descriptionTranslations ?? item.description, locale) || item.description;
  const hoverImage = item.images[1] ?? hoverImages[item.slug] ?? item.image;
  const categoryLabel = getStoreCategoryLabel(item.category, t) || t('nav.products');

  return (
    <Link href={`/store/${item.slug}/`} className="group block h-full">
      <Card3D className="h-full overflow-hidden rounded-[28px] border border-[var(--gold-border)] bg-[#101010] shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
        <div className="relative aspect-[1/1] overflow-hidden bg-[#171717]">
          <Image
            src={item.image}
            alt={name}
            fill
            className="object-contain p-5 transition-all duration-700 group-hover:scale-[1.02] group-hover:opacity-0"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            unoptimized
          />
          <Image
            src={hoverImage}
            alt={name}
            fill
            className="object-contain p-5 opacity-0 transition-all duration-700 group-hover:scale-[1.02] group-hover:opacity-100"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            unoptimized
          />
        </div>
        <div className="flex h-full flex-col gap-4 px-4 pb-4 pt-5">
          <div className="space-y-2 text-center">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold)]">{categoryLabel}</p>
            <h2 className="line-clamp-2 min-h-[1.65rem] font-serif text-[0.52rem] leading-snug text-[var(--text-primary)] sm:min-h-[1.8rem] sm:text-[0.6rem]">{name}</h2>
          </div>
          <p className="line-clamp-2 min-h-[2.6rem] text-center text-[13px] leading-5 text-[var(--text-secondary)]">{description}</p>
          <div className="mt-auto flex items-center gap-3 pt-1">
            <p className="min-w-0 flex-1 font-serif text-[1.45rem] text-[var(--text-primary)]">{priceText.format(item.price)}</p>
            <span className="inline-flex min-h-[48px] min-w-[150px] items-center justify-center rounded-full border border-[var(--gold-border)] px-5 text-[11px] uppercase tracking-[0.18em] text-[var(--text-primary)] transition group-hover:border-[var(--gold)] group-hover:text-[var(--gold)]">
              {t('storePage.viewDetails')}
            </span>
          </div>
        </div>
      </Card3D>
    </Link>
  );
}

function CartItems({ priceText, locale }: { priceText: Intl.NumberFormat; locale: Locale }) {
  const t = useTranslations();
  const [items, setItems] = useState<StoreProductRecord[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('store-cart');
      const cart = raw ? JSON.parse(raw) : [];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(Array.isArray(cart) ? cart : []);
    } catch (error) {
      console.error('[store] load cart failed', error);
    }
  }, []);

  if (items.length === 0) return <p className="text-sm text-[var(--text-secondary)]">{t('storePage.cartEmpty')}</p>;

  return (
    <div className="space-y-2 text-sm text-[var(--text-primary)]">
      {items.map((item) => (
        <div key={item.slug} className="flex items-center justify-between border-b border-white/10 py-2">
          <span>{getStoreTranslation(item.nameTranslations ?? item.name, locale) || item.name}</span>
          <span className="text-[var(--text-primary)]">{priceText.format(item.price)}</span>
        </div>
      ))}
    </div>
  );
}
