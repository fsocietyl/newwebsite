'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/components/providers/locale-provider';

const links = [
  { href: '/admin', labelKey: 'welcome' },
  { href: '/admin/homepage', label: 'Homepage' },
  { href: '/admin/brands', labelKey: 'brands' },
  { href: '/admin/products', labelKey: 'products' },
  { href: '/admin/store-products', label: 'Store Products' },
  { href: '/admin/projects', labelKey: 'projects' },
  { href: '/admin/stores', labelKey: 'stores' },
  { href: '/admin/news', labelKey: 'news' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const t = useTranslations();

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <aside className="hidden w-72 flex-col border-r border-[var(--gold-border)] bg-[rgba(8,8,8,0.94)] px-6 py-8 md:flex">
        <p className="text-xs uppercase tracking-[0.6em] text-[var(--gold)]">Admin</p>
        <nav className="mt-6 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-transparent px-4 py-3 transition hover:border-[var(--gold-border)] hover:bg-[rgba(201,168,76,0.08)] hover:text-[var(--text-primary)]"
            >
              {link.labelKey ? t(`admin.${link.labelKey}`) : link.label}
            </Link>
          ))}
        </nav>
        {user && (
          <Button className="mt-auto" variant="outline" onClick={() => logout()}>
            {t('admin.logout')}
          </Button>
        )}
      </aside>
      <div className="flex-1 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.08),transparent_35%)] px-6 py-8 md:px-10">
        {children}
      </div>
    </div>
  );
}
