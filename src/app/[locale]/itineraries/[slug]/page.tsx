import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
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
import { FAQBlock } from "@/components/blocks/FAQBlock";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
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
  const trip: any = await client.fetch(ITINERARY_DETAIL_QUERY, { slug, language: activeLocale });

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

  const trip: any = await client.fetch(ITINERARY_DETAIL_QUERY, { slug, language: activeLocale });

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
      />

      {/* 2. Specs Bar */}
      <TripSpecsBar
        durationDays={trip.tripSpecs?.durationDays ?? undefined}
        durationNights={trip.tripSpecs?.durationNights ?? undefined}
        difficulty={trip.tripSpecs?.difficulty ?? undefined}
        groupSize={typeof trip.tripSpecs?.groupSize === "string" ? trip.tripSpecs.groupSize : undefined}
        startLocation={trip.tripSpecs?.startLocation ?? undefined}
        endLocation={trip.tripSpecs?.endLocation ?? undefined}
        minimumAge={trip.tripSpecs?.minimumAge ?? undefined}
      />

      {/* 3. Overview & Highlights */}
      <div className="container mx-auto px-4 max-w-7xl pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Main Content */}
          <div className="lg:col-span-8 space-y-16">
            {/* Overview Summary */}
            {trip.summary && (
              <div className="space-y-4">
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                  {isNl ? "Overzicht van de Reis" : "Overview"}
                </h2>
                <p className="text-base sm:text-lg text-foreground/85 leading-relaxed">
                  {typeof trip.summary === "string" ? trip.summary : ""}
                </p>
              </div>
            )}

            {/* Day-by-Day Program */}
            {trip.dayByDay && <DayByDayTimeline days={trip.dayByDay} />}

            {/* Inclusions / Exclusions */}
            {trip.inclusionsExclusions && (
              <InclusionsExclusionsBox
                included={trip.inclusionsExclusions.included ?? undefined}
                excluded={trip.inclusionsExclusions.excluded ?? undefined}
              />
            )}

            {/* Departures Table */}
            {trip.departures && trip.departures.length > 0 && (
              <DeparturesTable
                departures={trip.departures}
                tripTitle={title}
                currency={trip.pricing?.currency ?? undefined}
              />
            )}

            {/* Preparation Steps */}
            {trip.stepByStepGuide && (
              <BookingStepsGuide steps={trip.stepByStepGuide} />
            )}
          </div>

          {/* Right Sticky Highlights Box */}
          <div className="lg:col-span-4 space-y-8">
            {trip.highlights && trip.highlights.length > 0 && (
              <div className="bg-card rounded-2xl p-6 sm:p-7 border border-border/80 shadow-md sticky top-28">
                <h3 className="font-heading text-lg font-bold text-foreground mb-4 pb-3 border-b border-border/60">
                  {isNl ? "Hoogtepunten van deze Reis" : "Expedition Highlights"}
                </h3>
                <ul className="space-y-3">
                  {trip.highlights.map((hl: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90">
                      <div className="h-5 w-5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>{typeof hl === "string" ? hl : ""}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              <h2 className="font-heading text-3xl font-extrabold text-foreground">
                {isNl ? "Vergelijkbare Rondreizen" : "Similar Expeditions"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trip.relatedItineraries.map((rTrip: any) => (
                <ItineraryCard key={rTrip._id} {...rTrip} />
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
      />
    </div>
  );
}
