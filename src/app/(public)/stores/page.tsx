'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { useContent } from '@/components/providers/content-provider';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import { Card3D } from '@/components/ui/card-3d';
import { getLocalizedField } from '@/lib/locale-utils';

export default function StoresPage() {
  const { stores } = useContent();
  const { locale } = useLocale();
  const t = useTranslations();

  return (
    <div className="page">
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 md:px-10">
        <WorldMap />
        <div className="container-shell relative text-center">
          <p className="eyebrow mb-4 sm:mb-6">{t('nav.stores')}</p>
          <h1 className="font-serif text-[clamp(40px,10vw,200px)] leading-[0.95] text-white">{t('stores.title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-[var(--text-secondary)] sm:mt-6">{t('storesPage.subtitle')}</p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:px-10 md:pb-24">
        <div className="container-shell grid gap-4 sm:grid-cols-2 sm:gap-5 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {stores.map((store) => {
            const storeName = getLocalizedField(store, 'name', locale);
            const storeCountry = getLocalizedField(store, 'country', locale);
            const storeAddress = getLocalizedField(store, 'address', locale);
            const storeHours = getLocalizedField(store, 'hours', locale);
            return (
            <Card3D key={store.name} className="h-full bg-[var(--bg-surface)] p-6 sm:p-8">
              <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-[var(--gold)] sm:mb-3 sm:text-[10px]">{storeCountry}</p>
              <h2 className="font-serif text-lg text-white sm:text-xl lg:text-2xl">{storeName}</h2>
              <div className="my-4 h-px w-8 bg-[rgba(201,168,76,0.4)]" />
              <div className="space-y-3 text-xs leading-6 text-[var(--text-secondary)] sm:space-y-4 sm:text-sm sm:leading-7">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--gold)]" />
                  <span>{storeAddress}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-4 w-4 shrink-0 text-[var(--gold)]" />
                  <span>{storeHours}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-[var(--gold)]" />
                  <span>{store.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-[var(--gold)]" />
                  <span>{store.email}</span>
                </div>
              </div>
              {store.mapUrl && (
                <Link
                  href={store.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-[44px] items-center text-[10px] uppercase tracking-[0.22em] text-[var(--gold)] sm:mt-6 sm:text-xs"
                >
                  {t('stores.directions')}
                </Link>
              )}
            </Card3D>
          )})}
        </div>
      </section>
    </div>
  );
}

function WorldMap() {
  const dots = [];
  for (let y = 0; y < 24; y += 1) {
    for (let x = 0; x < 60; x += 1) {
      const inAm = y > 4 && y < 18 && x > 6 && x < 20;
      const inEur = y > 4 && y < 12 && x > 25 && x < 36;
      const inAfr = y > 10 && y < 20 && x > 26 && x < 34;
      const inAsia = y > 4 && y < 16 && x > 36 && x < 52;
      const inOce = y > 16 && y < 22 && x > 46 && x < 54;
      if (inAm || inEur || inAfr || inAsia || inOce) {
        dots.push(<circle key={`${x}-${y}`} cx={x * 22} cy={y * 22} r="1.2" fill="var(--gold)" opacity="0.18" />);
      }
    }
  }

  return (
    <svg viewBox="0 0 1320 528" className="pointer-events-none absolute inset-0 h-full w-full opacity-50">
      {dots}
    </svg>
  );
}
