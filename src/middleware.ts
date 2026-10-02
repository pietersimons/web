import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, isValidLocale } from './lib/i18n/config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname starts with any supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Determine locale from cookie or Accept-Language header
  let targetLocale = defaultLocale;
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    targetLocale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      if (acceptLanguage.includes('en') && !acceptLanguage.startsWith('nl')) {
        targetLocale = 'en';
      }
    }
  }

  // Redirect to localized URL
  const newUrl = new URL(`/${targetLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`, request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip internal paths (_next, api, static files, favicon, etc.)
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|robots.txt|sitemap.xml).*)',
  ],
};
