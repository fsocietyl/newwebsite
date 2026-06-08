'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from '@/components/providers/locale-provider';

const PHONE_NUMBERS = [
  { display: '+90 506 138 01 11', link: '+905061380111' },
  { display: '+90 212 295 59 99', link: '+902122955999' },
  { display: '+90 534 922 96 58', link: '+905349229658' },
];

export function Footer() {
  const t = useTranslations();
  const socialLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/sign.d.t.d/', icon: '/icons/instagram.svg' },
    { label: 'Facebook', href: 'https://www.facebook.com/share/1DLUHn6d7U/', icon: '/icons/facebook.svg' },
    { label: 'Trendyol', href: 'https://www.trendyol.com/magaza/sd-ticaret-m-938053?channelId=1&sst=0', icon: '/icons/trendyol.svg' },
    { label: 'Hepsiburada', href: 'https://www.hepsiburada.com/magaza/sign-grup', icon: '/icons/hepsiburada.svg' },
    { label: 'Sahibinden', href: 'https://www.sahibinden.com/satici-profili/signdisticaretvedekorasyonsanayilimitedl-bjRHhX6o6CQI795OLKeSuRg', icon: '/icons/sahibinden.svg' },
    { label: 'PTT AVM', href: 'https://www.pttavm.com/', icon: '/icons/pttavm.svg' },
  ];

  return (
    <footer className="relative z-[2] mt-24 border-t border-[var(--gold-border)] bg-[#0d0d0d] px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 md:px-10">
      <div className="container-shell grid gap-8 text-left md:grid-cols-2 md:gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-5">
          <div className="flex items-center justify-start gap-3">
            <Image src="/logo-header.png" alt={t('brand.name')} width={98} height={66} className="h-10 w-auto object-contain brightness-110" />
            <p className="font-serif text-sm uppercase tracking-[0.2em] text-[var(--text-primary)] sm:text-base">{t('brand.name')}</p>
          </div>
          <h4 className="max-w-md font-serif text-2xl leading-tight text-[var(--text-primary)] md:text-3xl">
            {t('footer.heading')}
          </h4>
          <p className="max-w-md text-sm leading-7 text-[var(--text-secondary)]">{t('footer.tagline')}</p>
        </div>

        <div className="space-y-4 text-sm text-[var(--text-secondary)]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">{t('footer.contactLabel')}</p>
          <div className="flex flex-col gap-3">
            <Link href="/products" className="transition-colors hover:text-[var(--gold)]">
              {t('nav.products')}
            </Link>
            <Link href="/projects" className="transition-colors hover:text-[var(--gold)]">
              {t('nav.projects')}
            </Link>
            <Link href="/about" className="transition-colors hover:text-[var(--gold)]">
              {t('nav.about')}
            </Link>
            <Link href="/stores" className="transition-colors hover:text-[var(--gold)]">
              {t('nav.stores')}
            </Link>
            <Link href="/orders" className="transition-colors hover:text-[var(--gold)]">
              {t('nav.orders')}
            </Link>
            <Link href="/contact" className="transition-colors hover:text-[var(--gold)]">
              {t('nav.contact')}
            </Link>
          </div>
        </div>

        <div className="space-y-4 text-sm text-[var(--text-secondary)]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">{t('sections.contact')}</p>
          <p className="leading-7">{t('contactPage.officeAddress')}</p>
          <div className="space-y-1">
            {PHONE_NUMBERS.map((phone) => (
              <p key={phone.link}>
                <a href={`tel:${phone.link}`} className="transition-colors hover:text-[var(--gold)]">
                  {phone.display}
                </a>
              </p>
            ))}
          </div>
          <p>
            <a href="mailto:info@sign-d.net" className="transition-colors hover:text-[var(--gold)]">
              info@sign-d.net
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-3">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 opacity-50 transition hover:text-[var(--gold)] hover:opacity-100"
              >
                <Image src={item.icon} alt={`${item.label} icon`} width={18} height={18} className="h-[18px] w-[18px] object-contain" />
                <span className="text-xs uppercase tracking-[0.2em]">{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-[var(--hairline)] pt-4">
            <Link href="/privacy" className="mr-5 transition-colors hover:text-[var(--gold)]">
              {t('sections.legalPrivacy')}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--gold)]">
              {t('sections.legalTerms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
