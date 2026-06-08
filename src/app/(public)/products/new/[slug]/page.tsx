import { notFound } from 'next/navigation';
import { StoreProductDetail } from '@/components/store/store-product-detail';
import { getStoreProductBySlug } from '@/lib/store-products';

type Params = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export default async function StoreProductPage({ params }: Params) {
  const { slug } = await params;
  const item = await getStoreProductBySlug(slug);
  if (!item) {
    notFound();
  }

  return <StoreProductDetail item={item} />;
}
