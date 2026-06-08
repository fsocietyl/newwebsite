export type Brand = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  countryTag: string;
  heroImage: string;
  logoImage: string;
  featured: boolean;
  createdAt: string;
};

export type Product = {
  id?: string;
  name: string;
  nameTranslations?: Record<string, string>;
  slug: string;
  brandId?: string;
  brandSlug?: string;
  category: string;
  priceTier?: 'premium' | 'ultra';
  price?: number;
  description: string;
  descriptionTranslations?: Record<string, string>;
  materials?: string[];
  dimensions?: string;
  finishes?: string[];
  images: string[];
  image?: string;
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
};

export type Project = {
  id?: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  year: number;
  type: 'residential' | 'hospitality' | 'retail' | 'institutional';
  description: string;
  descriptionTranslations?: Record<string, string>;
  images: string[];
  relatedProductSlugs: string[];
  createdAt: string;
};

export type Store = {
  id?: string;
  name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapUrl: string;
  createdAt: string;
};

export type NewsArticle = {
  id?: string;
  title: string;
  slug: string;
  date: string;
  category: 'press' | 'events' | 'launches';
  excerpt: string;
  content: string;
  heroImage: string;
  tags: string[];
  createdAt: string;
};

export type Appointment = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  intent: string;
  createdAt: string;
};
