import type { Metadata } from 'next';
import { seedBrands, seedProducts } from '@/lib/seed';
import { ProductDetailClient } from '@/components/product-detail-client';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return seedProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = seedProducts.find((item) => normalizeSlug(item.slug) === normalizeSlug(slug));
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Log to server console to debug missing product slugs during prerender
  const { slug } = await params;
  console.log('Product page lookup', { slug });

  const product = seedProducts.find((item) => normalizeSlug(item.slug) === normalizeSlug(slug));
  const brand = product ? seedBrands.find((item) => item.slug === product.brandSlug) : undefined;
  if (!product) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-10 text-center text-white">
        <p className="text-sm uppercase tracking-[0.4em] text-stone-400">Product</p>
        <h1 className="text-3xl font-semibold">Product not found</h1>
        <p className="text-stone-300">We couldn&apos;t find this item. Please check the link or return to the catalog.</p>
        <p className="text-xs text-stone-400">Debug: slug={normalizeSlug(slug)}, total={seedProducts.length}</p>
      </div>
    );
  }

  return <ProductDetailClient product={product} brand={brand} />;
}

function normalizeSlug(value: string) {
  try {
    return decodeURIComponent(value).toLowerCase().replace(/\/+$/, '');
  } catch {
    return value.toLowerCase().replace(/\/+$/, '');
  }
}
