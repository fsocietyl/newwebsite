export type StoreItem = {
  slug: string;
  image: string;
  price: number;
  nameKey: string;
  descriptionKey: string;
};

export const storeItems: StoreItem[] = [
  {
    slug: 'store-sample',
    image: '/hero-real-1.webp',
    price: 12990,
    nameKey: 'storePage.sampleName',
    descriptionKey: 'storePage.sampleDescription',
  },
  {
    slug: 'store-sample-2',
    image: '/hero-real-2.webp',
    price: 18990,
    nameKey: 'storePage.sampleName2',
    descriptionKey: 'storePage.sampleDescription2',
  },
];
