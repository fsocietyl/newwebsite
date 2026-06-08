import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/content';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';

export function ProductCard({ product }: { product: Product }) {
  const { locale } = useLocale();
  const t = useTranslations();
  const displayName = product.nameTranslations?.[locale] ?? product.name;
  const description =
    product.descriptionTranslations?.[locale] ??
    product.descriptionTranslations?.en ??
    product.description;

  return (
    <Link
      href={`/products/${product.slug}/`}
      className="group flex flex-col border border-white/10 bg-black/40 transition hover:border-white/30 hover:bg-white/5"
    >
      <div className="relative h-52 w-full overflow-hidden md:h-60">
        <Image
          src={product.images[0] ?? '/images/placeholder.svg'}
          alt={displayName}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 py-5 md:gap-3 md:px-5 md:py-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 md:text-xs md:tracking-[0.4em]">{product.category}</p>
        <h3 className="text-lg text-white md:text-xl">{displayName}</h3>
        <p className="text-sm text-stone-300 line-clamp-3">{description}</p>
        <span className="mt-auto text-xs uppercase tracking-[0.3em] text-stone-300 transition group-hover:text-white" aria-hidden>
          {/* Keep spacing for layout without showing a button label */}
        </span>
      </div>
    </Link>
  );
}
