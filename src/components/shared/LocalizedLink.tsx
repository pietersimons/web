'use client';

import Link, { LinkProps } from 'next/link';
import { useParams } from 'next/navigation';
import { ReactNode } from 'react';
import { Locale, defaultLocale, isValidLocale } from '@/lib/i18n/config';
import { localizePath } from '@/lib/i18n/navigation';

interface LocalizedLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  locale?: Locale;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function LocalizedLink({
  href,
  locale,
  children,
  className,
  ...rest
}: LocalizedLinkProps) {
  const params = useParams();
  const urlLocale = typeof params?.locale === 'string' && isValidLocale(params.locale) ? params.locale : defaultLocale;
  const activeLocale = locale || urlLocale;

  const localizedHref = localizePath(href, activeLocale);

  return (
    <Link href={localizedHref} className={className} {...rest}>
      {children}
    </Link>
  );
}
