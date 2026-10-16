'use client';

import Link from 'next/link';
import { ShieldCheck, Settings2 } from 'lucide-react';
import { useCookieConsent } from './CookieConsentProvider';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localizePath } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/button';

export function CookieBanner() {
  const { isBannerOpen, hasMounted, locale, acceptAll, rejectNonEssential, openPreferences } =
    useCookieConsent();

  if (!hasMounted || !isBannerOpen) {
    return null;
  }

  const dict = getDictionary(locale);
  const t = dict.cookieBanner;

  return (
    <aside
      aria-label={t.title}
      className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 lg:left-auto lg:right-6 lg:max-w-2xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-5 sm:p-6 shadow-2xl backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10">
        {/* Decorative subtle ambient highlight */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent/10 blur-2xl" />

        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
                {t.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t.description}{' '}
                <Link
                  href={localizePath('/privacy', locale)}
                  className="font-medium text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
                >
                  {t.privacyPolicy}
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Symmetrical European-Compliant Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openPreferences}
              className="order-3 sm:order-1 text-xs gap-1.5"
            >
              <Settings2 className="h-3.5 w-3.5" />
              {t.customize}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={rejectNonEssential}
              className="order-2 sm:order-2 text-xs font-semibold hover:border-foreground/30"
            >
              {t.rejectNonEssential}
            </Button>

            <Button
              type="button"
              variant="accent"
              size="sm"
              onClick={acceptAll}
              className="order-1 sm:order-3 text-xs font-semibold shadow-md"
            >
              {t.acceptAll}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
