export function getLocalizedField(item: any, field: string, locale: string): string {
  const normalizedLocale = locale === 'tr' || locale === 'ar' || locale === 'en' ? locale : 'en';
  const explicitValue = item?.[`${field}_${normalizedLocale}`];
  if (typeof explicitValue === 'string' && explicitValue.trim()) {
    return explicitValue;
  }

  if (normalizedLocale === 'en') {
    return item?.[field] || '';
  }

  const localeMap = item?.[`${field}Translations`];
  if (localeMap && typeof localeMap === 'object') {
    const translatedValue = localeMap[normalizedLocale];
    if (typeof translatedValue === 'string' && translatedValue.trim()) {
      return translatedValue;
    }
  }

  return item?.[field] || '';
}

export function getLocalizedList(item: any, field: string, locale: string): string[] {
  const normalizedLocale = locale === 'tr' || locale === 'ar' || locale === 'en' ? locale : 'en';
  const explicitValue = item?.[`${field}_${normalizedLocale}`];
  if (Array.isArray(explicitValue)) {
    return explicitValue.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
  }
  if (typeof explicitValue === 'string' && explicitValue.trim()) {
    return explicitValue
      .split(/\s*,\s*/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  const baseValue = item?.[field];
  if (Array.isArray(baseValue)) {
    return baseValue.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
  }
  if (typeof baseValue === 'string' && baseValue.trim()) {
    return baseValue
      .split(/\s*,\s*/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}
