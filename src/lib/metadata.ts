import type { Metadata } from 'next';

type SEOProps = {
  title: string;
  description: string;
  path?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export function buildMetadata({ title, description, path = '/' }: SEOProps): Metadata {
  const url = new URL(path, baseUrl);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: url.toString(),
      images: ['/images/hero-1.svg'],
    },
  };
}
