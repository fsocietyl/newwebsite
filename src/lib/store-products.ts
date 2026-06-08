import type { Locale } from '@/lib/i18n';
import { storeItems } from '@/data/store-items';

export const STORE_TEXT_LOCALES = ['en', 'tr', 'ar'] as const;

export type StoreTextLocale = (typeof STORE_TEXT_LOCALES)[number];

export type StoreProductTranslations = Record<StoreTextLocale, string>;
export type HomepageProductPosition = {
  slug: string;
  x: number;
  y: number;
};
export type HomepageSettings = {
  featuredProductSlugs: string[];
  featuredProductCount: number;
  featuredDesktopProductSlugs?: string[];
  featuredDesktopProductCount?: number;
  featuredDesktopLayout?: HomepageProductPosition[];
  featuredMobileProductSlugs?: string[];
  featuredMobileProductCount?: number;
  featuredMobileLayout?: HomepageProductPosition[];
  updatedAt?: string;
};

export type StoreProductRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  image: string;
  nameTranslations: StoreProductTranslations;
  descriptionTranslations: StoreProductTranslations;
  createdAt?: string;
  updatedAt?: string;
};

type StoreProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  created_at?: string;
  updated_at?: string;
  store_product_images?: Array<{
    id: string;
    image_url: string;
    sort_order: number;
    created_at?: string;
  }>;
};

const HOMEPAGE_SETTINGS_SLUG = '__homepage-settings__';

export type StoreProductFormPayload = {
  id?: string;
  slug: string;
  nameTranslations: StoreProductTranslations;
  descriptionTranslations: StoreProductTranslations;
  price: number;
  category: string;
  images: string[];
};

function emptyTranslations(): StoreProductTranslations {
  return { en: '', tr: '', ar: '' };
}

function isTranslationsObject(value: unknown): value is Partial<StoreProductTranslations> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export function normalizeStoreTranslations(value: string | Partial<StoreProductTranslations> | null | undefined) {
  const base = emptyTranslations();

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return base;

    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (isTranslationsObject(parsed)) {
        return {
          en: String(parsed.en ?? trimmed),
          tr: String(parsed.tr ?? parsed.en ?? trimmed),
          ar: String(parsed.ar ?? parsed.en ?? trimmed),
        };
      }
    } catch {
      // Keep the legacy plain-string behavior by copying it into all locales.
    }

    return { en: trimmed, tr: trimmed, ar: trimmed };
  }

  if (isTranslationsObject(value)) {
    return {
      en: String(value.en ?? ''),
      tr: String(value.tr ?? value.en ?? ''),
      ar: String(value.ar ?? value.en ?? ''),
    };
  }

  return base;
}

export function serializeStoreTranslations(value: StoreProductTranslations) {
  return JSON.stringify({
    en: value.en.trim(),
    tr: value.tr.trim(),
    ar: value.ar.trim(),
  });
}

export function getStoreTranslation(
  value: string | Partial<StoreProductTranslations> | null | undefined,
  locale: Locale,
) {
  const translations = normalizeStoreTranslations(value);
  return (
    translations[locale as StoreTextLocale] ||
    translations.en ||
    translations.tr ||
    translations.ar ||
    ''
  );
}

function env(name: string) {
  return process.env[name]?.trim();
}

function getSupabaseConfig() {
  const url = env('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');
  return {
    url,
    serviceRoleKey,
    enabled: Boolean(url && serviceRoleKey),
  };
}

function getHeaders() {
  const { serviceRoleKey } = getSupabaseConfig();
  return {
    apikey: serviceRoleKey ?? '',
    Authorization: `Bearer ${serviceRoleKey ?? ''}`,
    'Content-Type': 'application/json',
  };
}

function normalizeHomepageLayout(value: unknown, fallbackSlugs: string[]) {
  if (!Array.isArray(value)) {
    return fallbackSlugs.map((slug, index) => ({
      slug,
      x: 8 + ((index * 19) % 62),
      y: 10 + ((index * 17) % 66),
    }));
  }

  return value
    .filter((entry): entry is HomepageProductPosition => {
      return Boolean(
        entry &&
          typeof entry === 'object' &&
          typeof (entry as HomepageProductPosition).slug === 'string' &&
          typeof (entry as HomepageProductPosition).x === 'number' &&
          typeof (entry as HomepageProductPosition).y === 'number',
      );
    })
    .map((entry) => ({
      slug: entry.slug,
      x: Math.min(Math.max(entry.x, 0), 100),
      y: Math.min(Math.max(entry.y, 0), 100),
    }));
}

