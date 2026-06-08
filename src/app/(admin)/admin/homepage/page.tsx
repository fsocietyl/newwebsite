'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  getStoreTranslation,
  type HomepageProductPosition,
  type HomepageSettings,
  type StoreProductRecord,
} from '@/lib/store-products';
import { useLocale } from '@/components/providers/locale-provider';

const MAX_HOMEPAGE_PRODUCTS = 9;
const MAX_MOBILE_HOMEPAGE_PRODUCTS = 5;
const DESKTOP_DEFAULTS: Array<{ x: number; y: number }> = [
  { x: 6, y: 10 },
  { x: 38, y: 16 },
  { x: 70, y: 12 },
  { x: 14, y: 48 },
  { x: 54, y: 50 },
  { x: 77, y: 44 },
  { x: 8, y: 73 },
  { x: 38, y: 72 },
  { x: 68, y: 70 },
];
const MOBILE_DEFAULTS: Array<{ x: number; y: number }> = [
  { x: 8, y: 12 },
  { x: 56, y: 20 },
  { x: 6, y: 44 },
  { x: 56, y: 54 },
  { x: 28, y: 72 },
];

type LayoutTarget = 'desktop' | 'mobile';

function normalizeLayout(slugs: string[], existing: HomepageProductPosition[] | undefined, defaults: Array<{ x: number; y: number }>) {
  return slugs.map((slug, index) => {
    const saved = existing?.find((item) => item.slug === slug);
    return {
      slug,
      x: saved?.x ?? defaults[index]?.x ?? 10 + index * 10,
      y: saved?.y ?? defaults[index]?.y ?? 10 + index * 10,
    };
  });
}

