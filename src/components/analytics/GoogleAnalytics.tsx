'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getStoredConsent } from '@/lib/cookies/consent-storage';
import { CONSENT_UPDATE_EVENT, CookieConsentPayload } from '@/lib/cookies/consent-types';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

/**
 * Google Analytics (GA4) integration component.
 * Respects European GDPR requirements:
 * 1. Only loads tag when measurementId is configured.
 * 2. Works seamlessly with Google Consent Mode v2.
 * 3. Anonymizes IP addresses by default.
 */
export function GoogleAnalytics({
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
}: GoogleAnalyticsProps) {
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check initial consent
    const stored = getStoredConsent();
    if (stored?.categories.analytics) {
      setHasAnalyticsConsent(true);
    }

    // Listen to consent changes
    const onConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<CookieConsentPayload | null>;
      const consent = customEvent.detail;
      setHasAnalyticsConsent(Boolean(consent?.categories.analytics));
    };

    window.addEventListener(CONSENT_UPDATE_EVENT, onConsentChange);
    return () => {
      window.removeEventListener(CONSENT_UPDATE_EVENT, onConsentChange);
    };
  }, []);

  // Track page navigation changes when analytics consent is granted
  useEffect(() => {
    if (hasAnalyticsConsent && measurementId && typeof window.gtag === 'function') {
      window.gtag('config', measurementId, {
        page_path: pathname,
        anonymize_ip: true,
      });
    }
  }, [pathname, hasAnalyticsConsent, measurementId]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              anonymize_ip: true,
              send_page_view: ${hasAnalyticsConsent ? 'true' : 'false'}
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Safe event tracking helper that verifies user consent before dispatching events to GA4.
 */
export function trackAnalyticsEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  const stored = getStoredConsent();
  if (stored?.categories.analytics && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