function toStoreProductRecord(row: StoreProductRow): StoreProductRecord {
  const images = [...(row.store_product_images ?? [])]
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((image) => image.image_url)
    .filter(Boolean);
  const nameTranslations = normalizeStoreTranslations(row.name);
  const descriptionTranslations = normalizeStoreTranslations(row.description ?? '');

  return {
    id: row.id,
    slug: row.slug,
    name: nameTranslations.en || nameTranslations.tr || nameTranslations.ar,
    description: descriptionTranslations.en || descriptionTranslations.tr || descriptionTranslations.ar,
    price: Number(row.price ?? 0),
    category: row.category ?? '',
    images,
    image: images[0] ?? '/images/placeholder.svg',
    nameTranslations,
    descriptionTranslations,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function fallbackStoreProducts(): StoreProductRecord[] {
  return storeItems.map((item) => ({
    id: item.slug,
    slug: item.slug,
    name: item.nameKey,
    description: item.descriptionKey,
    price: item.price,
    category: 'Store',
    images: [item.image],
    image: item.image,
    nameTranslations: normalizeStoreTranslations(item.nameKey),
    descriptionTranslations: normalizeStoreTranslations(item.descriptionKey),
  }));
}

export function resolveStoreText(value: string) {
  if (!value) return '';
  return value.includes('.') ? null : value;
}

export async function getStoreProducts() {
  const { url, enabled } = getSupabaseConfig();
  if (!enabled || !url) {
    return fallbackStoreProducts();
  }

  const response = await fetch(
    `${url}/rest/v1/store_products?select=*,store_product_images(id,image_url,sort_order,created_at)&order=created_at.desc`,
    {
      headers: getHeaders(),
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase store list failed: ${response.status}`);
  }

  const rows = (await response.json()) as StoreProductRow[];
  return rows
    .filter((row) => row.slug !== HOMEPAGE_SETTINGS_SLUG)
    .map(toStoreProductRecord);
}

export async function getStoreProductBySlug(slug: string) {
  const { url, enabled } = getSupabaseConfig();
  if (!enabled || !url) {
    return fallbackStoreProducts().find((item) => item.slug === slug) ?? null;
  }

  const response = await fetch(
    `${url}/rest/v1/store_products?select=*,store_product_images(id,image_url,sort_order,created_at)&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    {
      headers: getHeaders(),
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase store detail failed: ${response.status}`);
  }

  const rows = (await response.json()) as StoreProductRow[];
  if (!rows[0] || rows[0].slug === HOMEPAGE_SETTINGS_SLUG) return null;
  return toStoreProductRecord(rows[0]);
}

export async function getHomepageSettings() {
  const { url, enabled } = getSupabaseConfig();
  if (!enabled || !url) {
    return null;
  }

  const response = await fetch(
    `${url}/rest/v1/store_products?select=id,description,updated_at&slug=eq.${encodeURIComponent(HOMEPAGE_SETTINGS_SLUG)}&limit=1`,
    {
      headers: getHeaders(),
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase homepage settings read failed: ${response.status}`);
  }

  const rows = (await response.json()) as Array<{
    id: string;
    description: string;
    updated_at?: string;
  }>;

  if (!rows[0]?.description) {
    return null;
  }

  try {
    const parsed = JSON.parse(rows[0].description) as HomepageSettings;
    const legacySlugs = Array.isArray(parsed.featuredProductSlugs) ? parsed.featuredProductSlugs : [];
    const legacyCount = Number(parsed.featuredProductCount ?? 0);
    return {
      featuredProductSlugs: legacySlugs,
      featuredProductCount: legacyCount,
      featuredDesktopProductSlugs: Array.isArray(parsed.featuredDesktopProductSlugs)
        ? parsed.featuredDesktopProductSlugs
        : legacySlugs,
      featuredDesktopProductCount: Number(parsed.featuredDesktopProductCount ?? legacyCount),
      featuredDesktopLayout: normalizeHomepageLayout(
        parsed.featuredDesktopLayout,
        Array.isArray(parsed.featuredDesktopProductSlugs) ? parsed.featuredDesktopProductSlugs : legacySlugs,
      ),
      featuredMobileProductSlugs: Array.isArray(parsed.featuredMobileProductSlugs)
        ? parsed.featuredMobileProductSlugs
        : legacySlugs,
      featuredMobileProductCount: Number(parsed.featuredMobileProductCount ?? legacyCount),
      featuredMobileLayout: normalizeHomepageLayout(
        parsed.featuredMobileLayout,
        Array.isArray(parsed.featuredMobileProductSlugs) ? parsed.featuredMobileProductSlugs : legacySlugs,
      ),
      updatedAt: rows[0].updated_at,
    };
  } catch (error) {
    console.error('[store-products] homepage settings parse failed', error);
    return null;
  }
}

export async function saveHomepageSettings(settings: HomepageSettings) {
  const { url, enabled } = getSupabaseConfig();
  if (!enabled || !url) {
    throw new Error('Supabase store configuration is missing.');
  }

  const existingResponse = await fetch(
    `${url}/rest/v1/store_products?select=id&slug=eq.${encodeURIComponent(HOMEPAGE_SETTINGS_SLUG)}&limit=1`,
    {
      headers: getHeaders(),
      cache: 'no-store',
    },
  );

  if (!existingResponse.ok) {
    throw new Error(`Supabase homepage settings lookup failed: ${existingResponse.status}`);
  }

  const existingRows = (await existingResponse.json()) as Array<{ id: string }>;
  const payload = {
    slug: HOMEPAGE_SETTINGS_SLUG,
    name: serializeStoreTranslations({ en: 'Homepage Settings', tr: 'Homepage Settings', ar: 'Homepage Settings' }),
    description: JSON.stringify({
      featuredProductSlugs: settings.featuredProductSlugs,
      featuredProductCount: settings.featuredProductCount,
      featuredDesktopProductSlugs: settings.featuredDesktopProductSlugs ?? settings.featuredProductSlugs,
      featuredDesktopProductCount: settings.featuredDesktopProductCount ?? settings.featuredProductCount,
      featuredDesktopLayout: settings.featuredDesktopLayout ?? [],
      featuredMobileProductSlugs: settings.featuredMobileProductSlugs ?? settings.featuredProductSlugs,
      featuredMobileProductCount: settings.featuredMobileProductCount ?? settings.featuredProductCount,
      featuredMobileLayout: settings.featuredMobileLayout ?? [],
    }),
    price: 0,
    category: '__meta__',
    updated_at: new Date().toISOString(),
  };

  if (existingRows[0]?.id) {
    const updateResponse = await fetch(
      `${url}/rest/v1/store_products?id=eq.${encodeURIComponent(existingRows[0].id)}`,
      {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!updateResponse.ok) {
      throw new Error(`Supabase homepage settings update failed: ${updateResponse.status}`);
    }
  } else {
    const createResponse = await fetch(`${url}/rest/v1/store_products`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Prefer: 'return=representation',
      },
      body: JSON.stringify([payload]),
    });

    if (!createResponse.ok) {
      throw new Error(`Supabase homepage settings create failed: ${createResponse.status}`);
    }
  }

  return settings;
}

export async function createStoreProduct(payload: StoreProductFormPayload) {
  const { url, enabled } = getSupabaseConfig();
  if (!enabled || !url) {
    throw new Error('Supabase store configuration is missing.');
  }

  const response = await fetch(`${url}/rest/v1/store_products`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      Prefer: 'return=representation',
    },
    body: JSON.stringify([
      {
        slug: payload.slug,
        name: serializeStoreTranslations(payload.nameTranslations),
        description: serializeStoreTranslations(payload.descriptionTranslations),
        price: payload.price,
        category: payload.category,
      },
    ]),
  });

  if (!response.ok) {
    throw new Error(`Supabase store create failed: ${response.status}`);
  }

  const [created] = (await response.json()) as StoreProductRow[];
  await replaceStoreProductImages(created.id, payload.images);
  return getStoreProductBySlug(payload.slug);
}

