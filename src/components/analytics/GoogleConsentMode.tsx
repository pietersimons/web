'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { CONSENT_UPDATE_EVENT, CookieConsentPayload } from '@/lib/cookies/consent-types';
import { getStoredConsent } from '@/lib/cookies/consent-storage';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Initializes Google Consent Mode v2 before any scripts execute.
 * Ensures strict compliance with European GDPR & ePrivacy regulations by defaulting
 * all tracking to 'denied' until affirmative consent is recorded.
 */
export function GoogleConsentMode() {
  useEffect(() => {
    // Synchronize initial stored consent state if already available
    const stored = getStoredConsent();
    if (stored && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: stored.categories.analytics ? 'granted' : 'denied',
        ad_storage: stored.categories.marketing ? 'granted' : 'denied',
        ad_user_data: stored.categories.marketing ? 'granted' : 'denied',
        ad_personalization: stored.categories.marketing ? 'granted' : 'denied',
      });
    }

    // Listen to real-time consent updates dispatched across the site
    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<CookieConsentPayload | null>;
      const consent = customEvent.detail;

      if (window.gtag) {
        if (consent && consent.categories) {
          window.gtag('consent', 'update', {
            analytics_storage: consent.categories.analytics ? 'granted' : 'denied',
            ad_storage: consent.categories.marketing ? 'granted' : 'denied',
            ad_user_data: consent.categories.marketing ? 'granted' : 'denied',
            ad_personalization: consent.categories.marketing ? 'granted' : 'denied',
          });
        } else {
          // If consent is cleared or reset
          window.gtag('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          });
        }
      }
    };

    window.addEventListener(CONSENT_UPDATE_EVENT, handleConsentUpdate);
    return () => {
      window.removeEventListener(CONSENT_UPDATE_EVENT, handleConsentUpdate);
    };
  }, []);

  // Standard Google Consent Mode v2 initialization inline script
  const consentModeInitScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    // Check if consent was already recorded in document.cookie to avoid unnecessary latency
    var initialAnalytics = 'denied';
    var initialMarketing = 'denied';
    
    try {
      var match = document.cookie.match(/(^|; )travelwild_cookie_consent=([^;]+)/);
      if (match) {
        var parsed = JSON.parse(decodeURIComponent(match[2]));
        if (parsed && parsed.categories) {
          initialAnalytics = parsed.categories.analytics ? 'granted' : 'denied';
          initialMarketing = parsed.categories.marketing ? 'granted' : 'denied';
        }
      }
    } catch(e) {}

    gtag('consent', 'default', {
      'analytics_storage': initialAnalytics,
      'ad_storage': initialMarketing,
      'ad_user_data': initialMarketing,
      'ad_personalization': initialMarketing,
      'wait_for_update': 500
    });
  `;

  return (
    <Script
      id="google-consent-mode-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: consentModeInitScript }}
    />
  );
}
