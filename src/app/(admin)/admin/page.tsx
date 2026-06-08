"use client";

import { useContent } from '@/components/providers/content-provider';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/components/providers/locale-provider';
import { useToast } from '@/components/ui/use-toast';

export default function AdminDashboardPage() {
  const { brands, products, projects, stores, news, syncSeedContent, syncing } = useContent();
  const t = useTranslations();
  const { toast } = useToast();

  const stats = [
    { label: t('nav.brands'), value: brands.length },
    { label: t('nav.projects'), value: projects.length },
    { label: t('nav.stores'), value: stores.length },
    { label: t('nav.news'), value: news.length },
    { label: t('nav.collections'), value: products.length },
  ];

  const handleSync = async () => {
    const success = await syncSeedContent();
    toast({
      title: success ? 'Seed sync complete' : 'Seed sync failed',
      description: success
        ? 'All seed data is now added to Firestore.'
        : 'Please configure Firebase credentials.',
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">{t('admin.welcome')}</p>
          <h1 className="mt-2 font-serif text-4xl text-white">{t('brand.name')} Control</h1>
        </div>
        <Button onClick={handleSync} disabled={syncing}>
          {syncing ? t('status.loading') : t('admin.sync')}
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-[var(--gold-border)] bg-[rgba(8,8,8,0.9)] px-6 py-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">{stat.label}</p>
            <p className="mt-4 font-serif text-4xl text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