export default function AdminHomepagePage() {
  const { toast } = useToast();
  const { locale } = useLocale();
  const [products, setProducts] = useState<StoreProductRecord[]>([]);
  const [desktopSlugs, setDesktopSlugs] = useState<string[]>([]);
  const [desktopCount, setDesktopCount] = useState<number>(5);
  const [desktopLayout, setDesktopLayout] = useState<HomepageProductPosition[]>([]);
  const [mobileSlugs, setMobileSlugs] = useState<string[]>([]);
  const [mobileCount, setMobileCount] = useState<number>(3);
  const [mobileLayout, setMobileLayout] = useState<HomepageProductPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const [productsResponse, settingsResponse] = await Promise.all([
          fetch('/api/store-products', { cache: 'no-store' }),
          fetch('/api/homepage-settings', { cache: 'no-store' }),
        ]);

        if (!productsResponse.ok) {
          throw new Error(`Store product load failed: ${productsResponse.status}`);
        }
        if (!settingsResponse.ok) {
          throw new Error(`Homepage settings load failed: ${settingsResponse.status}`);
        }

        const productsData = (await productsResponse.json()) as StoreProductRecord[];
        const settings = (await settingsResponse.json()) as HomepageSettings | null;
        if (!active) return;

        const nextProducts = Array.isArray(productsData) ? productsData : [];
        setProducts(nextProducts);

        const nextDesktop = (
          settings?.featuredDesktopProductSlugs ??
          settings?.featuredProductSlugs ??
          []
        ).slice(0, MAX_HOMEPAGE_PRODUCTS);
        const nextMobile = (
          settings?.featuredMobileProductSlugs ??
          settings?.featuredProductSlugs ??
          []
        ).slice(0, MAX_MOBILE_HOMEPAGE_PRODUCTS);

        setDesktopSlugs(nextDesktop);
        setDesktopCount(
          Math.min(
            Math.max((settings?.featuredDesktopProductCount ?? settings?.featuredProductCount ?? nextDesktop.length ?? 1), 1),
            Math.max(nextDesktop.length, 1),
          ),
        );
        setDesktopLayout(normalizeLayout(nextDesktop, settings?.featuredDesktopLayout, DESKTOP_DEFAULTS));

        setMobileSlugs(nextMobile);
        setMobileCount(
          Math.min(
            Math.max((settings?.featuredMobileProductCount ?? settings?.featuredProductCount ?? nextMobile.length ?? 1), 1),
            Math.max(nextMobile.length, 1),
          ),
        );
        setMobileLayout(normalizeLayout(nextMobile, settings?.featuredMobileLayout, MOBILE_DEFAULTS));
      } catch (error) {
        console.error('[admin-homepage] load failed', error);
        if (!active) return;
        toast({
          title: 'Load failed',
          description: 'Homepage settings could not load the live store products.',
        });
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadSettings();
    return () => {
      active = false;
    };
  }, [toast]);

  const desktopProducts = useMemo(
    () => desktopSlugs.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as StoreProductRecord[],
    [desktopSlugs, products],
  );
  const mobileProducts = useMemo(
    () => mobileSlugs.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean) as StoreProductRecord[],
    [mobileSlugs, products],
  );

  const availableDesktopProducts = useMemo(
    () => products.filter((product) => !desktopSlugs.includes(product.slug)),
    [products, desktopSlugs],
  );
  const availableMobileProducts = useMemo(
    () => products.filter((product) => !mobileSlugs.includes(product.slug)),
    [products, mobileSlugs],
  );

  const updateLayout = (target: LayoutTarget, slug: string, x: number, y: number) => {
    const setter = target === 'desktop' ? setDesktopLayout : setMobileLayout;
    setter((current) =>
      current.map((item) =>
        item.slug === slug
          ? { ...item, x: Math.min(Math.max(x, 0), 92), y: Math.min(Math.max(y, 0), 88) }
          : item,
      ),
    );
  };

  const addProduct = (slug: string, target: LayoutTarget) => {
    const defaults = target === 'desktop' ? DESKTOP_DEFAULTS : MOBILE_DEFAULTS;
    const max = target === 'desktop' ? MAX_HOMEPAGE_PRODUCTS : MAX_MOBILE_HOMEPAGE_PRODUCTS;
    const setSlugs = target === 'desktop' ? setDesktopSlugs : setMobileSlugs;
    const setCount = target === 'desktop' ? setDesktopCount : setMobileCount;
    const setLayout = target === 'desktop' ? setDesktopLayout : setMobileLayout;

    setSlugs((current) => {
      if (current.includes(slug) || current.length >= max) return current;
      const next = [...current, slug];
      setCount((count) => Math.min(Math.max(count, 1), next.length));
      setLayout((layout) => [...layout, { slug, x: defaults[next.length - 1]?.x ?? 10, y: defaults[next.length - 1]?.y ?? 10 }]);
      return next;
    });
  };

  const removeProduct = (slug: string, target: LayoutTarget) => {
    const setSlugs = target === 'desktop' ? setDesktopSlugs : setMobileSlugs;
    const setCount = target === 'desktop' ? setDesktopCount : setMobileCount;
    const setLayout = target === 'desktop' ? setDesktopLayout : setMobileLayout;

    setSlugs((current) => {
      const next = current.filter((item) => item !== slug);
      setCount((count) => (next.length ? Math.min(count, next.length) : 1));
      return next;
    });
    setLayout((current) => current.filter((item) => item.slug !== slug));
  };

  const moveProduct = (slug: string, direction: -1 | 1, target: LayoutTarget) => {
    const setSlugs = target === 'desktop' ? setDesktopSlugs : setMobileSlugs;
    setSlugs((current) => {
      const index = current.indexOf(slug);
      if (index === -1) return current;
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
  };

  const handleSave = async () => {
    if (!desktopSlugs.length && !mobileSlugs.length) {
      toast({
        title: 'Select products first',
        description: 'Choose at least one product for desktop or phone homepage floating heroes.',
      });
      return;
    }

    const payload: HomepageSettings = {
      featuredProductSlugs: desktopSlugs.slice(0, MAX_HOMEPAGE_PRODUCTS),
      featuredProductCount: Math.min(Math.max(desktopCount, 1), Math.max(desktopSlugs.length, 1)),
      featuredDesktopProductSlugs: desktopSlugs.slice(0, MAX_HOMEPAGE_PRODUCTS),
      featuredDesktopProductCount: Math.min(Math.max(desktopCount, 1), Math.max(desktopSlugs.length, 1)),
      featuredDesktopLayout: desktopLayout.filter((item) => desktopSlugs.includes(item.slug)),
      featuredMobileProductSlugs: mobileSlugs.slice(0, MAX_MOBILE_HOMEPAGE_PRODUCTS),
      featuredMobileProductCount: Math.min(Math.max(mobileCount, 1), Math.max(mobileSlugs.length, 1)),
      featuredMobileLayout: mobileLayout.filter((item) => mobileSlugs.includes(item.slug)),
    };

    setSaving(true);
    try {
      const response = await fetch('/api/homepage-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Homepage save failed: ${response.status}`);
      toast({
        title: 'Homepage updated',
        description: 'Desktop and phone floating homepage products were saved.',
      });
    } catch (error) {
      console.error('[admin-homepage] save failed', error);
      toast({
        title: 'Save failed',
        description: 'Homepage settings could not be saved.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">Homepage</p>
        <h1 className="mt-2 font-serif text-4xl text-white">Control floating products</h1>
        <p className="mt-3 max-w-3xl text-sm text-[var(--text-secondary)]">
          Choose separate floating store products for desktop and phone, drag them into place on the live preview canvases, then save both layouts together.
        </p>
      </div>

      <div className="grid gap-8 2xl:grid-cols-2">
        <LayoutSection
          title="Desktop floating products"
          subtitle="Drag the pieces anywhere in the desktop scene."
          countLabel="Desktop count"
          products={desktopProducts}
          availableProducts={availableDesktopProducts}
          slugs={desktopSlugs}
          count={desktopCount}
          max={MAX_HOMEPAGE_PRODUCTS}
          layout={desktopLayout}
          target="desktop"
          locale={locale}
          loading={loading}
          onAdd={addProduct}
          onRemove={removeProduct}
          onMove={moveProduct}
          onCountChange={setDesktopCount}
          onPositionChange={updateLayout}
        />

        <LayoutSection
          title="Phone floating products"
          subtitle="Drag the pieces for the smaller mobile floating scene."
          countLabel="Phone count"
          products={mobileProducts}
          availableProducts={availableMobileProducts}
          slugs={mobileSlugs}
          count={mobileCount}
          max={MAX_MOBILE_HOMEPAGE_PRODUCTS}
          layout={mobileLayout}
          target="mobile"
          locale={locale}
          loading={loading}
          onAdd={addProduct}
          onRemove={removeProduct}
          onMove={moveProduct}
          onCountChange={setMobileCount}
          onPositionChange={updateLayout}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave} disabled={saving || (!desktopSlugs.length && !mobileSlugs.length)}>
          {saving ? 'Saving…' : 'Save Homepage Settings'}
        </Button>
      </div>
    </div>
  );
}

function LayoutSection({
  title,
  subtitle,
  countLabel,
  products,
  availableProducts,
  slugs,
  count,
  max,
  layout,
  target,
  locale,
  loading,
  onAdd,
  onRemove,
  onMove,
  onCountChange,
  onPositionChange,
}: {
  title: string;
  subtitle: string;
  countLabel: string;
  products: StoreProductRecord[];
  availableProducts: StoreProductRecord[];
  slugs: string[];
  count: number;
  max: number;
  layout: HomepageProductPosition[];
  target: LayoutTarget;
  locale: string;
  loading: boolean;
  onAdd: (slug: string, target: LayoutTarget) => void;
  onRemove: (slug: string, target: LayoutTarget) => void;
  onMove: (slug: string, direction: -1 | 1, target: LayoutTarget) => void;
  onCountChange: (value: number) => void;
  onPositionChange: (target: LayoutTarget, slug: string, x: number, y: number) => void;
}) {
  return (
    <section className="space-y-5 border border-[var(--gold-border)] bg-[rgba(8,8,8,0.9)] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">{title}</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        <div className="w-28">
          <Label htmlFor={`${target}-count`}>{countLabel}</Label>
          <Input
            id={`${target}-count`}
            type="number"
            min={1}
            max={Math.max(slugs.length, 1)}
            value={count}
            onChange={(event) => {
              const value = Number(event.target.value || 1);
              onCountChange(Math.min(Math.max(value, 1), Math.max(slugs.length, 1)));
            }}
          />
        </div>
      </div>

      <HeroCanvas
        title={target === 'desktop' ? 'Desktop preview' : 'Phone preview'}
        products={products}
        layout={layout}
        target={target}
        locale={locale}
        onPositionChange={onPositionChange}
      />

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-[var(--text-secondary)]">Loading settings…</p>
        ) : products.length ? (
          products.map((product, index) => (
            <div
              key={`${target}-${product.slug}`}
              className="grid gap-4 border border-white/10 bg-[rgba(255,255,255,0.02)] p-4 md:grid-cols-[84px_1fr_auto]"
            >
              <div className="relative h-20 overflow-hidden rounded-md border border-white/10 bg-white">
                <Image
                  src={product.images?.[0] ?? '/images/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                  sizes="84px"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Position {index + 1}</p>
                <p className="mt-2 font-serif text-xl text-white">
                  {getStoreTranslation(product.nameTranslations ?? product.name, locale as never) || product.name}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{product.category}</p>
              </div>
              <div className="flex flex-wrap items-start justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onMove(product.slug, -1, target)}>
                  Up
                </Button>
                <Button type="button" variant="outline" onClick={() => onMove(product.slug, 1, target)}>
                  Down
                </Button>
                <Button type="button" variant="ghost" onClick={() => onRemove(product.slug, target)}>
                  Remove
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="border border-dashed border-white/10 p-6 text-sm text-[var(--text-secondary)]">
            No products selected yet.
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-white/10 pt-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Available products</p>
        <p className="text-sm text-[var(--text-secondary)]">Add up to {max} products to this floating scene.</p>
        {availableProducts.map((product) => (
          <div
            key={`available-${target}-${product.slug}`}
            className="grid gap-4 border border-white/10 bg-[rgba(255,255,255,0.02)] p-4 md:grid-cols-[84px_1fr_auto]"
          >
            <div className="relative h-20 overflow-hidden rounded-md border border-white/10 bg-white">
              <Image
                src={product.images?.[0] ?? '/images/placeholder.svg'}
                alt={getStoreTranslation(product.nameTranslations ?? product.name, locale as never) || product.name}
                fill
                className="object-contain p-1"
                sizes="84px"
              />
            </div>
            <div>
              <p className="font-serif text-lg text-white">
                {getStoreTranslation(product.nameTranslations ?? product.name, locale as never) || product.name}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{product.category}</p>
            </div>
            <div className="flex items-center justify-end">
              <Button type="button" variant="outline" onClick={() => onAdd(product.slug, target)}>
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HeroCanvas({
  title,
  products,
  layout,
  target,
  locale,
  onPositionChange,
}: {
  title: string;
  products: StoreProductRecord[];
  layout: HomepageProductPosition[];
  target: LayoutTarget;
  locale: string;
  onPositionChange: (target: LayoutTarget, slug: string, x: number, y: number) => void;
}) {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>, slug: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const item = layout.find((entry) => entry.slug === slug);
    if (!item) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const originX = item.x;
    const originY = item.y;

    const handleMove = (moveEvent: PointerEvent) => {
      const deltaX = ((moveEvent.clientX - startX) / bounds.width) * 100;
      const deltaY = ((moveEvent.clientY - startY) / bounds.height) * 100;
      onPositionChange(target, slug, originX + deltaX, originY + deltaY);
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">{title}</p>
      <div
        ref={canvasRef}
        className={`relative overflow-hidden rounded-[24px] border border-[var(--gold-border)] bg-[#0b0b0b] ${
          target === 'desktop' ? 'min-h-[420px]' : 'min-h-[540px]'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {products.map((product, index) => {
          const coords = layout.find((item) => item.slug === product.slug);
          const width = target === 'desktop' ? 112 : 88;
          return (
            <button
              key={`${target}-canvas-${product.slug}`}
              type="button"
              onPointerDown={(event) => handlePointerDown(event, product.slug)}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                left: `${coords?.x ?? 10}%`,
                top: `${coords?.y ?? 10}%`,
                width,
                transform: `translate(-50%, -50%) rotate(${(index % 2 === 0 ? -3 : 3) + index}deg)`,
              }}
            >
              <div className="overflow-hidden rounded-[18px] border border-white/20 bg-[#f7f4ee] shadow-[0_18px_44px_rgba(0,0,0,0.28)]">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={product.images?.[0] ?? '/images/placeholder.svg'}
                    alt={getStoreTranslation(product.nameTranslations ?? product.name, locale as never) || product.name}
                    fill
                    className="object-contain p-2"
                    sizes={`${width}px`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
