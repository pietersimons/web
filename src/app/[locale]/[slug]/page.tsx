import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import {
  CUSTOM_PAGE_QUERY,
  ALL_PAGES_SLUGS_QUERY,
} from "@/sanity/queries/pages.queries";
import { PageBuilder } from "@/components/page-builder";
import { Badge } from "@/components/ui/badge";
import { locales, Locale, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const items = await client.fetch(ALL_PAGES_SLUGS_QUERY);
    const params: Array<{ locale: string; slug: string }> = [];

    for (const locale of locales) {
      for (const item of items) {
        if (item.slug) {
          params.push({ locale, slug: item.slug });
        }
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const activeLocale = isValidLocale(locale) ? locale : defaultLocale;
  const page: any = await client.fetch(CUSTOM_PAGE_QUERY, { slug, language: activeLocale });

  if (!page) {
    return { title: "Page Not Found" };
  }

  const title = typeof page.title === "string" ? page.title : "Travelwild";
  const metaTitle = typeof page.seo?.metaTitle === "string" ? page.seo.metaTitle : `${title} | Travelwild`;
  const metaDescription = typeof page.seo?.metaDescription === "string" ? page.seo.metaDescription : title;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `/${activeLocale}/${slug}`,
      languages: {
        "nl-NL": `/nl/${slug}`,
        "en-US": `/en/${slug}`,
        "x-default": `/nl/${slug}`,
      },
    },
  };
}

export default async function GenericCustomPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const activeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const page: any = await client.fetch(CUSTOM_PAGE_QUERY, { slug, language: activeLocale });

  if (!page) {
    notFound();
  }

  return (
    <div>
      {page.pageBuilder && page.pageBuilder.length > 0 ? (
        <PageBuilder blocks={page.pageBuilder} />
      ) : (
        <div className="container mx-auto px-4 max-w-4xl py-24 text-center">
          <Badge variant="accent" className="mb-4">
            Travelwild
          </Badge>
          <h1 className="font-hero text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-wide text-foreground mb-6">
            {typeof page.title === "string" ? page.title : "Untitled Page"}
          </h1>
          <p className="text-muted-foreground text-base">
            {activeLocale === "nl"
              ? "Deze pagina wacht op inhoud in Sanity Studio."
              : "This page is awaiting content in Sanity Studio."}
          </p>
        </div>
      )}
    </div>
  );
}