export async function updateStoreProduct(id: string, payload: StoreProductFormPayload) {
  const { url, enabled } = getSupabaseConfig();
  if (!enabled || !url) {
    throw new Error('Supabase store configuration is missing.');
  }

  const response = await fetch(`${url}/rest/v1/store_products?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      ...getHeaders(),
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      slug: payload.slug,
      name: serializeStoreTranslations(payload.nameTranslations),
      description: serializeStoreTranslations(payload.descriptionTranslations),
      price: payload.price,
      category: payload.category,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Supabase store update failed: ${response.status}`);
  }

  await replaceStoreProductImages(id, payload.images);
  return getStoreProductBySlug(payload.slug);
}

export async function deleteStoreProduct(id: string) {
  const { url, enabled } = getSupabaseConfig();
  if (!enabled || !url) {
    throw new Error('Supabase store configuration is missing.');
  }

  const response = await fetch(`${url}/rest/v1/store_products?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Supabase store delete failed: ${response.status}`);
  }
}

async function replaceStoreProductImages(productId: string, images: string[]) {
  const { url, enabled } = getSupabaseConfig();
  if (!enabled || !url) {
    return;
  }

  const cleanedImages = images.map((image) => image.trim()).filter(Boolean);

  const deleteResponse = await fetch(
    `${url}/rest/v1/store_product_images?product_id=eq.${encodeURIComponent(productId)}`,
    {
      method: 'DELETE',
      headers: getHeaders(),
    },
  );

  if (!deleteResponse.ok) {
    throw new Error(`Supabase store image delete failed: ${deleteResponse.status}`);
  }

  if (cleanedImages.length === 0) {
    return;
  }

  const insertResponse = await fetch(`${url}/rest/v1/store_product_images`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(
      cleanedImages.map((imageUrl, index) => ({
        product_id: productId,
        image_url: imageUrl,
        sort_order: index,
      })),
    ),
  });

  if (!insertResponse.ok) {
    throw new Error(`Supabase store image create failed: ${insertResponse.status}`);
  }
}
