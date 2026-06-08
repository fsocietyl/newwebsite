import brands from '@/data/brands.json';
import products from '@/data/products.json';
import projects from '@/data/projects.json';
import stores from '@/data/stores.json';
import news from '@/data/news.json';
import { Brand, NewsArticle, Product, Project, Store } from '@/types/content';

export const seedBrands = brands as Brand[];
export const seedProducts = products as Product[];
export const seedProjects = projects as Project[];
export const seedStores = stores as Store[];
export const seedNews = news as NewsArticle[];

export function findProductBySlug(slug: string) {
  return seedProducts.find((item) => item.slug === slug);
}
