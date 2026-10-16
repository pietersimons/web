import {
  CookieConsentCategories,
  CookieConsentPayload,
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_VERSION,
  COOKIE_EXPIRY_DAYS,
  CONSENT_UPDATE_EVENT,
} from './consent-types';

export function getStoredConsent(): CookieConsentPayload | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // 1. Try reading from cookie first
    const cookieMatch = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${COOKIE_CONSENT_KEY}=`));

    let rawData: string | null = null;

    if (cookieMatch) {
      rawData = decodeURIComponent(cookieMatch.split('=')[1]);
    } else {
      // 2. Fallback to localStorage if cookie was cleared but localStorage remains
      rawData = localStorage.getItem(COOKIE_CONSENT_KEY);
    }

    if (!rawData) {
      return null;
    }

    const payload: CookieConsentPayload = JSON.parse(rawData);

    // Validate version integrity
    if (payload.version !== COOKIE_CONSENT_VERSION) {
      return null;
    }

    // Validate expiration
    const consentDate = new Date(payload.timestamp).getTime();
    const now = Date.now();
    const maxAgeMs = COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    if (isNaN(consentDate) || now - consentDate > maxAgeMs) {
      clearStoredConsent();
      return null;
    }

    // Ensure necessary is always true
    payload.categories = {
      ...payload.categories,
      necessary: true,
    };

    return payload;
  } catch (err) {
    console.error('Error reading cookie consent state:', err);
    return null;
  }
}

export function saveStoredConsent(categories: CookieConsentCategories): CookieConsentPayload {
  const payload: CookieConsentPayload = {
    version: COOKIE_CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    categories: {
      ...categories,
      necessary: true, // Always true under GDPR/ePrivacy
    },
    hasConsented: true,
  };

  if (typeof window !== 'undefined') {
    try {
      const jsonString = JSON.stringify(payload);
      const isHttps = window.location.protocol === 'https:';
      const maxAgeSeconds = COOKIE_EXPIRY_DAYS * 24 * 60 * 60;

      // Set first-party cookie across entire site
      document.cookie = `${COOKIE_CONSENT_KEY}=${encodeURIComponent(
        jsonString
      )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${isHttps ? '; Secure' : ''}`;

      // Mirror in localStorage for fast synchronous hydration
      localStorage.setItem(COOKIE_CONSENT_KEY, jsonString);

      // Dispatch custom browser event for instant cross-component and tag listener reactions
      window.dispatchEvent(
        new CustomEvent(CONSENT_UPDATE_EVENT, {
          detail: payload,
        })
      );
    } catch (err) {
      console.error('Error saving cookie consent state:', err);
    }
  }

  return payload;
}

export function clearStoredConsent(): void {
  if (typeof window === 'undefined') return;

  try {
    document.cookie = `${COOKIE_CONSENT_KEY}=; path=/; max-age=0; SameSite=Lax`;
    localStorage.removeItem(COOKIE_CONSENT_KEY);

    window.dispatchEvent(
      new CustomEvent(CONSENT_UPDATE_EVENT, {
        detail: null,
      })
    );
  } catch (err) {
    console.error('Error clearing cookie consent state:', err);
  }
}
