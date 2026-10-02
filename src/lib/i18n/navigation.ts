import { Locale, defaultLocale, locales } from './config';

/**
 * Ensures a path is prefixed with the given locale.
 * e.g. localizePath('/destinations', 'nl') -> '/nl/destinations'
 */
export function localizePath(path: string, locale: Locale = defaultLocale): string {
  if (!path || path === '#') return '#';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }

  // Strip any existing locale prefix
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  for (const loc of locales) {
    if (cleanPath === `/${loc}`) {
      cleanPath = '/';
      break;
    }
    if (cleanPath.startsWith(`/${loc}/`)) {
      cleanPath = cleanPath.slice(loc.length + 1);
      break;
    }
  }

  if (cleanPath === '/' || cleanPath === '') {
    return `/${locale}`;
  }

  return `/${locale}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
}
