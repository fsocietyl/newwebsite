const STORE_CATEGORY_KEY_MAP: Record<string, string> = {
  Ayna: 'mirror',
  'Orta Sehpa': 'coffeeTable',
  'Çerçeve': 'frame',
  'Barfiks & Şınav Barı': 'pullUpBar',
  'Şifonyer': 'dresser',
  'Yemek Masası': 'diningTable',
  'Yan Sehpa': 'sideTable',
  'Puf & Bench': 'poufBench',
  Berjer: 'armchair',
  Dresuar: 'console',
  Yatak: 'bed',
  'Yatak Odası Takımı': 'bedroomSet',
  Komodin: 'nightstand',
  'Yemek Odası Sandalyesi': 'diningChair',
  'Bahçe Masası': 'gardenTable',
  'Vitrin & Gümüşlük': 'displayCabinet',
  'Çay Seti Koltuk Takımı': 'teaSetSofa',
  Kanepe: 'sofa',
  'Yatak / Baza Başlığı': 'headboard',
  'Mobilya Hırdavatı': 'furnitureHardware',
  Kilit: 'lock',
  'Ahşap Boya & Vernik': 'paintVarnish',
  'Kapı Hırdavatı': 'doorHardware',
  'Ayna Etajeri': 'mirrorShelf',
  'Çalışma Sandalyesi': 'officeChair',
  'Tekerlekli Sandalye': 'rollingChair',
  'Banyo Rafları': 'bathroomShelves',
  'TV Sehpa & Ünitesi': 'tvUnit',
  'Duvar Rafı': 'wallShelf',
  'Bahçe Sandalyesi': 'gardenChair',
  'Koltuk Takımı': 'sofaSet',
  'Vida & Çivi & Dübel': 'fasteners',
  'Yalıtım Malzemesi': 'insulation',
};

export function getStoreCategoryLabel(category: string | undefined, t: (path: string) => string) {
  if (!category) return '';
  const key = STORE_CATEGORY_KEY_MAP[category];
  return key ? t(`storeCategories.${key}`) : category;
}
