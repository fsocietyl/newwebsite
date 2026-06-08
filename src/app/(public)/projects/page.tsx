'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useContent } from '@/components/providers/content-provider';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import { getLocalizedField } from '@/lib/locale-utils';
import { getSafeProjectSlug } from '@/lib/slug';

export default function ProjectsPage() {
  const { projects } = useContent();
  const { locale } = useLocale();
  const t = useTranslations();
  const cities = projects.map((project) => getLocalizedField(project, 'city', locale).toUpperCase());

  return (
    <div className="page">
      <section className="relative h-[35vh] min-h-[250px] overflow-hidden px-4 py-16 sm:h-[45vh] sm:px-6 sm:py-20 md:h-[55vh] md:px-10">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 overflow-hidden opacity-20">
          <div className="marquee-track font-serif text-[clamp(60px,15vw,120px)] leading-none text-[var(--gold)] md:text-[clamp(80px,12vw,160px)]">
            {[...cities, ...cities, ...cities].map((city, index) => (
              <span key={`${city}-${index}`} className="pr-16 md:pr-20">
                {city}
                <span className="px-8 text-[var(--gold-dim)] md:px-10">·</span>
              </span>
            ))}
          </div>
        </div>
        <div className="relative text-center">
          <p className="eyebrow mb-4 sm:mb-6">{t('nav.projects')}</p>
          <h1 className="font-serif text-[clamp(36px,7vw,100px)] tracking-[0.06em] text-white">{t('projects.title')}</h1>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:px-10 md:pb-24">
        <div className="container-shell">
          {projects.map((project, index) => {
            const safeSlug = getSafeProjectSlug(project, projects);
            const projectName = getLocalizedField(project, 'name', locale);
            const projectCity = getLocalizedField(project, 'city', locale);
            const projectCountry = getLocalizedField(project, 'country', locale);
            const description = getLocalizedField(project, 'description', locale);
            const imageBlock = (
              <div className="overflow-hidden border border-[var(--hairline)] bg-[var(--bg-surface)]">
                <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/9] lg:aspect-auto lg:h-full">
                  <Image
                    src={project.images?.[0] ?? '/images/placeholder.svg'}
                    alt={projectName}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
              </div>
            );
            const infoBlock = (
              <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10 xl:p-16">
                <p className="mb-3 text-[9px] uppercase tracking-[0.28em] text-[var(--gold)] sm:mb-4 sm:text-[10px]">
                  {projectCity} · {projectCountry}
                </p>
                <h2 className="font-serif text-2xl text-white sm:text-3xl lg:text-4xl xl:text-5xl">{projectName}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)] line-clamp-3 sm:mt-4 sm:leading-8 lg:line-clamp-none">{description}</p>
                <Link
                  href={`/projects/${safeSlug}`}
                  className="mt-4 inline-flex items-center gap-2 text-xs text-[var(--gold)] transition-all hover:gap-3 sm:mt-6 sm:text-sm"
                >
                  {t('projects.view')} →
                </Link>
              </div>
            );

            return (
              <motion.article
                key={safeSlug || project.slug || project.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
                className="border-b border-[var(--hairline)] py-10 sm:py-14"
              >
                <div className="lg:hidden">{imageBlock}</div>
                <div className="lg:hidden">{infoBlock}</div>
                <div className={`hidden min-h-[500px] items-stretch gap-10 xl:gap-16 lg:grid ${index % 2 === 0 ? 'lg:grid-cols-[55%_45%]' : 'lg:grid-cols-[45%_55%]'}`}>
                  {index % 2 === 0 ? (
                    <>
                      {imageBlock}
                      {infoBlock}
                    </>
                  ) : (
                    <>
                      {infoBlock}
                      {imageBlock}
                    </>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
