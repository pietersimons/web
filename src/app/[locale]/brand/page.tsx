import { Metadata } from "next";
import { BrandGuideClient } from "@/components/brand/BrandGuideClient";
import { Locale, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isValidLocale(locale) ? locale : defaultLocale;
  const isNl = activeLocale === "nl";

  return {
    title: isNl
      ? "Brand Book & Design Systeem — Travelwild"
      : "Brand Book & Design System — Travelwild",
    description: isNl
      ? "Consolidatie van de primaire en secundaire kleuren, lettertypen, logo-specificaties en designtokens van het merk Travelwild."
      : "Consolidation of the primary and secondary colors, typography, logo specifications, and design tokens of the Travelwild brand.",
    alternates: {
      canonical: `/${activeLocale}/brand`,
      languages: {
        "nl-NL": "/nl/brand",
        "en-US": "/en/brand",
        "x-default": "/nl/brand",
      },
    },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;

  return <BrandGuideClient currentLocale={activeLocale} />;
}
