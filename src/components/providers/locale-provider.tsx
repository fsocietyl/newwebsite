'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, Dictionary, Locale, getDictionary, translate } from '@/lib/i18n';

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
  dir: 'ltr' | 'rtl';
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const STORAGE_KEY = 'luxury-group-locale';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale | null>(null);

  const detectBrowserLocale = () => {
    if (typeof navigator === 'undefined') return null;
    const lang = navigator.language?.toLowerCase() || navigator.languages?.[0]?.toLowerCase();
    if (!lang) return null;
    if (lang.startsWith('tr')) return 'tr';
    if (lang.startsWith('ar')) return 'ar';
    return 'en';
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && (stored === 'en' || stored === 'tr' || stored === 'ar')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(stored);
      return;
    }
    const detected = detectBrowserLocale();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(detected ?? DEFAULT_LOCALE);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !locale) return;
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const resolvedLocale = locale ?? DEFAULT_LOCALE;
    const dictionary = getDictionary(resolvedLocale);
    const dir = resolvedLocale === 'ar' ? 'rtl' : 'ltr';
    return {
      locale: resolvedLocale,
      dictionary,
      dir,
      setLocale: setLocaleState as (locale: Locale) => void,
      t: (path: string) => translate(path, dictionary),
    };
  }, [locale]);

  // Avoid flashing the default language before detection by waiting for client to pick a locale
  if (!locale) {
    return null;
  }

  return (
    <LocaleContext.Provider value={value}>
      <div className="min-h-screen bg-[#050505] text-[#f4f0e7]" dir={value.dir}>
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}

export function useTranslations() {
  const { t } = useLocale();
  return t;
}
