import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import {
  ITINERARY_DETAIL_QUERY,
  ALL_ITINERARIES_SLUGS_QUERY,
} from "@/sanity/queries/itinerary.queries";
import { TripHeroSection } from "@/components/itinerary/TripHeroSection";
import { TripSpecsBar } from "@/components/itinerary/TripSpecsBar";
import { DayByDayTimeline } from "@/components/itinerary/DayByDayTimeline";
import { InclusionsExclusionsBox } from "@/components/itinerary/InclusionsExclusionsBox";
import { DeparturesTable } from "@/components/itinerary/DeparturesTable";
import { BookingStepsGuide } from "@/components/itinerary/BookingStepsGuide";
import { StickyBookingBar } from "@/components/itinerary/StickyBookingBar";
import { TripBookingSidebar } from "@/components/itinerary/TripBookingSidebar";
import { FAQBlock } from "@/components/blocks/FAQBlock";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { Badge } from "@/components/ui/badge";
import { locales, Locale, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const items = await client.fetch(ALL_ITINERARIES_SLUGS_QUERY);
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
  const { data: trip }: { data: any } = await sanityFetch({
    query: ITINERARY_DETAIL_QUERY,
    params: { slug, language: activeLocale },
    stega: false,
  });

  if (!trip) {
    return { title: "Trip Not Found" };
  }

  const isNl = activeLocale === "nl";
  const title = typeof trip.title === "string" ? trip.title : "Expedition";
  const metaTitle = typeof trip.seo?.metaTitle === "string" ? trip.seo.metaTitle : `${title} — Travelwild ${isNl ? "Rondreis" : "Expedition"}`;
  const metaDescription = typeof trip.seo?.metaDescription === "string" ? trip.seo.metaDescription : (typeof trip.subtitle === "string" ? trip.subtitle : `Join the ${title} adventure with Travelwild.`);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `/${activeLocale}/itineraries/${slug}`,
      languages: {
        "nl-NL": `/nl/itineraries/${slug}`,
        "en-US": `/en/itineraries/${slug}`,
        "x-default": `/nl/itineraries/${slug}`,
      },
    },
  };
}

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const activeLocale: Locale = isValidLocale(locale) ? locale : defaultLocale;
  const isNl = activeLocale === "nl";

  const { data: trip }: { data: any } = await sanityFetch({
    query: ITINERARY_DETAIL_QUERY,
    params: { slug, language: activeLocale },
  });

  if (!trip) {
    notFound();
  }

  const title = typeof trip.title === "string" ? trip.title : "";
  const subtitle = typeof trip.subtitle === "string" ? trip.subtitle : undefined;

  return (
    <div>
      {/* 1. Trip Hero */}
      <TripHeroSection
        title={title}
        subtitle={subtitle}
        destination={trip.destination ?? undefined}
        featuredImage={trip.featuredImage ?? undefined}
        travelStyle={trip.travelStyle ?? undefined}
        pricing={trip.pricing ?? undefined}
        locale={activeLocale}
      />

      {/* 2. Specs Bar */}
      <TripSpecsBar
        durationDays={trip.tripSpecs?.durationDays ?? undefined}
        durationNights={trip.tripSpecs?.durationNights ?? undefined}
        difficulty={trip.tripSpecs?.difficulty ?? undefined}
        groupSize={typeof trip.tripSpecs?.groupSize === "string" ? trip.tripSpecs.groupSize : undefined}
        minimumAge={trip.tripSpecs?.minimumAge ?? undefined}
        locale={activeLocale}
      />

      {/* 3. Overview & Highlights */}
      <div className="container mx-auto px-4 max-w-7xl pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Main Content */}
          <div className="lg:col-span-8 space-y-16">
            {/* Overview Summary */}
            {trip.summary && (
              <div className="space-y-4">
                <h2 className="font-hero text-3xl sm:text-4xl font-bold uppercase tracking-wide text-foreground">
                  {isNl ? "Overzicht van de Reis" : "Overview"}
                </h2>
                <p className="text-base sm:text-lg text-foreground/85 leading-relaxed">
                  {typeof trip.summary === "string" ? trip.summary : ""}
                </p>
              </div>
            )}

            {/* Day-by-Day Program */}
            {trip.dayByDay && (
              <DayByDayTimeline days={trip.dayByDay} locale={activeLocale} />
            )}

            {/* Inclusions / Exclusions */}
            {trip.inclusionsExclusions && (
              <InclusionsExclusionsBox
                included={trip.inclusionsExclusions.included ?? undefined}
                excluded={trip.inclusionsExclusions.excluded ?? undefined}
                locale={activeLocale}
              />
            )}

            {/* Departures Table */}
            {trip.departures && trip.departures.length > 0 && (
              <DeparturesTable
                departures={trip.departures}
                tripTitle={title}
                currency={trip.pricing?.currency ?? undefined}
                locale={activeLocale}
              />
            )}

            {/* Optional Preparation Steps */}
            {trip.stepByStepGuide && (
              <BookingStepsGuide steps={trip.stepByStepGuide} locale={activeLocale} />
            )}
          </div>

          {/* Right Sticky Booking & Highlights Sidebar */}
          <div className="lg:col-span-4">
            <TripBookingSidebar
              tripTitle={title}
              pricing={trip.pricing ?? undefined}
              highlights={trip.highlights ?? []}
              departures={trip.departures ?? []}
              locale={activeLocale}
            />
          </div>
        </div>
      </div>

      {/* Trip Specific FAQs */}
      {trip.faq && trip.faq.length > 0 && (
        <FAQBlock
          badge={isNl ? "Goed om te weten" : "Good to Know"}
          heading={isNl ? "Veelgestelde Vragen over deze Reis" : "Frequently Asked Questions"}
          items={trip.faq}
        />
      )}

      {/* Related Itineraries */}
      {trip.relatedItineraries && trip.relatedItineraries.length > 0 && (
        <section className="py-16 bg-background border-t border-border/60">
          <div className="container mx-auto px-4 max-w-7xl space-y-8">
            <div>
              <Badge variant="accent" className="mb-2">
                {isNl ? `Meer in ${trip.destination?.title || "deze regio"}` : `More in ${trip.destination?.title || "this region"}`}
              </Badge>
              <h2 className="font-hero text-3xl sm:text-4xl font-bold uppercase tracking-wide text-foreground">
                {isNl ? "Vergelijkbare Rondreizen" : "Similar Expeditions"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trip.relatedItineraries.map((rTrip: any) => (
                <ItineraryCard key={rTrip._id} {...rTrip} locale={activeLocale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating Sticky Booking Bar on Scroll */}
      <StickyBookingBar
        title={title}
        priceFrom={trip.pricing?.priceFrom ?? undefined}
        currency={trip.pricing?.currency ?? undefined}
        locale={activeLocale}
      />
    </div>
  );
}
