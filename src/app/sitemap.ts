import type { MetadataRoute } from 'next';
import { seedProjects } from '@/lib/seed';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export const dynamic = 'force-static';
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/products', '/products/new', '/projects', '/about', '/contact', '/privacy', '/terms', '/orders'];

  const dynamicPaths = seedProjects.map((project) => `/projects/${project.slug}`);

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
}
