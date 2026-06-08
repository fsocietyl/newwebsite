import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import {
  seedBrands,
  seedNews,
  seedProducts,
  seedProjects,
  seedStores,
} from './seed';
import type { Brand, NewsArticle, Product, Project, Store } from '@/types/content';

async function fetchCollection<T>(path: string, fallback: T[]): Promise<T[]> {
  const db = getFirebaseDb();
  if (!db) return fallback;
  try {
    const col = collection(db, path);
    const q = query(col, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return fallback;
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as T));
  } catch (error) {
    console.warn(`Failed to fetch ${path}:`, error);
    return fallback;
  }
}

export const getBrands = () => fetchCollection<Brand>('brands', seedBrands);
export const getProducts = () => fetchCollection<Product>('products', seedProducts);
export const getProjects = () => fetchCollection<Project>('projects', seedProjects);
export const getStores = () => fetchCollection<Store>('stores', seedStores);
export const getNews = () => fetchCollection<NewsArticle>('news', seedNews);

export const getBrandBySlug = async (slug: string) => {
  const brands = await getBrands();
  return brands.find((brand) => brand.slug === slug);
};

export const getProductBySlug = async (slug: string) => {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
};

export const getProjectBySlug = async (slug: string) => {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
};

export const getNewsBySlug = async (slug: string) => {
  const list = await getNews();
  return list.find((article) => article.slug === slug);
};

type CollectionName = 'brands' | 'products' | 'projects' | 'stores' | 'news';

async function saveDocument<T extends { slug?: string; id?: string; createdAt?: unknown }>(
  path: CollectionName,
  payload: T,
) {
  const db = getFirebaseDb();
  if (!db) return payload;
  const col = collection(db, path);
  const identifier = payload.slug || payload.id;

  if (identifier) {
    await setDoc(doc(col, identifier), {
      ...payload,
      createdAt: payload.createdAt ?? serverTimestamp(),
    });
    return payload;
  }

  const created = await addDoc(col, {
    ...payload,
    createdAt: payload.createdAt ?? serverTimestamp(),
  });
  return { ...payload, id: created.id };
}

async function removeDocument(path: CollectionName, id: string) {
  const db = getFirebaseDb();
  if (!db) return false;
  await deleteDoc(doc(collection(db, path), id));
  return true;
}

export const saveBrand = (brand: Brand) => saveDocument('brands', brand);
export const saveProduct = (product: Product) => saveDocument('products', product);
export const saveProject = (project: Project) => saveDocument('projects', project);
export const saveStore = (store: Store) => saveDocument('stores', store);
export const saveNews = (article: NewsArticle) => saveDocument('news', article);

export const deleteBrand = (id: string) => removeDocument('brands', id);
export const deleteProduct = (id: string) => removeDocument('products', id);
export const deleteProject = (id: string) => removeDocument('projects', id);
export const deleteStore = (id: string) => removeDocument('stores', id);
export const deleteNews = (id: string) => removeDocument('news', id);

export type HomepageSettings = {
  featuredProductSlugs: string[];
  featuredProductCount: number;
  updatedAt?: string;
};

const HOMEPAGE_SETTINGS_PATH = ['siteSettings', 'homepage'] as const;

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    const snapshot = await getDoc(doc(db, ...HOMEPAGE_SETTINGS_PATH));
    if (!snapshot.exists()) return null;
    return snapshot.data() as HomepageSettings;
  } catch (error) {
    console.warn('Failed to fetch homepage settings:', error);
    return null;
  }
}

export async function saveHomepageSettings(settings: HomepageSettings) {
  const db = getFirebaseDb();
  if (!db) return settings;

  await setDoc(doc(db, ...HOMEPAGE_SETTINGS_PATH), {
    ...settings,
    updatedAt: new Date().toISOString(),
  });

  return settings;
}

type FormPayload = {
  [key: string]: unknown;
  createdAt?: string;
};

export async function submitForm(
  collectionName: 'appointments' | 'messages' | 'orders',
  payload: FormPayload,
) {
  const db = getFirebaseDb();
  if (!db) return false;
  await addDoc(collection(db, collectionName), {
    ...payload,
    createdAt: payload.createdAt ?? new Date().toISOString(),
  });
  return true;
}

const normalizeId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export async function syncSeedsToFirestore() {
  const db = getFirebaseDb();
  if (!db) return false;

  const batchWrite = async <T extends Record<string, unknown>>(
    path: CollectionName,
    data: T[],
    getId: (item: T) => string | undefined,
  ) => {
    for (const item of data) {
      const documentId = getId(item);
      if (!documentId) continue;
      await setDoc(doc(collection(db, path), documentId), { ...item });
    }
  };

  try {
    await batchWrite('brands', seedBrands, (item) => item.slug);
    await batchWrite('products', seedProducts, (item) => item.slug);
    await batchWrite('projects', seedProjects, (item) => item.slug);
    await batchWrite('stores', seedStores, (item) => item.id ?? normalizeId(item.name));
    await batchWrite('news', seedNews, (item) => item.slug);
    return true;
  } catch (error) {
    console.error('Seed sync failed', error);
    return false;
  }
}
