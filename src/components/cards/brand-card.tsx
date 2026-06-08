import Image from 'next/image';
import Link from 'next/link';
import type { Brand } from '@/types/content';
import { Button } from '@/components/ui/button';

type Props = {
  brand: Brand;
};

export function BrandCard({ brand }: Props) {
  return (
    <div className="flex flex-col border border-stone-200 bg-white/80">
      <div className="relative h-56 w-full">
        <Image src={brand.heroImage} alt={brand.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 py-6">
        <p className="text-xs uppercase tracking-[0.4em] text-stone-500">{brand.countryTag}</p>
        <h3 className="text-2xl">{brand.name}</h3>
        <p className="text-sm text-stone-600">{brand.description}</p>
        <Button asChild variant="ghost" className="mt-auto w-fit px-0 text-xs">
          <Link href={`/brands/${brand.slug}`}>View Brand</Link>
        </Button>
      </div>
    </div>
  );
}
