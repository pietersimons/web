import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import {
  DESTINATION_DETAIL_QUERY,
  ALL_DESTINATIONS_SLUGS_QUERY,
} from "@/sanity/queries/destination.queries";
import { SanityImage } from "@/components/shared/SanityImage";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer";
import { QuickFactsGrid } from "@/components/destination/QuickFactsGrid";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { CTABlock } from "@/components/blocks/CTABlock";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { locales, Locale, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const items = await client.fetch(ALL_DESTINATIONS_SLUGS_QUERY);
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
  const dest: any = await client.fetch(DESTINATION_DETAIL_QUERY, { slug, language: activeLocale });

  if (!dest) {
    return { title: "Destination Not Found" };
  }

  const isNl = activeLocale === "nl";
  const title = typeof dest.title === "string" ? dest.title : "Destination";
  const metaTitle = typeof dest.seo?.metaTitle === "string" ? dest.seo.metaTitle : `${title} ${isNl ? "Reisgids & Rondreizen" : "Travel Guide & Expeditions"}`;
  const metaDescription = typeof dest.seo?.metaDescription === "string" ? dest.seo.metaDescription : (typeof dest.summary === "string" ? dest.summary : `Explore expeditions in ${title}`);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `/${activeLocale}/destinations/${slug}`,
      languages: {
        "nl-NL": `/nl/destinations/${slug}`,
        "en-US": `/en/destinations/${slug}`,
        "x-default": `/nl/destinations/${slug}`,
      },
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const activeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const isNl = activeLocale === "nl";

  const dest: any = await client.fetch(DESTINATION_DETAIL_QUERY, { slug, language: activeLocale });

  if (!dest) {
    notFound();
  }

  const title = typeof dest.title === "string" ? dest.title : "";
  const tagline = typeof dest.tagline === "string" ? dest.tagline : "";

  return (
    <div>
      {/* Destination Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 lg:py-28">
        {dest.featuredImage?.asset && (
          <div className="absolute inset-0 z-0 opacity-30">
            <SanityImage
              image={dest.featuredImage}
              alt={title}
              width={1920}
              height={800}
              priority
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/80" />
          </div>
        )}

        <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
          {dest.region && (
            <Badge variant="accent" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              {dest.region}
            </Badge>
          )}
          <h1 className="font-hero text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-wide text-white">
            {title}
          </h1>
          {tagline && (
            <p className="mt-4 text-lg sm:text-2xl text-primary-foreground/85 max-w-2xl mx-auto leading-relaxed font-light">
              {tagline}
            </p>
          )}
        </div>
      </section>

      {/* Main Content & Guide */}
      <div className="container mx-auto px-4 max-w-7xl py-16 space-y-16">
        {/* Quick Facts Grid */}
        {dest.travelGuide && (
          <QuickFactsGrid
            guide={{
              bestTimeToVisit: typeof dest.travelGuide.bestTimeToVisit === "string" ? dest.travelGuide.bestTimeToVisit : undefined,
              climate: typeof dest.travelGuide.climate === "string" ? dest.travelGuide.climate : undefined,
              currency: typeof dest.travelGuide.currency === "string" ? dest.travelGuide.currency : undefined,
              visaInfo: typeof dest.travelGuide.visaInfo === "string" ? dest.travelGuide.visaInfo : undefined,
              languages: typeof dest.travelGuide.languages === "string" ? dest.travelGuide.languages : undefined,
              timeZone: typeof dest.travelGuide.timeZone === "string" ? dest.travelGuide.timeZone : undefined,
            }}
          />
        )}

        {/* Overview & Description */}
        {dest.overview && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="font-hero text-3xl sm:text-4xl font-bold uppercase tracking-wide text-foreground">
              {isNl ? `Over reizen in ${title}` : `About Traveling in ${title}`}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableTextRenderer value={dest.overview} />
            </div>
          </div>
        )}

        {/* Itineraries in this Destination */}
        {dest.itineraries && dest.itineraries.length > 0 && (
          <div className="space-y-8 pt-8 border-t border-border/60">
            <div>
              <Badge variant="accent" className="mb-2">
                {isNl ? "Beschikbare Rondreizen" : "Available Expeditions"}
              </Badge>
              <h2 className="font-hero text-3xl sm:text-4xl font-bold uppercase tracking-wide text-foreground">
                {isNl ? `Rondreizen in ${title}` : `Trips in ${title}`}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {dest.itineraries.map((trip: any) => (
                <ItineraryCard key={trip._id} {...trip} locale={activeLocale} />
              ))}
            </div>
          </div>
        )}
      </div>

      <CTABlock
        badge={isNl ? "Maatwerkreis Samenstellen" : "Custom Trip Planning"}
        heading={isNl ? `Wil je een reis op maat in ${title}?` : `Want a tailor-made adventure in ${title}?`}
        description={
          isNl
            ? "Onze bestemmingsexperts stellen een uniek reisvoorstel samen dat perfect aansluit bij jouw schema, tempo en voorkeuren."
            : "Our destination specialists can design a personalized route matching your exact schedule, physical fitness, and accommodation preferences."
        }
        primaryButton={{ label: isNl ? "Vrijblijvend Reisvoorstel" : "Request Custom Proposal", url: "/travel-on-demand" }}
        theme="dark"
      />
    </div>
  );
}
