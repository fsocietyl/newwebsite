import { NextResponse } from 'next/server';
import {
  createStoreProduct,
  getStoreProductBySlug,
  getStoreProducts,
  type StoreProductTranslations,
} from '@/lib/store-products';

type RequestPayload = {
  slug: string;
  nameTranslations: StoreProductTranslations;
  descriptionTranslations: StoreProductTranslations;
  price: number;
  category: string;
  images: string[];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (slug) {
      const product = await getStoreProductBySlug(slug);
      if (!product) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    const products = await getStoreProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('[store-products] GET failed', error);
    return NextResponse.json({ error: 'Failed to load store products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RequestPayload;
    const created = await createStoreProduct(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('[store-products] POST failed', error);
    return NextResponse.json({ error: 'Failed to create store product' }, { status: 500 });
  }
}
