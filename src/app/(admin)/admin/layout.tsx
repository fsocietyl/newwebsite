"use client";

import { usePathname } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { AdminGuard } from '@/components/admin/admin-guard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.includes('/admin/login');

  if (isLogin) {
    return <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">{children}</div>;
  }

  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
