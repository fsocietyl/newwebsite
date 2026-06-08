'use client';

import Image from 'next/image';
import { useTranslations } from '@/components/providers/locale-provider';

export default function AboutPage() {
  const t = useTranslations();
  const brandName = t('brand.name');
  const intro = t('aboutPage.heroDescription').replace('{{brand}}', brandName);
  const timeline = [
    {
      year: '1994',
      title: t('aboutPage.timeline1.title'),
      description: t('aboutPage.timeline1.description').replace('{{brand}}', brandName),
    },
    {
      year: '2008',
      title: t('aboutPage.timeline2.title'),
      description: t('aboutPage.timeline2.description').replace('{{brand}}', brandName),
    },
    {
      year: '2018',
      title: t('aboutPage.timeline3.title'),
      description: t('aboutPage.timeline3.description').replace('{{brand}}', brandName),
    },
    {
      year: '2024',
      title: t('aboutPage.timeline4.title'),
      description: t('aboutPage.timeline4.description').replace('{{brand}}', brandName),
    },
  ];
  const stats = [
    { value: '30+', label: t('aboutPage.stats.years') },
    { value: '120', label: t('aboutPage.stats.projects') },
    { value: '8', label: t('aboutPage.stats.studios') },
    { value: '60', label: t('aboutPage.stats.partners') },
  ];

  return (
    <div className="page">
      <section className="grid grid-cols-1 md:grid-cols-2 md:h-[60vh] lg:h-[85vh]">
        <div className="flex flex-col justify-end bg-[var(--bg-base)] py-12 px-5 sm:p-8 md:p-20">
          <p className="eyebrow mb-4 sm:mb-6">{t('nav.about')}</p>
          <h1 className="font-serif text-2xl leading-[1.02] text-white sm:text-3xl md:text-4xl lg:text-5xl">
            {t('about.title')} <em className="text-[var(--gold)]">{t('about.craftsmanship.title')}</em>.
          </h1>
          <div className="mt-6 h-px w-24 bg-[var(--gold)] sm:mt-8" />
          <p className="mt-6 max-w-xl text-sm leading-8 text-[var(--text-secondary)] sm:mt-8">{intro}</p>
        </div>
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-0">
          <Image src="/hero-real-1.webp" alt={brandName} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute right-4 top-4 h-16 w-16 border-r border-t border-[var(--gold)] md:right-8 md:top-8 md:h-24 md:w-24" />
          <div className="absolute bottom-4 left-4 h-16 w-16 border-b border-l border-[var(--gold)] md:bottom-8 md:left-8 md:h-24 md:w-24" />
        </div>
      </section>

      <section className="section">
        <div className="container-shell relative">
          {/* Desktop center line */}
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[rgba(201,168,76,0.3)] md:block" />
          {/* Mobile left line */}
          <div className="absolute bottom-0 left-4 top-0 w-px bg-[rgba(201,168,76,0.3)] md:hidden" />
          {timeline.map((entry, index) => (
            <div key={entry.year} className="relative grid gap-8 py-8 md:grid-cols-2 md:gap-16 md:py-10">
              {/* Mobile layout: single column with left indentation */}
              <div className="relative pl-8 md:hidden">
                <div className="absolute -left-[5px] top-3 h-3 w-3 rounded-full bg-[var(--gold)]" />
                <p className="font-serif text-4xl text-[var(--gold)] sm:text-5xl">{entry.year}</p>
                <h2 className="mt-2 font-serif text-xl text-white sm:text-2xl">{entry.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{entry.description}</p>
              </div>
              {/* Desktop alternating layout */}
              <div className={`hidden md:block ${index % 2 === 0 ? 'text-right md:pr-16' : 'order-2 md:pl-16'}`}>
                {index % 2 === 0 && (
                  <>
                    <p className="font-serif text-6xl text-[var(--gold)]">{entry.year}</p>
                    <h2 className="mt-3 font-serif text-3xl text-white">{entry.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{entry.description}</p>
                  </>
                )}
              </div>
              <div className={`hidden md:block ${index % 2 === 0 ? 'pl-16' : 'pr-16 text-right'}`}>
                <div className="absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gold)] md:block" />
                {index % 2 !== 0 && (
                  <>
                    <p className="font-serif text-6xl text-[var(--gold)]">{entry.year}</p>
                    <h2 className="mt-3 font-serif text-3xl text-white">{entry.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{entry.description}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 sm:py-10 md:px-10">
        <div className="container-shell border-y border-[var(--gold-border)] py-6 sm:py-8">
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-center md:grid-cols-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className={`text-center ${index > 0 ? 'md:border-l md:border-[var(--gold-border)]' : ''}`}>
                <p className="font-serif text-4xl text-[var(--gold)] sm:text-5xl md:text-6xl">{stat.value}</p>
                <p className="label-tag mt-2 text-[9px] sm:text-xs md:mt-4">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-16 text-center sm:py-24 md:py-32">
        <div className="container-narrow relative px-6 sm:px-8">
          <div className="pointer-events-none absolute left-1/2 top-[-50px] -translate-x-1/2 select-none font-serif text-[120px] leading-none text-[rgba(201,168,76,0.1)] sm:text-[160px] md:text-[200px]">
            &quot;
          </div>
          <p className="mx-auto max-w-2xl font-serif text-xl italic leading-[1.35] text-white sm:text-2xl md:text-3xl">
            {t('aboutPage.craft.subtitle').replace('{{brand}}', brandName)}
          </p>
        </div>
      </section>
    </div>
  );
}
