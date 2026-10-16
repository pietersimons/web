'use client';

import React, { createContext, useContext, useState, useSyncExternalStore, ReactNode } from 'react';
import {
  CookieConsentCategories,
  CookieConsentPayload,
  ACCEPT_ALL_CATEGORIES,
  REJECT_ALL_CATEGORIES,
  CONSENT_UPDATE_EVENT,
} from '@/lib/cookies/consent-types';
import {
  getStoredConsent,
  saveStoredConsent,
  clearStoredConsent,
} from '@/lib/cookies/consent-storage';
import { Locale, defaultLocale } from '@/lib/i18n/config';

interface CookieConsentContextType {
  consent: CookieConsentPayload | null;
  isBannerOpen: boolean;
  isPreferencesOpen: boolean;
  hasMounted: boolean;
  locale: Locale;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (categories: CookieConsentCategories) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const emptySubscribe = () => () => {};

function subscribeConsent(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CONSENT_UPDATE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CONSENT_UPDATE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedConsent: CookieConsentPayload | null = null;
let lastSerialized: string | null = null;

function getConsentSnapshot(): CookieConsentPayload | null {
  const current = getStoredConsent();
  const serialized = current ? JSON.stringify(current) : null;
  if (serialized !== lastSerialized) {
    lastSerialized = serialized;
    cachedConsent = current;
  }
  return cachedConsent;
}

function getServerSnapshot(): null {
  return null;
}

interface CookieConsentProviderProps {
  children: ReactNode;
  locale?: Locale;
}

export function CookieConsentProvider({
  children,
  locale = defaultLocale,
}: CookieConsentProviderProps) {
  // Safe hydration detection without cascading renders
  const hasMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Synchronize with external cookie storage
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerSnapshot
  );

  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [bannerDismissedLocally, setBannerDismissedLocally] = useState<boolean>(false);

  // Banner is open if user hasn't consented yet and hasn't dismissed it in the active session
  const isBannerOpen = hasMounted && !consent?.hasConsented && !bannerDismissedLocally;

  const acceptAll = () => {
    saveStoredConsent(ACCEPT_ALL_CATEGORIES);
    setBannerDismissedLocally(true);
    setIsPreferencesOpen(false);
  };

  const rejectNonEssential = () => {
    saveStoredConsent(REJECT_ALL_CATEGORIES);
    setBannerDismissedLocally(true);
    setIsPreferencesOpen(false);
  };

  const savePreferences = (categories: CookieConsentCategories) => {
    saveStoredConsent(categories);
    setBannerDismissedLocally(true);
    setIsPreferencesOpen(false);
  };

  const openPreferences = () => {
    setIsPreferencesOpen(true);
  };

  const closePreferences = () => {
    setIsPreferencesOpen(false);
  };

  const resetConsent = () => {
    clearStoredConsent();
    setBannerDismissedLocally(false);
    setIsPreferencesOpen(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        isBannerOpen,
        isPreferencesOpen,
        hasMounted,
        locale,
        acceptAll,
        rejectNonEssential,
        savePreferences,
        openPreferences,
        closePreferences,
        resetConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
