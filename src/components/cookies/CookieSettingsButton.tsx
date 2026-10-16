'use client';

import { useCookieConsent } from './CookieConsentProvider';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { Locale } from '@/lib/i18n/config';

interface CookieSettingsButtonProps {
  currentLocale: Locale;
  className?: string;
}

export function CookieSettingsButton({
  currentLocale,
  className = 'hover:text-white transition-colors cursor-pointer text-xs text-left',
}: CookieSettingsButtonProps) {
  const { openPreferences } = useCookieConsent();
  const dict = getDictionary(currentLocale);

  return (
    <button
      type="button"
      onClick={openPreferences}
      className={className}
    >
      {dict.common.cookieSettings}
    </button>
  );
}
