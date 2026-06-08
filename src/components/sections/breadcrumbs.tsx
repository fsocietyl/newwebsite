"use client";

import Link from 'next/link';

type Crumb = {
  href: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
      {items.map((item, index) => (
        <span key={item.href}>
          {index > 0 && <span className="mx-2 text-[var(--gold)]/60">/</span>}
          <Link href={item.href} className="transition hover:text-[var(--gold)]">
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
