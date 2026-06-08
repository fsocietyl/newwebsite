import en from "@/i18n/en.json";
import tr from "@/i18n/tr.json";
import ar from "@/i18n/ar.json";

export const dictionaries = {
  en,
  tr,
  ar,
};

export type Locale = keyof typeof dictionaries;

export type Dictionary = (typeof dictionaries)[Locale];

export const DEFAULT_LOCALE: Locale = "en";

export function getDictionary(locale: Locale = DEFAULT_LOCALE) {
  return dictionaries[locale] ?? dictionaries.en;
}

export function translate(path: string, dict: Dictionary): string {
  const segments = path.split(".");
  let value: unknown = dict;

  for (const key of segments) {
    if (value && typeof value === "object" && key in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof value === "string" ? value : path;
}
