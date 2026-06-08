'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Brand, NewsArticle, Product, Project, Store } from '@/types/content';
import {
  getBrands,
  getNews,
  getProducts,
  getProjects,
  getStores,
  syncSeedsToFirestore,
} from '@/lib/firestore';
import {
  seedBrands,
  seedNews,
  seedProducts,
  seedProjects,
  seedStores,
} from '@/lib/seed';

type ContentState = {
  brands: Brand[];
  products: Product[];
  projects: Project[];
  stores: Store[];
  news: NewsArticle[];
};

type ContentContextValue = ContentState & {
  loading: boolean;
  refresh: () => Promise<void>;
  syncSeedContent: () => Promise<boolean>;
  syncing: boolean;
};

const initialState: ContentState = {
  brands: seedBrands,
  products: seedProducts,
  projects: seedProjects,
  stores: seedStores,
  news: seedNews,
};

const ContentContext = createContext<ContentContextValue>({
  ...initialState,
  loading: false,
  syncing: false,
  refresh: async () => undefined,
  syncSeedContent: async () => false,
});

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ContentState>(initialState);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [brands, products, projects, stores, news] = await Promise.all([
        getBrands(),
        getProducts(),
        getProjects(),
        getStores(),
        getNews(),
      ]);
      // Fallback to seed data if remote collections are empty
      setState({
        brands: brands.length ? brands : seedBrands,
        products: products.length ? products : seedProducts,
        projects: projects.length ? projects : seedProjects,
        stores: stores.length ? stores : seedStores,
        news: news.length ? news : seedNews,
      });
    } catch (error) {
      // If Firestore fetch fails, stick with seed content so UI still works
      setState(initialState);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      ...state,
      loading,
      syncing,
      refresh: load,
      syncSeedContent: async () => {
        setSyncing(true);
        try {
          return await syncSeedsToFirestore();
        } finally {
          setSyncing(false);
        }
      },
    }),
    [state, loading, syncing],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
