'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { locales, Locale, localeLabels } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
  variant?: 'header' | 'footer' | 'mobile';
}

export function LanguageSwitcher({
  currentLocale,
  className = '',
  variant = 'header',
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Set cookie for persistence (1 year)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Replace locale in current path
    let newPath = pathname;
    for (const loc of locales) {
      if (pathname.startsWith(`/${loc}/`)) {
        newPath = pathname.replace(`/${loc}/`, `/${newLocale}/`);
        break;
      } else if (pathname === `/${loc}`) {
        newPath = `/${newLocale}`;
        break;
      }
    }

    // If no locale in path, prepend newLocale
    if (newPath === pathname && !pathname.startsWith(`/${newLocale}`)) {
      newPath = `/${newLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
    }

    router.push(newPath);
  };

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Taal / Language:</span>
        <div className="flex rounded-lg bg-stone-800/80 p-1 border border-stone-700/50">
          {locales.map((loc) => {
            const isActive = loc === currentLocale;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => handleLanguageChange(loc)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                }`}
              >
                {loc.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 text-xs text-stone-400 ${className}`}>
        <Globe className="w-3.5 h-3.5 text-stone-500" />
        <div className="flex items-center gap-1.5">
          {locales.map((loc, idx) => {
            const isActive = loc === currentLocale;
            return (
              <span key={loc} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleLanguageChange(loc)}
                  className={`transition-colors uppercase font-medium ${
                    isActive ? 'text-emerald-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title={localeLabels[loc].nativeName}
                >
                  {loc.toUpperCase()}
                </button>
                {idx < locales.length - 1 && <span className="text-stone-600">/</span>}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: Header switcher (compact badge/toggle)
  return (
    <div className={`flex items-center rounded-full bg-stone-900/60 backdrop-blur-md p-0.5 border border-stone-700/60 shadow-sm ${className}`}>
      {locales.map((loc) => {
        const isActive = loc === currentLocale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => handleLanguageChange(loc)}
            aria-label={`Switch to ${localeLabels[loc].nativeName}`}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
