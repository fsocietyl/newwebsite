import type { Metadata } from 'next';
import { seedProducts } from '@/lib/seed';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return seedProducts.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = seedProducts.find((item) => item.slug === params.slug);
  if (!product) return {};
  return {
    title: `${product.name} | Details`,
    description: product.description,
  };
}

export default function ProductInfoPage({ params }: { params: { slug: string } }) {
  const product = seedProducts.find((item) => item.slug === params.slug);
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-10 text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-stone-400">Product Info</p>
        <h1 className="mt-2 text-3xl">{product.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl bg-black/30 p-5 text-sm text-stone-200">
          <p className="font-semibold text-white">Name (TR)</p>
          <p>{product.nameTranslations?.tr ?? product.name}</p>
          <p className="font-semibold text-white">Name (EN)</p>
          <p>{product.nameTranslations?.en ?? product.name}</p>
          <p className="font-semibold text-white">Name (AR)</p>
          <p>{product.nameTranslations?.ar ?? product.name}</p>
        </div>
        <div className="space-y-3 rounded-2xl bg-black/30 p-5 text-sm text-stone-200">
          <p className="font-semibold text-white">Description (TR)</p>
          <p>{product.descriptionTranslations?.tr ?? product.description}</p>
          <p className="font-semibold text-white">Description (EN)</p>
          <p>{product.descriptionTranslations?.en ?? product.description}</p>
          <p className="font-semibold text-white">Description (AR)</p>
          <p>{product.descriptionTranslations?.ar ?? product.description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 rounded-2xl bg-black/30 p-5 text-sm text-stone-200">
          <p><strong>Category:</strong> {product.category}</p>
          {product.price !== undefined && product.price !== null && (
            <p>
              <strong>Price:</strong>{' '}
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.price)}
            </p>
          )}
          <p><strong>Materials:</strong> {(product.materials ?? []).join(', ') || 'N/A'}</p>
          <p><strong>Finishes:</strong> {(product.finishes ?? []).join(', ') || 'N/A'}</p>
          <p><strong>Dimensions:</strong> {product.dimensions || 'N/A'}</p>
        </div>
        <div className="space-y-2 rounded-2xl bg-black/30 p-5 text-sm text-stone-200">
          <p><strong>Images:</strong></p>
          <ul className="list-disc space-y-1 pl-5">
            {product.images.map((img) => (
              <li key={img} className="break-all text-xs">
                {img}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
