'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, Project } from '@/types/content';
import { Breadcrumbs } from '@/components/sections/breadcrumbs';
import { Card3D } from '@/components/ui/card-3d';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import { getLocalizedField } from '@/lib/locale-utils';

type Props = {
  project: Project;
  related: Product[];
  slug?: string;
};

export function ProjectDetailClient({ project, related, slug }: Props) {
  const t = useTranslations();
  const { locale } = useLocale();
  const gallery = project.images?.length ? project.images : ['/images/placeholder.svg'];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const projectName = getLocalizedField(project, 'name', locale);
  const projectCity = getLocalizedField(project, 'city', locale);
  const projectCountry = getLocalizedField(project, 'country', locale);
  const description = getLocalizedField(project, 'description', locale);
  const projectTypeLabel = t(`projectTypes.${project.type}`);

  const breadcrumbs = [
    { href: '/', label: t('nav.home') },
    { href: '/projects', label: t('nav.projects') },
    { href: `/projects/${slug ?? project.slug}`, label: projectName },
  ];

  return (
    <div className="page pt-0">
      <Breadcrumbs items={breadcrumbs} />

      <section className="relative h-[45vh] min-h-[280px] overflow-hidden sm:h-[55vh] md:h-[75vh] md:min-h-[500px]">
        <Image src={gallery[0]} alt={`${projectName} hero`} fill className="object-cover object-center" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/80" />
        <div className="absolute bottom-6 left-4 right-4 sm:bottom-8 sm:left-6 sm:right-6 md:bottom-12 md:left-12 md:right-12">
          <p className="mb-2 text-[9px] uppercase tracking-[0.28em] text-[var(--gold)] sm:mb-4 sm:text-xs">
            {projectCity} · {projectCountry}
          </p>
          <h1 className="font-serif text-xl text-white sm:text-2xl md:text-4xl lg:text-5xl">{projectName}</h1>
        </div>
      </section>

      <section className="border-b border-[var(--gold-border)] px-4 py-4 sm:px-6 sm:py-6 md:px-12">
        <div className="container-shell flex flex-wrap gap-4 sm:gap-8 md:gap-10">
          <MetaItem label={t('project.year')} value={String(project.year)} />
          <MetaItem label={t('project.type')} value={projectTypeLabel} />
          <MetaItem label={t('project.location')} value={`${projectCity}, ${projectCountry}`} />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8 sm:py-16 lg:px-0">
        <div className="container-narrow">
          <p className="font-serif text-[clamp(16px,1.5vw,20px)] leading-[1.8] text-[#ccc]">{description}</p>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 md:px-10 md:pb-12">
        <div className="container-shell columns-1 gap-2 sm:columns-2 sm:gap-3 md:columns-3 md:gap-4">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="relative mb-2 block w-full break-inside-avoid overflow-hidden border border-[var(--hairline)] transition hover:opacity-90 active:opacity-75 sm:mb-3 md:mb-4"
            >
              <Image
                src={image}
                alt={`${projectName} gallery image ${index + 1}`}
                width={1200}
                height={900}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:px-10 md:pb-24">
        <div className="container-shell">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3 sm:mb-4">{t('project.related')}</p>
              <h2 className="font-serif text-2xl text-white sm:text-3xl md:text-4xl">{projectName}</h2>
            </div>
            <Link href="/products" className="btn-luxury hidden md:inline-flex">
              {t('nav.products')}
            </Link>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:gap-4 sm:px-6 md:mx-0 md:px-0">
            {related.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}/`} className="min-w-[200px] flex-shrink-0 sm:min-w-[240px] md:min-w-[280px]">
                <Card3D className="overflow-hidden bg-[var(--bg-surface)]">
                  <div className="relative aspect-[1/1]">
                    <Image
                      src={product.images?.[0] ?? '/images/placeholder.svg'}
                      alt={getLocalizedField(product, 'name', locale)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 280px"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="mb-1 text-[9px] uppercase tracking-[0.28em] text-[var(--gold)] sm:mb-2 sm:text-[10px]">{getLocalizedField(product, 'category', locale)}</p>
                    <h3 className="font-serif text-base text-white sm:text-xl">{getLocalizedField(product, 'name', locale)}</h3>
                  </div>
                </Card3D>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[120] bg-black/95 px-6 py-10"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="mx-auto flex h-full max-h-[90vh] w-full max-w-6xl flex-col gap-4" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between text-[var(--text-primary)]">
              <p className="font-serif text-xl">
                {projectName} — {lightboxIndex + 1}/{gallery.length}
              </p>
              <button type="button" className="text-sm uppercase tracking-[0.28em] text-[var(--gold)]" onClick={() => setLightboxIndex(null)}>
                {t('cta.close')}
              </button>
            </div>
            <div className="relative flex-1 overflow-hidden border border-[var(--gold-border)]">
              <Image
                src={gallery[lightboxIndex]}
                alt={`${projectName} enlarged image`}
                fill
                className="object-contain"
                sizes="1200px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--gold)] sm:text-[10px]">{label}</p>
      <p className="mt-1 font-serif text-lg text-white sm:mt-2 sm:text-2xl">{value}</p>
    </div>
  );
}
