'use client';

import { Cookie } from 'lucide-react';
import { useCookieConsent } from './CookieConsentProvider';
import { getDictionary } from '@/lib/i18n/dictionaries';

export function CookieConsentTrigger() {
  const { isBannerOpen, hasMounted, locale, openPreferences } = useCookieConsent();

  // Don't show while the initial banner is open to avoid visual clutter
  if (!hasMounted || isBannerOpen) {
    return null;
  }

  const dict = getDictionary(locale);
  const title = dict.cookieBanner.floatingBadge;

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        type="button"
        onClick={openPreferences}
        aria-label={title}
        title={title}
        className="group flex items-center gap-2 rounded-full bg-card/95 text-foreground/85 border border-border/80 p-2.5 sm:px-3 sm:py-2 shadow-xl backdrop-blur-md transition-all duration-200 hover:text-accent hover:border-accent/60 hover:shadow-2xl hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      >
        <Cookie className="h-4.5 w-4.5 text-accent shrink-0" />
        <span className="text-xs font-semibold max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
          {title}
        </span>
      </button>
    </div>
  );
}
