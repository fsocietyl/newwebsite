import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  intent: z.string().min(2, 'Required'),
  message: z.string().min(10, 'Please share more details.'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const customOrderSchema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  desiredProduct: z.string().min(2, 'Required'),
  usageContext: z.string().min(2, 'Required'),
  dimensions: z.string().min(2, 'Required'),
  materialNotes: z.string().min(2, 'Required'),
  finishNotes: z.string().optional(),
  quantity: z.string().optional(),
  budget: z.string().optional(),
  references: z.string().optional(),
  photoUrl: z.string().url().optional(),
  photoFileName: z.string().optional(),
  message: z.string().min(10, 'Please share more details.'),
});

export type CustomOrderFormValues = z.infer<typeof customOrderSchema>;

export const brandSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  countryTag: z.string().min(2),
  heroImage: z.string().url().or(z.literal('/images/placeholder.svg')),
  logoImage: z.string().url().or(z.literal('/images/placeholder.svg')),
  featured: z.boolean(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  brandSlug: z.string().min(2),
  category: z.string().min(2),
  priceTier: z.enum(['premium', 'ultra']),
  description: z.string().min(10),
  descriptionTranslations: z.record(z.string()).optional(),
  materials: z.array(z.string()).min(1),
  dimensions: z.string().min(2),
  finishes: z.array(z.string()).min(1),
  images: z.array(z.string()).min(1),
  tags: z.array(z.string()).optional(),
  featured: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const projectSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  city: z.string().min(2),
  country: z.string().min(2),
  year: z.number().min(1900),
  type: z.enum(['residential', 'hospitality', 'retail', 'institutional']),
  description: z.string().min(10),
  descriptionTranslations: z.record(z.string()).optional(),
  images: z.array(z.string()).min(1),
  relatedProductSlugs: z.array(z.string()).optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const storeSchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(5),
  phone: z.string().min(5),
  email: z.string().email(),
  hours: z.string().min(5),
  mapUrl: z.string().url(),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

export const newsSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  date: z.string(),
  category: z.enum(['press', 'events', 'launches']),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  heroImage: z.string().url().or(z.literal('/images/placeholder.svg')),
  tags: z.array(z.string()).optional(),
});

export type NewsFormValues = z.infer<typeof newsSchema>;
