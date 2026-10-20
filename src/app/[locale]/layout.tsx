import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Bebas_Neue, Plus_Jakarta_Sans, Cinzel } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { sanityFetch, SanityLive } from "@/sanity/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries/pages.queries";
import { locales, defaultLocale, Locale, isValidLocale } from "@/lib/i18n/config";
import { GoogleConsentMode } from "@/components/analytics/GoogleConsentMode";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import {
  CookieConsentProvider,
  CookieBanner,
  CookiePreferencesDialog,
  CookieConsentTrigger,
} from "@/components/cookies";
import "../globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hero-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isValidLocale(locale) ? locale : defaultLocale;

  return {
    title: {
      default:
        activeLocale === "nl"
          ? "Travelwild — Kleinschalige & Duurzame Avontuurlijke Reizen"
          : "Travelwild — Authentic Small-Group & Custom Expeditions",
      template: "%s | Travelwild",
    },
    description:
      activeLocale === "nl"
        ? "Duurzame groepsreizen en op maat gemaakte wildernisexpedities naar de mooiste plekken ter wereld."
        : "Immersive, sustainable small group tours and bespoke tailor-made wilderness adventures across the globe.",
    alternates: {
      canonical: `/${activeLocale}`,
      languages: {
        "nl-NL": "/nl",
        "en-US": "/en",
        "x-default": "/nl",
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const { isEnabled: isDraftMode } = await draftMode();

  let settings: any = null;
  try {
    const res = await sanityFetch({
      query: SITE_SETTINGS_QUERY,
      params: { language: activeLocale },
    });
    settings = res.data;
  } catch (error) {
    console.error("Failed to load site settings:", error);
  }

  return (
    <html lang={activeLocale}>
      <head>
        <GoogleConsentMode />
      </head>
      <body className={`${plusJakartaSans.variable} ${bebasNeue.variable} ${cinzel.variable} min-h-screen flex flex-col font-sans antialiased bg-background text-foreground selection:bg-accent selection:text-white`}>
        <CookieConsentProvider locale={activeLocale}>
          <GoogleAnalytics measurementId={settings?.analytics?.googleAnalyticsId} />
          <Header
            siteName={settings?.siteName || "Travelwild"}
            logo={settings?.logo}
            logoLight={settings?.logoLight}
            navigation={settings?.navigation}
            contactInfo={settings?.contactInfo}
            currentLocale={activeLocale}
          />
          <main className="flex-1">{children}</main>
          <Footer
            siteName={settings?.siteName || "Travelwild"}
            footer={settings?.footer}
            contactInfo={settings?.contactInfo}
            socialLinks={settings?.socialLinks}
            currentLocale={activeLocale}
          />
          <CookieBanner />
          <CookiePreferencesDialog />
          <CookieConsentTrigger />
        </CookieConsentProvider>
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
