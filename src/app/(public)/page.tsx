'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card3D } from '@/components/ui/card-3d';
import { useContent } from '@/components/providers/content-provider';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import type { Locale } from '@/lib/i18n';
import { getLocalizedField } from '@/lib/locale-utils';
import { getSafeProjectSlug } from '@/lib/slug';
import { getStoreCategoryLabel } from '@/lib/store-category-translations';
import {
  getStoreTranslation,
  type HomepageProductPosition,
  type HomepageSettings,
  type StoreProductRecord,
} from '@/lib/store-products';
import type { Project } from '@/types/content';

const positions = [
  { top: '8%', left: '5%', rotate: '-3deg', size: 280 },
  { top: '15%', left: '38%', rotate: '2deg', size: 220 },
  { top: '10%', left: '68%', rotate: '-2deg', size: 300 },
  { top: '45%', left: '12%', rotate: '4deg', size: 240 },
  { top: '48%', left: '52%', rotate: '-4deg', size: 260 },
  { top: '42%', left: '78%', rotate: '3deg', size: 220 },
  { top: '72%', left: '5%', rotate: '-2deg', size: 300 },
  { top: '70%', left: '35%', rotate: '3deg', size: 240 },
  { top: '68%', left: '65%', rotate: '-3deg', size: 280 },
];

const mobilePositions = [
  { top: '12%', left: '8%', rotate: '-6deg', size: 108 },
  { top: '21%', left: '56%', rotate: '5deg', size: 98 },
  { top: '45%', left: '4%', rotate: '4deg', size: 102 },
  { top: '53%', left: '56%', rotate: '-5deg', size: 112 },
  { top: '71%', left: '30%', rotate: '3deg', size: 104 },
];

function resolveFeaturedProducts({
  products,
  slugs,
  count,
  fallbackCount,
}: {
  products: StoreProductRecord[];
  slugs: string[] | undefined;
  count: number | undefined;
  fallbackCount: number;
}) {
  if (!slugs?.length) {
    return products.slice(0, fallbackCount);
  }

  const orderedProducts = slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean) as StoreProductRecord[];

  if (!orderedProducts.length) {
    return products.slice(0, fallbackCount);
  }

  const resolvedCount = Math.min(
    Math.max(count ?? orderedProducts.length, 1),
    fallbackCount,
    orderedProducts.length,
  );

  return orderedProducts.slice(0, resolvedCount);
}

function resolveHeroPosition(
  product: StoreProductRecord,
  index: number,
  fallback: { top: string; left: string; rotate: string; size: number },
  layout: HomepageProductPosition[] | undefined,
) {
  const entry = layout?.find((item) => item.slug === product.slug);
  if (!entry) return fallback;
  return {
    ...fallback,
    top: `${entry.y}%`,
    left: `${entry.x}%`,
  };
}

