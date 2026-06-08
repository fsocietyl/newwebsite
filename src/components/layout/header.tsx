'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, MessageCircle, X } from 'lucide-react';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';

const languages: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'ar', label: 'AR' },
];

const navPaths = [
  { href: '/', key: 'home' },
  { href: '/products', key: 'products' },
  { href: '/store', key: 'newProducts' },
  { href: '/projects', key: 'projects' },
  { href: '/about', key: 'about' },
  { href: '/orders', key: 'orders' },
  { href: '/contact', key: 'contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b border-transparent bg-black/58 transition-all duration-500',
          scrolled && 'border-[var(--gold-border)] bg-black/78 backdrop-blur-md',
        )}
      >
        <div className="flex h-[56px] w-full items-center gap-2 px-3 sm:gap-2.5 sm:px-5 lg:h-[60px] lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-1.5 pr-2 sm:gap-2">
            <span className="flex h-8 w-10 shrink-0 items-center justify-start overflow-hidden sm:h-9 sm:w-11 lg:h-10 lg:w-12">
              <Image
                src="/logo-header.png"
                alt={t('brand.name')}
                width={72}
                height={36}
                priority
                className="h-full w-auto max-w-none object-contain object-left brightness-110"
              />
            </span>
            <span className="whitespace-nowrap font-serif text-[8px] uppercase tracking-[0.16em] text-[var(--text-primary)] sm:text-[9px] lg:text-[10px]">
              {t('brand.name')}
            </span>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:flex lg:gap-5">
            {navPaths.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all after:duration-300 hover:text-[var(--gold)] hover:after:w-full',
                    active && 'text-[var(--gold)] after:w-full',
                  )}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <div className="flex items-center gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLocale(lang.code)}
                  className={cn(
                    'min-h-[36px] rounded-full border border-[var(--gold-border)] px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--text-primary)]',
                    locale === lang.code && 'bg-[var(--gold)] text-black',
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <Link
              href="https://wa.me/905061380111"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--gold-border)] text-[var(--gold)] transition-transform duration-300 hover:scale-110 hover:border-[var(--gold)] hover:bg-[var(--gold-glow)]"
            >
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile: language + hamburger */}
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <div className="flex items-center gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLocale(lang.code)}
                  className={cn(
                  'rounded-full border border-[var(--gold-border)] px-2 py-1 text-[8px] uppercase tracking-[0.2em] text-[var(--text-secondary)] transition-all duration-300',
                    locale === lang.code && 'bg-[var(--gold)] text-black',
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--gold-border)] bg-black/50 text-[var(--gold)] backdrop-blur"
              onClick={() => setMobileOpen((current) => !current)}
              aria-label={t('nav.openMenu')}
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-[200] bg-[rgba(0,0,0,0.97)] backdrop-blur-xl transition-opacity duration-300 lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--gold-border)] text-[var(--gold)]"
          onClick={() => setMobileOpen(false)}
          aria-label={t('nav.closeMenu')}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-full flex-col items-center justify-center gap-6 px-8 pb-[env(safe-area-inset-bottom)] text-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-header.png"
              alt={t('brand.name')}
              width={98}
              height={66}
              className="h-11 w-auto object-contain opacity-95"
            />
            <p className="font-serif text-sm uppercase tracking-[0.22em] text-[var(--text-primary)]">{t('brand.name')}</p>
          </div>
          <nav className="flex flex-col items-center gap-5">
            {navPaths.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-serif text-2xl text-[var(--text-primary)] transition-colors duration-300 hover:text-[var(--gold)] active:opacity-80 sm:text-[2rem]',
                  pathname === item.href && 'text-[var(--gold)]',
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          <Link
            href="https://wa.me/905061380111"
            target="_blank"
            rel="noreferrer"
            className="btn-luxury"
          >
            {t('homePage.whatsApp')}
          </Link>
        </div>
      </div>
    </>
  );
}
