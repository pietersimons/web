export const locales = ['nl', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'nl';

export const localeLabels: Record<Locale, { name: string; flag: string; nativeName: string }> = {
  nl: { name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