export default function HomePage() {
  const { projects } = useContent();
  const { locale } = useLocale();
  const t = useTranslations();
  const [selectedProduct, setSelectedProduct] = useState<StoreProductRecord | null>(null);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  const [storeProducts, setStoreProducts] = useState<StoreProductRecord[]>([]);
  const deckRef = useRef<HTMLDivElement>(null);
  const brandName = t('brand.name');

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch('/api/store-products', { cache: 'no-store' }),
      fetch('/api/homepage-settings', { cache: 'no-store' }),
    ])
      .then(async ([storeResponse, settingsResponse]) => {
        if (!storeResponse.ok) {
          throw new Error(`Store product load failed: ${storeResponse.status}`);
        }
        if (!settingsResponse.ok) {
          throw new Error(`Homepage settings load failed: ${settingsResponse.status}`);
        }
        const data = (await storeResponse.json()) as StoreProductRecord[];
        const settings = (await settingsResponse.json()) as HomepageSettings | null;
        if (!active) return;
        setStoreProducts(Array.isArray(data) ? data : []);
        setHomepageSettings(settings);
      })
      .catch((error) => {
        console.error('[home] floating store load failed', error);
      });

    return () => {
      active = false;
    };
  }, []);

  const desktopLeadProducts = useMemo(
    () =>
      resolveFeaturedProducts({
        products: storeProducts,
        slugs: homepageSettings?.featuredDesktopProductSlugs ?? homepageSettings?.featuredProductSlugs,
        count: homepageSettings?.featuredDesktopProductCount ?? homepageSettings?.featuredProductCount,
        fallbackCount: positions.length,
      }),
    [homepageSettings, storeProducts],
  );
  const mobileLeadProducts = useMemo(
    () =>
      resolveFeaturedProducts({
        products: storeProducts,
        slugs: homepageSettings?.featuredMobileProductSlugs ?? homepageSettings?.featuredProductSlugs,
        count: homepageSettings?.featuredMobileProductCount ?? homepageSettings?.featuredProductCount,
        fallbackCount: mobilePositions.length,
      }),
    [homepageSettings, storeProducts],
  );
  const leadProjects = useMemo(() => projects.slice(0, 4), [projects]);
  const desktopLayout = homepageSettings?.featuredDesktopLayout;
  const mobileLayout = homepageSettings?.featuredMobileLayout;
  const stats = [
    { value: '30+', label: t('aboutPage.stats.years') },
    { value: '120', label: t('aboutPage.stats.projects') },
    { value: '8', label: t('aboutPage.stats.studios') },
    { value: '60', label: t('aboutPage.stats.partners') },
  ];

  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div className="page">
      <section className="relative overflow-hidden px-4 pb-10 pt-20 md:min-h-[100svh] md:px-10 md:pb-16 md:pt-28">
        <div className="relative hidden min-h-[900px] md:block">
          {desktopLeadProducts
            .filter((product) => {
              const img = product.images?.[0] ?? '';
              return img && !/(drawing|dimension|technical)/i.test(img);
            })
            .map((product, index) => {
            const pos = resolveHeroPosition(product, index, positions[index], desktopLayout);
            const displayName = getStoreTranslation(product.nameTranslations ?? product.name, locale) || product.name;
            const driftDuration = 12 + index * 1.35;
            const driftOffset = (index % 3) * 6;
            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={{
                  opacity: 1,
                  y: [0, -16 - driftOffset, 8, -10, 0],
                  x: [0, 10, -8, 6, 0],
                  rotate: [pos.rotate, `${parseFloat(pos.rotate) + 1.4}deg`, `${parseFloat(pos.rotate) - 1.2}deg`, pos.rotate],
                }}
                transition={{
                  opacity: { delay: index * 0.08, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] },
                  y: { delay: index * 0.08, duration: driftDuration, repeat: Infinity, ease: 'easeInOut' },
                  x: { delay: index * 0.08, duration: driftDuration + 2, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { delay: index * 0.08, duration: driftDuration + 1, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute"
                style={{ top: pos.top, left: pos.left, width: pos.size }}
              >
                <button
                  type="button"
                  className="block w-full text-left"
                  onClick={() => setSelectedProduct(product)}
                  aria-label={`${t('homePage.openProduct')} ${displayName}`}
                >
                  <Card3D className="overflow-hidden border border-white/40 bg-[#f7f4ee] shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={product.images?.[0] ?? '/images/placeholder.svg'}
                        alt={displayName}
                        fill
                        className="object-contain p-3"
                        sizes="320px"
                      />
                    </div>
                  </Card3D>
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="relative block min-h-[75svh] md:hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 max-w-[13rem] sm:max-w-[16rem]">
            <p className="eyebrow mb-2">— {t('homePage.craftEyebrow')}</p>
            <h1 className="font-serif text-[clamp(1.9rem,9vw,3rem)] leading-[0.92] text-[var(--text-primary)]">
              {t('homePage.statementLineOne')} <br />
              <em className="text-[var(--gold)]">{t('homePage.statementLineTwo')}</em>
            </h1>
          </div>
          <div className="absolute inset-0">
            {mobileLeadProducts
              .filter((product) => {
                const img = product.images?.[0] ?? '';
                return img && !/(drawing|dimension|technical)/i.test(img);
              })
              .slice(0, mobilePositions.length)
              .map((product, index) => {
              const pos = resolveHeroPosition(product, index, mobilePositions[index], mobileLayout);
            const displayName = getStoreTranslation(product.nameTranslations ?? product.name, locale) || product.name;
            const driftDuration = 10 + index * 1.2;
            const driftOffset = (index % 2) * 5;
              return (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: [0, -12 - driftOffset, 6, -8, 0],
                    x: [0, 7, -6, 5, 0],
                    rotate: [pos.rotate, `${parseFloat(pos.rotate) + 1.1}deg`, `${parseFloat(pos.rotate) - 1}deg`, pos.rotate],
                  }}
                  transition={{
                    opacity: { delay: index * 0.08, duration: 0.85, ease: [0.2, 0.7, 0.2, 1] },
                    y: { delay: index * 0.08, duration: driftDuration, repeat: Infinity, ease: 'easeInOut' },
                    x: { delay: index * 0.08, duration: driftDuration + 1.5, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { delay: index * 0.08, duration: driftDuration + 1, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="absolute"
                  style={{ top: pos.top, left: pos.left, width: pos.size }}
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => setSelectedProduct(product)}
                    aria-label={`${t('homePage.openProduct')} ${displayName}`}
                  >
                    <Card3D className="overflow-hidden border border-white/40 bg-[#f7f4ee] shadow-[0_22px_55px_rgba(0,0,0,0.22)]">
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={product.images?.[0] ?? '/images/placeholder.svg'}
                          alt={displayName}
                          fill
                          className="object-contain p-2.5"
                          sizes="40vw"
                        />
                      </div>
                    </Card3D>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section pt-10 sm:pt-14 md:pt-24">
        <div className="container-shell">
          <p className="eyebrow mb-5 hidden md:block">— {t('homePage.craftEyebrow')}</p>
          <h2 className="max-w-5xl font-serif text-3xl leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl md:leading-[0.98]">
            {t('homePage.statementLineOne')} <br />
            <em className="text-[var(--gold)]">{t('homePage.statementLineTwo')}</em>
          </h2>
          <div className="mt-6 grid gap-5 md:mt-16 md:grid-cols-2 md:gap-20 md:pl-[18%]">
            <p className="text-[13px] leading-6 text-[var(--text-secondary)] md:text-sm md:leading-8">
              {t('aboutPage.heroDescription').replace('{{brand}}', brandName)}
            </p>
            <p className="text-[13px] leading-6 text-[var(--text-secondary)] md:text-sm md:leading-8">
              {t('sections.privatePresentationDescription')}
            </p>
          </div>
        </div>
      </section>

      <section ref={deckRef} className="section py-0">
        <div className="container-shell overflow-hidden py-10 sm:py-14 md:sticky md:top-24 md:py-24">
          <div className="mb-6 flex items-end justify-between gap-6 md:mb-10">
            <div>
              <p className="eyebrow mb-3">{t('sections.projects')}</p>
              <h2 className="font-serif text-[clamp(1.8rem,6vw,4.8rem)]">{t('sections.projectsHighlightTitle')}</h2>
            </div>
            <Link href="/projects" className="btn-luxury hidden md:inline-flex">
              {t('cta.discoverProjects')}
            </Link>
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:px-0 md:gap-8">
            {leadProjects.map((project, index) => {
              const safeSlug = getSafeProjectSlug(project, projects);
              return (
                <FeaturedProjectCard
                  key={safeSlug || project.slug || project.name}
                  project={project}
                  href={`/projects/${safeSlug}`}
                  index={index}
                  locale={locale}
                  scrollYProgress={scrollYProgress}
                />
              );
            })}
          </div>
          <Link href="/projects" className="btn-luxury mt-6 inline-flex w-full justify-center px-5 py-3 text-[10px] md:hidden">
            {t('cta.discoverProjects')}
          </Link>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 md:px-10 md:py-10">
        <div className="container-shell border-y border-[var(--gold-border)] py-6 md:py-8">
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-center md:grid-cols-4 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center ${index > 0 ? 'md:border-l md:border-[var(--gold-border)]' : ''}`}
              >
                <p className="font-serif text-4xl text-[var(--gold)] sm:text-5xl md:text-6xl">{stat.value}</p>
                <p className="label-tag mt-2 text-[9px] sm:text-xs md:mt-4">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <HeroProductMiniWindow
            product={selectedProduct}
            locale={locale}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FeaturedProjectCard({
  project,
  href,
  index,
  locale,
  scrollYProgress,
}: {
  project: Project;
  href: string;
  index: number;
  locale: string;
  scrollYProgress: MotionValue<number>;
}) {
  const translateX = useTransform(scrollYProgress, [0, 1], [200 - index * 40, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [45 - index * 6, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const projectName = getLocalizedField(project, 'name', locale);
  const projectCity = getLocalizedField(project, 'city', locale);
  const projectCountry = getLocalizedField(project, 'country', locale);
  const description = getLocalizedField(project, 'description', locale);

  return (
    <motion.div style={{ x: translateX, rotateY, opacity, transformPerspective: 1600 }} className="min-w-[85vw] snap-center origin-center sm:min-w-[70vw] md:min-w-0 md:origin-left">
      <Link href={href}>
        <Card3D className="h-full overflow-hidden bg-[var(--bg-surface)]">
          <div className="relative aspect-[16/9] border-b border-[var(--hairline)] md:aspect-[5/4]">
            <Image
              src={project.images?.[0] ?? '/images/placeholder.svg'}
              alt={projectName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-2.5 px-3 py-3 md:space-y-4 md:px-6 md:py-6">
            <p className="eyebrow">
              {projectCity} · {projectCountry}
            </p>
            <h3 className="font-serif text-xl text-[var(--text-primary)] md:text-3xl">{projectName}</h3>
            <p className="line-clamp-3 text-[13px] leading-5 text-[var(--text-secondary)] md:text-sm md:leading-7">{description}</p>
          </div>
        </Card3D>
      </Link>
    </motion.div>
  );
}

function HeroProductMiniWindow({
  product,
  locale,
  onClose,
}: {
  product: StoreProductRecord;
  locale: Locale;
  onClose: () => void;
}) {
  const t = useTranslations();
  const displayName = getStoreTranslation(product.nameTranslations ?? product.name, locale) || product.name;
  const description = getStoreTranslation(product.descriptionTranslations ?? product.description, locale) || product.description;
  const categoryLabel = getStoreCategoryLabel(product.category, t) || product.category;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-black/50 p-3 backdrop-blur-sm md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
        className="mx-auto mt-[5vh] grid max-w-4xl overflow-hidden border border-[var(--gold-border)] bg-[var(--bg-surface)] shadow-[0_30px_120px_rgba(0,0,0,0.55)] md:mt-[8vh] md:grid-cols-[1.05fr_0.95fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative min-h-[200px] md:min-h-[320px]">
          <Image
            src={product.images?.[0] ?? '/images/placeholder.svg'}
            alt={displayName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col p-3.5 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">{categoryLabel}</p>
            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)] transition hover:text-[var(--gold)]"
            >
              {t('cta.close')}
            </button>
          </div>
          <h2 className="mt-3 font-serif text-[1.35rem] leading-tight text-white md:mt-4 md:text-4xl">{displayName}</h2>
          <p className="mt-3 line-clamp-4 text-[13px] leading-5 text-[var(--text-secondary)] md:mt-5 md:line-clamp-6 md:text-sm md:leading-7">{description}</p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row md:mt-8 md:gap-3">
            <Link
              href={`/store/${product.slug}/`}
              className="btn-luxury btn-luxury-filled flex-1"
            >
              {t('homePage.openProduct')}
            </Link>
            <a
              href={`https://wa.me/905061380111?text=Merhaba,%20${encodeURIComponent(displayName)}%20için%20sipariş%20vermek%20istiyorum.`}
              target="_blank"
              rel="noreferrer"
              className="btn-luxury flex-1"
            >
              {t('homePage.whatsApp')}
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
