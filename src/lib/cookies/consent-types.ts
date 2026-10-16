export interface CookieConsentCategories {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface CookieConsentPayload {
  version: string;
  timestamp: string;
  categories: CookieConsentCategories;
  hasConsented: boolean;
}

export const COOKIE_CONSENT_KEY = 'travelwild_cookie_consent';
export const COOKIE_CONSENT_VERSION = '1.0';
export const COOKIE_EXPIRY_DAYS = 180; // 6 months in line with EDPB guidelines
export const CONSENT_UPDATE_EVENT = 'travelwild_consent_update';

export const DEFAULT_CATEGORIES: CookieConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export const ACCEPT_ALL_CATEGORIES: CookieConsentCategories = {
  necessary: true,
  analytics: true,
  marketing: true,
  functional: true,
};

export const REJECT_ALL_CATEGORIES: CookieConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};
