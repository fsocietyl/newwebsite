'use client';

import type { ReactNode } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslations } from '@/components/providers/locale-provider';

const PHONE_NUMBERS = [
  { display: '+90 506 138 01 11', link: '+905061380111' },
  { display: '+90 212 295 59 99', link: '+902122955999' },
  { display: '+90 534 922 9658', link: '+905349229658' },
];

export default function ContactPage() {
  const t = useTranslations();

  return (
    <div className="page px-4 py-16 sm:px-8 sm:py-24 lg:py-32 md:px-10">
      <div className="container-narrow max-w-4xl">
        <p className="eyebrow mb-4 sm:mb-5">{t('nav.contact')}</p>
        <h1 className="font-serif text-3xl leading-[0.95] text-[var(--gold)] sm:text-4xl md:text-5xl">{t('contact.title')}</h1>
        <div className="mt-5 h-px w-24 bg-[var(--gold)] sm:mt-6" />
        <div className="mt-8 space-y-2 border-t border-white/5 sm:mt-10">
          <ContactRow icon={<MapPin className="h-5 w-5" />} label={t('contact.office')} value={t('contactPage.officeAddress')} />
          <div className="border-b border-white/5 py-6 sm:py-8">
            <div className="flex flex-col items-start gap-3 sm:gap-4 md:flex-row md:gap-6">
              <div className="mt-1 text-[var(--gold)]">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--gold)] sm:text-xs">{t('contactPage.phoneLabel')}</p>
                <div className="mt-2 space-y-2 sm:mt-3">
                  {PHONE_NUMBERS.map((phone) => (
                    <p key={phone.link} className="font-serif text-base text-white sm:text-xl md:text-2xl">
                      <a href={`tel:${phone.link}`}>{phone.display}</a>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <ContactRow icon={<Mail className="h-5 w-5" />} label={t('contactPage.emailLabel')} value="info@sign-d.net" href="mailto:info@sign-d.net" />
        </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = href ? <a href={href}>{value}</a> : value;
  return (
    <div className="border-b border-white/5 py-6 sm:py-8">
      <div className="flex flex-col items-start gap-3 sm:gap-4 md:flex-row md:gap-6">
        <div className="mt-1 text-[var(--gold)]">{icon}</div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--gold)] sm:text-xs">{label}</p>
          <p className="mt-2 font-serif text-base text-white sm:mt-3 sm:text-xl md:text-2xl">{content}</p>
        </div>
      </div>
    </div>
  );
}
