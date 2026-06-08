import { NextResponse } from 'next/server';
import {
  deleteStoreProduct,
  updateStoreProduct,
  type StoreProductTranslations,
} from '@/lib/store-products';

type Params = {
  params: Promise<{ id: string }>;
};

type RequestPayload = {
  slug: string;
  nameTranslations: StoreProductTranslations;
  descriptionTranslations: StoreProductTranslations;
  price: number;
  category: string;
  images: string[];
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as RequestPayload;
    const updated = await updateStoreProduct(id, payload);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[store-products] PUT failed', error);
    return NextResponse.json({ error: 'Failed to update store product' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await deleteStoreProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[store-products] DELETE failed', error);
    return NextResponse.json({ error: 'Failed to delete store product' }, { status: 500 });
  }
}
