'use client';

import { useTranslations } from '@/components/providers/locale-provider';

const WHATSAPP_NUMBER = '905061380111';

export function WhatsAppFloat() {
  const t = useTranslations();
  return (
    <div className="whatsapp-float">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)] text-white shadow-[0_10px_40px_-10px_rgba(201,168,76,0.5)] transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] md:h-14 md:w-14"
        aria-label={t('storePage.whatsAppAria')}
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[var(--gold)] opacity-30 animate-ping" />
        <svg
          viewBox="0 0 32 32"
          className="relative z-10 h-5 w-5 fill-white sm:h-6 sm:w-6 md:h-7 md:w-7"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M16.04 3.2c-6.94 0-12.6 5.65-12.6 12.6 0 2.22.58 4.4 1.68 6.33L3 29l7.1-2.07a12.5 12.5 0 0 0 5.94 1.5h.01c6.94 0 12.6-5.66 12.6-12.61 0-6.95-5.66-12.62-12.6-12.62zm0 22.9h-.01c-1.87 0-3.71-.5-5.33-1.46l-.38-.22-4.2 1.23 1.28-4.1-.25-.4a10.46 10.46 0 0 1-1.6-5.6c0-5.77 4.7-10.47 10.48-10.47 5.77 0 10.47 4.7 10.47 10.47 0 5.78-4.7 10.48-10.46 10.48zm5.74-7.87c-.31-.16-1.86-.92-2.15-1.02-.29-.11-.5-.16-.71.16-.2.31-.82 1.02-1.01 1.23-.19.2-.38.23-.7.08-.31-.16-1.33-.49-2.53-1.56-.93-.83-1.55-1.85-1.73-2.16-.18-.31-.02-.48.14-.64.14-.14.31-.38.46-.57.15-.19.2-.32.31-.53.1-.2.05-.38-.03-.53-.08-.16-.71-1.7-.98-2.33-.26-.63-.52-.54-.71-.55h-.6c-.2 0-.53.08-.8.38-.27.31-1.05 1.03-1.05 2.52 0 1.48 1.08 2.91 1.23 3.11.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.86-.76 2.12-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.2-.6-.36z" />
        </svg>
        <span className="pointer-events-none absolute right-full top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-[var(--gold-border)] bg-black/90 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[var(--text-primary)] shadow-lg md:group-hover:flex">
          {t('storePage.whatsAppTooltip')}
        </span>
      </a>
    </div>
  );
}
